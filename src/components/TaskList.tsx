import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import TaskItem from './TaskItem';
import { Task } from '../types';

const TaskList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: newTaskTitle.trim(),
        completed: false,
        createdAt: Date.now(),
        index: state.tasks.length,
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
      setNewTaskTitle('');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If dropped outside the list
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Reorder tasks
    const reorderedTasks = Array.from(state.tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);

    // Update indices
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      index,
    }));

    dispatch({ type: 'REORDER_TASKS', payload: updatedTasks });
  };

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((task) => task.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tasks</h2>

      {/* Task progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedTasks} of {totalTasks} tasks completed
          </span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Add task form */}
      <form onSubmit={handleAddTask} className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Add task"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Task list */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar"
            >
              <AnimatePresence>
                {state.tasks.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 dark:text-gray-400 py-4"
                  >
                    No tasks yet. Add one above!
                  </motion.p>
                ) : (
                  state.tasks
                    .sort((a, b) => a.index - b.index)
                    .map((task, index) => (
                      <TaskItem key={task.id} task={task} index={index} />
                    ))
                )}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;