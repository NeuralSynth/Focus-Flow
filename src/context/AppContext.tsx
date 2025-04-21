import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { FocusFlowState, Task, PomodoroSettings } from '../types';

// Define action types
type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'REORDER_TASKS'; payload: Task[] }
  | { type: 'INCREMENT_POMODORO' }
  | { type: 'SET_CURRENT_TASK'; payload: string | null }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'UPDATE_POMODORO_SETTINGS'; payload: PomodoroSettings };

// Default settings
const defaultPomodoroSettings: PomodoroSettings = {
  workDuration: 25 * 60, // 25 minutes in seconds
  shortBreakDuration: 5 * 60, // 5 minutes in seconds
  longBreakDuration: 15 * 60, // 15 minutes in seconds
  longBreakInterval: 4, // Every 4 pomodoros
};

// Initial state
const initialState: FocusFlowState = {
  tasks: [],
  completedPomodoros: 0,
  currentTaskId: null,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  pomodoroSettings: defaultPomodoroSettings,
};

// Reducer function
const appReducer = (state: FocusFlowState, action: AppAction): FocusFlowState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        currentTaskId: state.currentTaskId === action.payload ? null : state.currentTaskId,
      };
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'REORDER_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };
    case 'INCREMENT_POMODORO':
      return {
        ...state,
        completedPomodoros: state.completedPomodoros + 1,
      };
    case 'SET_CURRENT_TASK':
      return {
        ...state,
        currentTaskId: action.payload,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case 'UPDATE_POMODORO_SETTINGS':
      return {
        ...state,
        pomodoroSettings: action.payload,
      };
    default:
      return state;
  }
};

// Create context
type AppContextType = {
  state: FocusFlowState;
  dispatch: React.Dispatch<AppAction>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage
  const loadState = (): FocusFlowState => {
    try {
      const savedState = localStorage.getItem('focusFlowState');
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(appReducer, loadState());

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem('focusFlowState', JSON.stringify(state));
  }, [state]);

  // Update document body class based on dark mode
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};