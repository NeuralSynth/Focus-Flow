export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  index: number;
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

export interface FocusFlowState {
  tasks: Task[];
  completedPomodoros: number;
  currentTaskId: string | null;
  darkMode: boolean;
  pomodoroSettings: PomodoroSettings;
}

export enum TimerStatus {
  IDLE = 'idle',
  WORK = 'work',
  SHORT_BREAK = 'shortBreak',
  LONG_BREAK = 'longBreak',
  PAUSED = 'paused',
}

export enum TimerType {
  WORK = 'work',
  SHORT_BREAK = 'shortBreak',
  LONG_BREAK = 'longBreak',
}

export interface TimerState {
  status: TimerStatus;
  type: TimerType;
  timeLeft: number;
  pomodoroCount: number;
}