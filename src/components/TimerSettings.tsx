import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PomodoroSettings } from '../types';

interface TimerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAppContext();
  const { pomodoroSettings } = state;
  
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: pomodoroSettings.workDuration / 60,
    shortBreakDuration: pomodoroSettings.shortBreakDuration / 60,
    longBreakDuration: pomodoroSettings.longBreakDuration / 60,
    longBreakInterval: pomodoroSettings.longBreakInterval,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_POMODORO_SETTINGS',
      payload: {
        workDuration: settings.workDuration * 60,
        shortBreakDuration: settings.shortBreakDuration * 60,
        longBreakDuration: settings.longBreakDuration * 60,
        longBreakInterval: settings.longBreakInterval,
      },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Timer Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                name="workDuration"
                value={settings.workDuration}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Short Break Duration (minutes)
              </label>
              <input
                type="number"
                name="shortBreakDuration"
                value={settings.shortBreakDuration}
                onChange={handleChange}
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Long Break Duration (minutes)
              </label>
              <input
                type="number"
                name="longBreakDuration"
                value={settings.longBreakDuration}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Long Break Interval (pomodoros)
              </label>
              <input
                type="number"
                name="longBreakInterval"
                value={settings.longBreakInterval}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TimerSettings;