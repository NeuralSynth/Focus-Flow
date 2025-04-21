import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const PomodoroStats: React.FC = () => {
  const { state } = useAppContext();
  const { completedPomodoros, pomodoroSettings } = state;
  
  // Calculate total focus time in minutes
  const totalFocusMinutes = (completedPomodoros * pomodoroSettings.workDuration) / 60;
  
  // Daily goal: assuming 8 pomodoros is a good day's work
  const dailyGoalPomodoros = 8;
  const progressPercentage = Math.min((completedPomodoros / dailyGoalPomodoros) * 100, 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Focus Stats</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Focus Sessions</p>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-primary-500 mr-2" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedPomodoros}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Focus Time</p>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalFocusMinutes} min
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Daily Goal: {completedPomodoros} of {dailyGoalPomodoros} sessions
          </span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {progressPercentage >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg text-center"
        >
          <p className="text-success-700 dark:text-success-400 font-medium">
            Daily goal complete! Great work today! 🎉
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PomodoroStats;