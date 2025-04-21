import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { TimerStatus, TimerType } from '../types';
import { playTimerEndSound, requestNotificationPermission, showNotification } from '../utils/timerUtils';
import TimerDisplay from './TimerDisplay';
import TimerSettings from './TimerSettings';

const Timer: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { pomodoroSettings, currentTaskId, tasks } = state;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const [timerState, setTimerState] = useState({
    status: TimerStatus.IDLE,
    type: TimerType.WORK,
    timeLeft: pomodoroSettings.workDuration,
    pomodoroCount: 0,
  });

  const timerRef = useRef<number | null>(null);

  // Get current task title if available
  const currentTask = currentTaskId ? tasks.find(task => task.id === currentTaskId) : null;

  // Check for notification permission on mount
  useEffect(() => {
    const checkNotificationPermission = async () => {
      const hasPermission = await requestNotificationPermission();
      setNotificationsEnabled(hasPermission);
    };
    
    checkNotificationPermission();
  }, []);

  // Reset timer when settings change
  useEffect(() => {
    if (timerState.status === TimerStatus.IDLE) {
      const newTimeLeft = getTimeDurationForType(timerState.type);
      setTimerState(prev => ({ ...prev, timeLeft: newTimeLeft }));
    }
  }, [pomodoroSettings, timerState.type, timerState.status]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getTimeDurationForType = useCallback((type: TimerType): number => {
    switch (type) {
      case TimerType.WORK:
        return pomodoroSettings.workDuration;
      case TimerType.SHORT_BREAK:
        return pomodoroSettings.shortBreakDuration;
      case TimerType.LONG_BREAK:
        return pomodoroSettings.longBreakDuration;
      default:
        return pomodoroSettings.workDuration;
    }
  }, [pomodoroSettings]);

  const startTimer = useCallback(() => {
    if (timerState.status === TimerStatus.PAUSED) {
      setTimerState(prev => ({ ...prev, status: TimerStatus.WORK }));
    } else if (timerState.status === TimerStatus.IDLE) {
      setTimerState(prev => ({
        ...prev,
        status: prev.type === TimerType.WORK ? TimerStatus.WORK : prev.type === TimerType.SHORT_BREAK ? TimerStatus.SHORT_BREAK : TimerStatus.LONG_BREAK,
        timeLeft: prev.timeLeft,
      }));
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setTimerState(prev => {
        if (prev.timeLeft <= 1) {
          // Timer finished
          clearInterval(timerRef.current!);
          playTimerEndSound();
          
          // Show notification
          if (notificationsEnabled) {
            const message = prev.type === TimerType.WORK 
              ? "Time for a break!" 
              : "Break finished! Ready to focus?";
              
            showNotification("FocusFlow Timer", { 
              body: message,
              icon: "/favicon.ico" 
            });
          }
          
          // Handle timer completion
          if (prev.type === TimerType.WORK) {
            const newCount = prev.pomodoroCount + 1;
            dispatch({ type: 'INCREMENT_POMODORO' });
            
            // Determine next break type
            const isLongBreak = newCount % pomodoroSettings.longBreakInterval === 0;
            const nextType = isLongBreak ? TimerType.LONG_BREAK : TimerType.SHORT_BREAK;
            const nextDuration = isLongBreak ? pomodoroSettings.longBreakDuration : pomodoroSettings.shortBreakDuration;
            
            return {
              status: TimerStatus.IDLE,
              type: nextType,
              timeLeft: nextDuration,
              pomodoroCount: newCount,
            };
          } else {
            // After break, go back to work
            return {
              status: TimerStatus.IDLE,
              type: TimerType.WORK,
              timeLeft: pomodoroSettings.workDuration,
              pomodoroCount: prev.pomodoroCount,
            };
          }
        } else {
          // Continue countdown
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        }
      });
    }, 1000);
  }, [dispatch, notificationsEnabled, pomodoroSettings, timerState.status]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerState(prev => ({ ...prev, status: TimerStatus.PAUSED }));
  }, []);

  const skipTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setTimerState(prev => {
      if (prev.type === TimerType.WORK) {
        const newCount = prev.pomodoroCount + 1;
        dispatch({ type: 'INCREMENT_POMODORO' });
        
        // Determine next break type
        const isLongBreak = newCount % pomodoroSettings.longBreakInterval === 0;
        const nextType = isLongBreak ? TimerType.LONG_BREAK : TimerType.SHORT_BREAK;
        const nextDuration = isLongBreak ? pomodoroSettings.longBreakDuration : pomodoroSettings.shortBreakDuration;
        
        return {
          status: TimerStatus.IDLE,
          type: nextType,
          timeLeft: nextDuration,
          pomodoroCount: newCount,
        };
      } else {
        // After break, go back to work
        return {
          status: TimerStatus.IDLE,
          type: TimerType.WORK,
          timeLeft: pomodoroSettings.workDuration,
          pomodoroCount: prev.pomodoroCount,
        };
      }
    });
  }, [dispatch, pomodoroSettings]);

  // Total time for current timer type (for progress calculation)
  const totalTime = getTimeDurationForType(timerState.type);

  return (
    <div className="w-full max-w-md mx-auto">
      {currentTask && (
        <div className="mb-4 p-3 bg-primary-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-800 dark:text-gray-200 text-center">
            Current task: <span className="font-medium">{currentTask.title}</span>
          </p>
        </div>
      )}
      
      <TimerDisplay
        timerState={timerState}
        totalTime={totalTime}
        onStart={startTimer}
        onPause={pauseTimer}
        onSkip={skipTimer}
        onSettingsOpen={() => setSettingsOpen(true)}
      />
      
      <TimerSettings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default Timer;