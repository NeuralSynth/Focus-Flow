import React from 'react';
import Timer from './Timer';
import TaskList from './TaskList';
import PomodoroStats from './PomodoroStats';

const AppContent: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Timer />
          <PomodoroStats />
        </div>
        <div className="lg:col-span-2">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default AppContent;