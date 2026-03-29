import { Frequency, TaskStatus, Task } from '../types';

export function addFrequency(date: Date, frequency: Frequency): Date {
  const result = new Date(date);
  switch (frequency.unit) {
    case 'days':
      result.setDate(result.getDate() + frequency.value);
      break;
    case 'weeks':
      result.setDate(result.getDate() + frequency.value * 7);
      break;
    case 'months':
      result.setMonth(result.getMonth() + frequency.value);
      break;
  }
  return result;
}

export function getTaskStatus(task: Task): TaskStatus {
  const now = new Date();
  const dueDate = new Date(task.snoozedUntil || task.nextDueAt);
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 2) return 'due_soon';
  return 'fresh';
}

export function getDaysUntilDue(task: Task): number {
  const now = new Date();
  const dueDate = new Date(task.snoozedUntil || task.nextDueAt);
  const diffMs = dueDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getNextDueDate(frequency: Frequency, fromDate?: Date): string {
  const from = fromDate || new Date();
  return addFrequency(from, frequency).toISOString();
}

export function formatDueText(task: Task): string {
  const days = getDaysUntilDue(task);
  if (days < 0) {
    const absDays = Math.abs(days);
    return absDays === 1 ? '1 day overdue' : `${absDays} days overdue`;
  }
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 7) return `Due in ${days} days`;
  if (days <= 30) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? 'Due in 1 week' : `Due in ${weeks} weeks`;
  }
  const months = Math.round(days / 30);
  return months === 1 ? 'Due in 1 month' : `Due in ${months} months`;
}

export function formatFrequency(frequency: Frequency): string {
  if (frequency.value === 1) {
    const singular: Record<string, string> = {
      days: 'Daily',
      weeks: 'Weekly',
      months: 'Monthly',
    };
    return singular[frequency.unit];
  }
  return `Every ${frequency.value} ${frequency.unit}`;
}

export function getStatusProgress(task: Task): number {
  if (!task.lastCompletedAt) return 0;
  const lastDone = new Date(task.lastCompletedAt).getTime();
  const nextDue = new Date(task.nextDueAt).getTime();
  const now = Date.now();
  const totalInterval = nextDue - lastDone;
  if (totalInterval <= 0) return 1;
  const elapsed = now - lastDone;
  return Math.min(1, Math.max(0, elapsed / totalInterval));
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
