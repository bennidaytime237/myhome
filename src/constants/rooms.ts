export interface RoomSuggestion {
  name: string;
  icon: string;
}

export const ROOM_SUGGESTIONS: RoomSuggestion[] = [
  { name: 'Kitchen', icon: '🍳' },
  { name: 'Bathroom', icon: '🛁' },
  { name: 'Bedroom', icon: '🛏️' },
  { name: 'Living Room', icon: '🛋️' },
  { name: 'Laundry', icon: '🧺' },
  { name: 'Garage', icon: '🚗' },
  { name: 'Garden', icon: '🌿' },
  { name: 'Office', icon: '💻' },
  { name: 'Dining Room', icon: '🍽️' },
  { name: 'Hallway', icon: '🚪' },
];

export interface TaskSuggestion {
  name: string;
  roomKeyword: string;
  frequency: { value: number; unit: 'days' | 'weeks' | 'months' };
}

export const TASK_SUGGESTIONS: TaskSuggestion[] = [
  // Kitchen
  { name: 'Wipe counters', roomKeyword: 'kitchen', frequency: { value: 1, unit: 'days' } },
  { name: 'Clean stovetop', roomKeyword: 'kitchen', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Clean oven', roomKeyword: 'kitchen', frequency: { value: 1, unit: 'months' } },
  { name: 'Deep clean fridge', roomKeyword: 'kitchen', frequency: { value: 1, unit: 'months' } },
  { name: 'Empty bins', roomKeyword: 'kitchen', frequency: { value: 2, unit: 'days' } },
  { name: 'Mop floor', roomKeyword: 'kitchen', frequency: { value: 1, unit: 'weeks' } },
  // Bathroom
  { name: 'Clean toilet', roomKeyword: 'bathroom', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Clean shower / tub', roomKeyword: 'bathroom', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Clean mirrors', roomKeyword: 'bathroom', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Wash towels', roomKeyword: 'bathroom', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Scrub grout', roomKeyword: 'bathroom', frequency: { value: 1, unit: 'months' } },
  // Bedroom
  { name: 'Change bedding', roomKeyword: 'bedroom', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Vacuum / hoover', roomKeyword: 'bedroom', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Dust surfaces', roomKeyword: 'bedroom', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Declutter bedside table', roomKeyword: 'bedroom', frequency: { value: 2, unit: 'weeks' } },
  // Living Room
  { name: 'Vacuum / hoover', roomKeyword: 'living', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Dust shelves & surfaces', roomKeyword: 'living', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Clean windows', roomKeyword: 'living', frequency: { value: 1, unit: 'months' } },
  { name: 'Rotate cushions', roomKeyword: 'living', frequency: { value: 2, unit: 'weeks' } },
  // Laundry
  { name: 'Do laundry', roomKeyword: 'laundry', frequency: { value: 2, unit: 'days' } },
  { name: 'Clean washing machine', roomKeyword: 'laundry', frequency: { value: 1, unit: 'months' } },
  { name: 'Clean dryer lint', roomKeyword: 'laundry', frequency: { value: 1, unit: 'weeks' } },
  // Garage
  { name: 'Sweep floor', roomKeyword: 'garage', frequency: { value: 2, unit: 'weeks' } },
  { name: 'Organise tools', roomKeyword: 'garage', frequency: { value: 3, unit: 'months' } },
  // Garden
  { name: 'Mow lawn', roomKeyword: 'garden', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Water plants', roomKeyword: 'garden', frequency: { value: 2, unit: 'days' } },
  { name: 'Weed flower beds', roomKeyword: 'garden', frequency: { value: 2, unit: 'weeks' } },
  { name: 'Clean gutters', roomKeyword: 'garden', frequency: { value: 6, unit: 'months' } },
  // Office
  { name: 'Tidy desk', roomKeyword: 'office', frequency: { value: 1, unit: 'days' } },
  { name: 'Wipe screens', roomKeyword: 'office', frequency: { value: 1, unit: 'weeks' } },
  { name: 'Organise papers', roomKeyword: 'office', frequency: { value: 2, unit: 'weeks' } },
  // General
  { name: 'Dust ceiling fans', roomKeyword: '', frequency: { value: 1, unit: 'months' } },
  { name: 'Check smoke detectors', roomKeyword: '', frequency: { value: 6, unit: 'months' } },
  { name: 'Replace air filters', roomKeyword: '', frequency: { value: 3, unit: 'months' } },
];

export function getSuggestedTasks(roomName: string): TaskSuggestion[] {
  const lower = roomName.toLowerCase();
  return TASK_SUGGESTIONS.filter(
    (t) => t.roomKeyword && lower.includes(t.roomKeyword)
  );
}
