import AsyncStorage from '@react-native-async-storage/async-storage';
import { VENUES, Venue } from './venues';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Vibe = 'romantic' | 'social' | 'adventure' | 'chill';
export type BudgetTier = 'under20' | '20to40' | '40to75' | 'nolimit';
export type GroupSize = 'solo' | 'duo' | 'small' | 'large';
export type DietaryPref = 'vegan' | 'vegetarian' | 'gluten-free' | 'halal' | 'none';
export type Availability = 'weekday_eve' | 'fri_night' | 'weekend_day' | 'weekend_night';
export type Category = 'coffee' | 'restaurant' | 'bar' | 'activity' | 'outdoor';

export interface UserProfile {
  // Identity (screen 1)
  first_name: string;
  last_name: string;
  phone: string;
  // Location (screen 3)
  city: string;
  // Optional enrichment (screens 4–5)
  photo_uploaded?: boolean;
  calendar_connected?: string[];
  // Preferences (screens 6–10)
  interests: string[];
  experiences: string[];
  vibe: string;
  budget_tier: BudgetTier;
  pain_point: string;
  // Meta
  onboarding_complete: boolean;
  joined_at: string;
  // Derived / legacy compat
  handle?: string;
  name?: string;
  vibes?: Vibe[];
  group_size?: GroupSize;
  dietary?: DietaryPref[];
  availability?: Availability[];
  categories?: Category[];
}

export interface ScoredVenue extends Venue {
  match_score: number;
  match_reasons: string[];
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const PROFILE_KEY = '@blyss_profile';
const JOURNAL_KEY = '@blyss_journal';
const DRAFT_KEY   = '@blyss_draft';

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_KEY);
}

export async function saveDraft(data: Record<string, unknown>): Promise<void> {
  const raw = await AsyncStorage.getItem(DRAFT_KEY);
  const draft = raw ? JSON.parse(raw) : {};
  await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, ...data }));
}

export async function loadDraft(): Promise<Record<string, unknown>> {
  const raw = await AsyncStorage.getItem(DRAFT_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function clearDraft(): Promise<void> {
  await AsyncStorage.removeItem(DRAFT_KEY);
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  venue_id: string;
  venue_name: string;
  date: string;
  note?: string;
  with_who?: string[];
  rating?: number;
}

export async function loadJournal(): Promise<JournalEntry[]> {
  const raw = await AsyncStorage.getItem(JOURNAL_KEY);
  return raw ? JSON.parse(raw) : MOCK_JOURNAL;
}

export async function addJournalEntry(entry: JournalEntry): Promise<void> {
  const journal = await loadJournal();
  await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify([entry, ...journal]));
}

// ─── Scoring Engine ───────────────────────────────────────────────────────────

const BUDGET_THRESHOLDS: Record<BudgetTier, number> = {
  under20: 20,
  '20to40': 40,
  '40to75': 75,
  nolimit: 9999,
};

// experiences[] strings → venue category strings
const EXPERIENCE_TO_CATEGORY: Record<string, string[]> = {
  'Dinner':        ['restaurant'],
  'Brunch':        ['restaurant', 'coffee'],
  'Bars & Drinks': ['bar'],
  'Live Music':    ['bar'],
  'Activities':    ['activity'],
  'Coffee Hangs':  ['coffee'],
  'Outdoor Stuff': ['outdoor'],
  'Arts & Culture':['activity'],
};

const GROUP_SIZE_RANGE: Record<GroupSize, [number, number]> = {
  solo:  [1, 2],
  duo:   [1, 4],
  small: [2, 10],
  large: [4, 999],
};

const VIBE_WEIGHT     = 0.30;
const BUDGET_WEIGHT   = 0.25;
const CATEGORY_WEIGHT = 0.20;
const GROUP_WEIGHT    = 0.15;
const RATING_WEIGHT   = 0.10;

export function scoreVenue(venue: Venue, profile: UserProfile): ScoredVenue {
  const reasons: string[] = [];
  let score = 0;

  // 1. Hard filter: budget
  const budgetMax = BUDGET_THRESHOLDS[profile.budget_tier] ?? 9999;
  if (venue.avg_cost_pp > budgetMax) {
    return { ...venue, match_score: 0, match_reasons: [] };
  }

  // 2. Hard filter: group size (when profile has one)
  if (profile.group_size) {
    const [gMin, gMax] = GROUP_SIZE_RANGE[profile.group_size];
    const fits = venue.group_size_max >= gMin && venue.group_size_min <= gMax;
    if (!fits) return { ...venue, match_score: 0, match_reasons: [] };
    score += 10 * GROUP_WEIGHT;
  } else {
    score += 8 * GROUP_WEIGHT;
  }

  // 3. Vibe score — use legacy vibes[] if present, else default
  const vibes = profile.vibes ?? [];
  if (vibes.length > 0) {
    let vibeTotal = 0;
    for (const v of vibes) vibeTotal += venue.scores[v] ?? 5;
    const vibeAvg = vibeTotal / vibes.length;
    score += vibeAvg * VIBE_WEIGHT;
    if (vibeAvg >= 8) {
      const top = vibes.reduce((best, v) =>
        venue.scores[v] > venue.scores[best] ? v : best, vibes[0]);
      reasons.push(`Matches your ${top} vibe`);
    }
  } else {
    score += 6 * VIBE_WEIGHT;
  }

  // 4. Budget score contribution
  score += venue.scores.budget * BUDGET_WEIGHT;
  if (venue.avg_cost_pp === 0) reasons.push('Free!');
  else if (venue.avg_cost_pp <= 15) reasons.push(`~$${venue.avg_cost_pp}/person`);

  // 5. Category match via experiences[]
  const exps = profile.experiences ?? [];
  const matchedCats = new Set<string>();
  for (const exp of exps) {
    const cats = EXPERIENCE_TO_CATEGORY[exp] ?? [exp];
    cats.forEach(c => matchedCats.add(c));
  }
  // Fall back to legacy categories if no experiences
  const legacyCats = profile.categories ?? [];
  for (const c of legacyCats) matchedCats.add(c);

  const catMatch = matchedCats.size === 0 || matchedCats.has(venue.category);
  score += (catMatch ? 10 : 3) * CATEGORY_WEIGHT;
  if (catMatch && venue.subcategory) reasons.push(venue.subcategory);

  // 6. Rating
  score += (venue.rating / 5) * 10 * RATING_WEIGHT;
  if (venue.rating >= 4.8) reasons.push(`${venue.rating}★ rated`);

  return {
    ...venue,
    match_score: Math.min(Math.round(score * 10) / 10, 10),
    match_reasons: reasons.slice(0, 3),
  };
}

export function getRecommendations(profile: UserProfile, limit = 20): ScoredVenue[] {
  return VENUES
    .map(v => scoreVenue(v, profile))
    .filter(v => v.match_score > 0)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, limit);
}

export function getTopPicks(profile: UserProfile, limit = 3): ScoredVenue[] {
  return getRecommendations(profile, limit);
}

export function getByCategory(profile: UserProfile, category: Category): ScoredVenue[] {
  return getRecommendations(profile, 50).filter(v => v.category === category);
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_FRIENDS = [
  { id: 'f1', name: 'Maya R.',   handle: 'maya',  avatar: '🌙', status: 'going_out', status_text: 'Down for drinks tonight 🍸',   availability: ['fri_night', 'weekend_night'] },
  { id: 'f2', name: 'Jordan K.', handle: 'jk',    avatar: '⚡', status: 'maybe',     status_text: 'Depends on the vibe',          availability: ['weekend_night'] },
  { id: 'f3', name: 'Priya S.',  handle: 'priya', avatar: '🌿', status: 'home',      status_text: 'Studying tonight 😔',          availability: ['weekend_day'] },
  { id: 'f4', name: 'Alex T.',   handle: 'alext', avatar: '🎸', status: 'going_out', status_text: 'Motorco tonight anyone?',       availability: ['fri_night'] },
  { id: 'f5', name: 'Sam L.',    handle: 'saml',  avatar: '🏔️', status: 'maybe',     status_text: 'Free after 9pm',               availability: ['fri_night', 'weekend_night'] },
];

export const MOCK_JOURNAL: JournalEntry[] = [
  { id: 'j1', venue_id: 'V001', venue_name: 'Cocoa Cinnamon',     date: '2025-03-28', note: 'Amazing cortado, stayed for 3hrs',      with_who: ['Maya R.'],              rating: 5 },
  { id: 'j2', venue_id: 'V013', venue_name: 'Motorco Music Hall', date: '2025-03-21', note: 'Incredible show, got there late',        with_who: ['Jordan K.', 'Alex T.'], rating: 5 },
  { id: 'j3', venue_id: 'V007', venue_name: 'Mateo Bar de Tapas', date: '2025-03-14', note: 'Paella was unreal',                      with_who: ['Priya S.'],             rating: 4 },
  { id: 'j4', venue_id: 'V023', venue_name: 'Eno River State Park',date: '2025-03-07', note: 'Perfect Saturday hike',                 with_who: ['Maya R.', 'Sam L.'],    rating: 5 },
  { id: 'j5', venue_id: 'V014', venue_name: 'Fullsteam Brewery',  date: '2025-02-28', note: 'Good selection, crowded on Fri',         with_who: ['Jordan K.'],            rating: 4 },
];

export const MOCK_EVENTS = [
  { id: 'e1', name: 'Warehouse night',   venue: 'Motorco Music Hall', venue_id: 'V013', date: 'Fri Apr 11', time: '9:00 PM',  attendees: ['Maya R.', 'Alex T.', 'Sam L.'], status: 'confirmed' },
  { id: 'e2', name: 'Sunday brunch run', venue: 'Scratch Bakery',     venue_id: 'V004', date: 'Sun Apr 13', time: '10:30 AM', attendees: ['Priya S.', 'Jordan K.'],         status: 'planning'  },
];

// ─── In-app post queue ────────────────────────────────────────────────────────

export type FeedPost = {
  id: string;
  image: string;
  venue: string;
  venueId: string;
  author: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  time: string;
};

export const NEW_POST_QUEUE: FeedPost[] = [];

export function pushPost(data: {
  image: string;
  venue: string;
  venueId: string;
  author: string;
  caption: string;
  tags: string[];
}): FeedPost {
  const post: FeedPost = { ...data, id: `np-${Date.now()}`, likes: 0, comments: 0, time: 'Just now' };
  NEW_POST_QUEUE.unshift(post);
  return post;
}
