import { Redirect } from 'expo-router';

export default function JournalScreen() {
  return <Redirect href="/friends-list?tab=attended" />;
}