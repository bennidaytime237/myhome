import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Room, Task, Frequency } from '../types';
import { getItem, setItem, KEYS } from '../utils/storage';
import { generateId } from '../utils/id';
import { getNextDueDate } from '../utils/scheduling';

interface TaskState {
  rooms: Room[];
  tasks: Task[];
  loaded: boolean;
}

type TaskAction =
  | { type: 'LOAD'; rooms: Room[]; tasks: Task[] }
  | { type: 'ADD_ROOM'; room: Room }
  | { type: 'UPDATE_ROOM'; id: string; updates: Partial<Room> }
  | { type: 'REMOVE_ROOM'; id: string }
  | { type: 'SET_ROOMS'; rooms: Room[] }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; id: string; updates: Partial<Task> }
  | { type: 'REMOVE_TASK'; id: string }
  | { type: 'COMPLETE_TASK'; id: string; xpEarned: number; wasOnTime: boolean }
  | { type: 'RESET' };

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'LOAD':
      return { rooms: action.rooms, tasks: action.tasks, loaded: true };
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.room] };
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map((r) =>
          r.id === action.id ? { ...r, ...action.updates } : r
        ),
      };
    case 'REMOVE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter((r) => r.id !== action.id),
        tasks: state.tasks.filter((t) => t.roomId !== action.id),
      };
    case 'SET_ROOMS':
      return { ...state, rooms: action.rooms };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.task] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, ...action.updates } : t
        ),
      };
    case 'REMOVE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    case 'COMPLETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.id) return t;
          const now = new Date();
          const newNextDue = getNextDueDate(t.frequency, now);
          return {
            ...t,
            lastCompletedAt: now.toISOString(),
            nextDueAt: newNextDue,
            snoozedUntil: null,
            completionHistory: [
              ...t.completionHistory,
              {
                completedAt: now.toISOString(),
                xpEarned: action.xpEarned,
                wasOnTime: action.wasOnTime,
              },
            ],
          };
        }),
      };
    }
    case 'RESET':
      return { rooms: [], tasks: [], loaded: true };
    default:
      return state;
  }
}

interface TaskContextValue {
  rooms: Room[];
  tasks: Task[];
  loaded: boolean;
  addRoom: (name: string, icon: string) => Room;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  removeRoom: (id: string) => void;
  setRooms: (rooms: Room[]) => void;
  addTask: (roomId: string, name: string, frequency: Frequency, description?: string) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  completeTask: (id: string, xpEarned: number, wasOnTime: boolean) => void;
  snoozeTask: (id: string, days: number) => void;
  getTasksForRoom: (roomId: string) => Task[];
  reset: () => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, {
    rooms: [],
    tasks: [],
    loaded: false,
  });

  useEffect(() => {
    (async () => {
      const [rooms, tasks] = await Promise.all([
        getItem<Room[]>(KEYS.ROOMS),
        getItem<Task[]>(KEYS.TASKS),
      ]);
      dispatch({ type: 'LOAD', rooms: rooms || [], tasks: tasks || [] });
    })();
  }, []);

  useEffect(() => {
    if (!state.loaded) return;
    setItem(KEYS.ROOMS, state.rooms);
    setItem(KEYS.TASKS, state.tasks);
  }, [state.rooms, state.tasks, state.loaded]);

  const addRoom = useCallback((name: string, icon: string): Room => {
    const room: Room = {
      id: generateId(),
      name,
      icon,
      order: state.rooms.length,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ROOM', room });
    return room;
  }, [state.rooms.length]);

  const updateRoom = useCallback((id: string, updates: Partial<Room>) => {
    dispatch({ type: 'UPDATE_ROOM', id, updates });
  }, []);

  const removeRoom = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ROOM', id });
  }, []);

  const setRooms = useCallback((rooms: Room[]) => {
    dispatch({ type: 'SET_ROOMS', rooms });
  }, []);

  const addTask = useCallback(
    (roomId: string, name: string, frequency: Frequency, description?: string): Task => {
      const task: Task = {
        id: generateId(),
        roomId,
        name,
        description,
        frequency,
        lastCompletedAt: null,
        nextDueAt: getNextDueDate(frequency),
        snoozedUntil: null,
        createdAt: new Date().toISOString(),
        completionHistory: [],
      };
      dispatch({ type: 'ADD_TASK', task });
      return task;
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', id, updates });
  }, []);

  const removeTask = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TASK', id });
  }, []);

  const completeTask = useCallback(
    (id: string, xpEarned: number, wasOnTime: boolean) => {
      dispatch({ type: 'COMPLETE_TASK', id, xpEarned, wasOnTime });
    },
    []
  );

  const snoozeTask = useCallback(
    (id: string, days: number) => {
      const now = new Date();
      now.setDate(now.getDate() + days);
      dispatch({
        type: 'UPDATE_TASK',
        id,
        updates: { snoozedUntil: now.toISOString() },
      });
    },
    []
  );

  const getTasksForRoom = useCallback(
    (roomId: string) => state.tasks.filter((t) => t.roomId === roomId),
    [state.tasks]
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        rooms: state.rooms,
        tasks: state.tasks,
        loaded: state.loaded,
        addRoom,
        updateRoom,
        removeRoom,
        setRooms,
        addTask,
        updateTask,
        removeTask,
        completeTask,
        snoozeTask,
        getTasksForRoom,
        reset,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}
