# Blyss — VS Code + Expo Go Setup

## One-time setup (do this now)

### 1. Install Node.js (if not already)
https://nodejs.org — download LTS version

### 2. Install Expo CLI globally
```bash
npm install -g expo-cli eas-cli
```

### 3. Install VS Code extensions
- **React Native Tools** (Microsoft)
- **ESLint**
- **Prettier**
- **Expo Tools** (Expo)

---

## Project setup

### 4. Copy the blyss folder to your machine, then:
```bash
cd blyss
npm install
```

### 5. Fix known dependency (run after npm install):
```bash
npx expo install --fix
```

### 6. Start dev server
```bash
npx expo start
```

---

## Running on your phone (Expo Go)

1. Download **Expo Go** from the App Store / Google Play
2. Make sure your phone and laptop are on the **same WiFi**
3. Run `npx expo start`
4. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app → Scan QR

### If QR doesn't work:
```bash
npx expo start --tunnel
```
(installs ngrok, works on any network)

---

## File structure
```
blyss/
├── app/
│   ├── _layout.tsx          ← root layout + auth gate
│   ├── onboarding/          ← 6 onboarding screens
│   │   ├── welcome.tsx
│   │   ├── name.tsx
│   │   ├── vibes.tsx
│   │   ├── budget.tsx
│   │   ├── groupsize.tsx
│   │   ├── prefs.tsx
│   │   └── matching.tsx     ← ML loader + profile save
│   ├── (tabs)/              ← main tab navigator
│   │   ├── index.tsx        ← Home
│   │   ├── explore.tsx      ← ML venue feed ← KEY DEMO SCREEN
│   │   ├── plan.tsx         ← Event creation
│   │   ├── friends.tsx      ← Friends status
│   │   └── journal.tsx      ← Past places
│   └── venue/
│       └── [id].tsx         ← Venue detail (modal)
├── lib/
│   ├── venues.ts            ← 30 Durham/Raleigh venues
│   ├── store.ts             ← User profile + ML scoring engine
│   └── theme.ts             ← Design system (colors, spacing)
└── components/
    └── OnboardStep.tsx      ← Shared onboarding wrapper
```

---

## Demo flow for presentation

1. **Launch app** → hits onboarding (first time)
2. **Complete onboarding** → name, vibe, budget, group size, dietary, categories
3. **Watch matching screen** → animated ML loader
4. **Land on Home** → see "top picks for you" powered by ML scores
5. **Tap Explore** → full ranked feed, filter by Coffee/Food/Bars/Activities
6. **Tap a venue** → detail screen with match score + reasons
7. **Tap "Plan event here"** → event creation flow
8. **Complete event** → success screen
9. **Show Friends tab** → going out status
10. **Show Journal** → previous places

---

## Reset onboarding (for demo)
In the app, you can reset by going to Settings or use this in your code:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear(); // clears all data, triggers onboarding again
```

Or add a dev button in _layout.tsx temporarily.

---

## Common issues

**"Unable to resolve module"** → run `npm install` again
**Blank screen** → check terminal for red errors, usually a typo
**Expo Go says "Something went wrong"** → check that AsyncStorage is installed:
```bash
npx expo install @react-native-async-storage/async-storage
```
**expo-haptics crash** → `npx expo install expo-haptics`
**expo-linear-gradient crash** → `npx expo install expo-linear-gradient`

---

## TypeScript strict mode
If you hit type errors, check `tsconfig.json` has:
```json
{ "compilerOptions": { "strict": false } }
```
