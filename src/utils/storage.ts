import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ROOMS: '@myhome/rooms',
  TASKS: '@myhome/tasks',
  GAMIFICATION: '@myhome/gamification',
  SETTINGS: '@myhome/settings',
} as const;

export { KEYS };

export async function getItem<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  if (value === null) return null;
  return JSON.parse(value) as T;
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function clearAll(): Promise<void> {
  const keys = Object.values(KEYS);
  await AsyncStorage.multiRemove(keys);
}
