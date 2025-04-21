import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Settings } from 'lucide-react';
import CircularProgress from './CircularProgress';
import { TimerStatus, TimerType } from '../types';
import { formatTime } from '../utils/timerUtils';

interface TimerDisplayProps {
  timerState: {
    status: TimerStatus;
    type: TimerType;
    timeLeft: number;
    pomodoroCount: number;
  };
  totalTime: number;
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
  onSettingsOpen: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timerState,
  totalTime,
  onStart,
  onPause,
  onSkip,
  onSettingsOpen,
}) => {
  const { status, type, timeLeft } = timerState;
  const progress = 1 - timeLeft / totalTime;
  const isRunning = status !== TimerStatus.IDLE && status !== TimerStatus.PAUSED;

  const getTimerLabel = () => {
    switch (type) {
      case TimerType.WORK:
        return 'Focus Time';
      case TimerType.SHORT_BREAK:
        return 'Short Break';
      case TimerType.LONG_BREAK:
        return 'Long Break';
      default:
        return 'Timer';
    }
  };

  const getTimerColor = () => {
    switch (type) {
      case TimerType.WORK:
        return 'text-primary-600 dark:text-primary-400';
      case TimerType.SHORT_BREAK:
        return 'text-accent-500 dark:text-accent-400';
      case TimerType.LONG_BREAK:
        return 'text-accent-600 dark:text-accent-500';
      default:
        return 'text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
      <div className="mb-2">
        <h2 className={`text-lg font-medium ${getTimerColor()}`}>{getTimerLabel()}</h2>
      </div>

      <div className="relative flex items-center justify-center my-4">
        <CircularProgress
          progress={progress}
          size={200}
          strokeWidth={12}
          color={
            type === TimerType.WORK
              ? 'var(--color-primary-600)'
              : 'var(--color-accent-500)'
          }
        />
        <motion.div
          className="absolute text-4xl font-bold text-gray-800 dark:text-white"
          key={timeLeft}
          initial={{ opacity: 0.8, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {formatTime(timeLeft)}
        </motion.div>
      </div>

      <div className="flex items-center justify-center space-x-4 mt-4">
        {/* Settings Button */}
        <motion.button
          onClick={onSettingsOpen}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
          whileTap={{ scale: 0.95 }}
          aria-label="Timer settings"
        >
          <Settings className="h-5 w-5" />
        </motion.button>

        {/* Skip Button */}
        <motion.button
          onClick={onSkip}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
          whileTap={{ scale: 0.95 }}
          aria-label="Skip timer"
        >
          <SkipForward className="h-5 w-5" />
        </motion.button>

        {/* Start/Pause Button */}
        <motion.button
          onClick={isRunning ? onPause : onStart}
          className={`p-4 rounded-full ${
            isRunning
              ? 'bg-error-500 hover:bg-error-600 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          } transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-500`}
          whileTap={{ scale: 0.95 }}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </motion.button>
      </div>
    </div>
  );
};

export default TimerDisplay;