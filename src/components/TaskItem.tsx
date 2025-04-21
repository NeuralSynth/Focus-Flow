import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Edit, Trash, PlayCircle } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';
import { useAppContext } from '../context/AppContext';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  index: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index }) => {
  const { dispatch, state } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const isCurrentTask = state.currentTaskId === task.id;

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'COMPLETE_TASK', payload: task.id });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_TASK', payload: task.id });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...task, title: editedTitle.trim() },
      });
    }
    setIsEditing(false);
  };

  const handleSetCurrentTask = () => {
    if (!isCurrentTask) {
      dispatch({ type: 'SET_CURRENT_TASK', payload: task.id });
    } else {
      dispatch({ type: 'SET_CURRENT_TASK', payload: null });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group p-3 mb-2 rounded-lg shadow-sm hover:shadow transition-all ${
            snapshot.isDragging ? 'shadow-md' : ''
          } ${
            isCurrentTask
              ? 'bg-primary-50 dark:bg-gray-700 border-l-4 border-primary-500'
              : task.completed
              ? 'bg-gray-50 dark:bg-gray-800 border-l-4 border-success-500'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={handleComplete}
              className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {task.completed ? (
                <CheckCircle className="h-5 w-5 text-success-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
              )}
            </button>

            <div className="flex-grow" onClick={isEditing ? undefined : handleSetCurrentTask}>
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyDown}
                  className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              ) : (
                <span
                  className={`${
                    task.completed
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {task.title}
                </span>
              )}
            </div>

            <div className="flex-shrink-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleEdit}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-500 dark:text-gray-400"
                aria-label="Edit task"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-500 dark:text-gray-400"
                aria-label="Delete task"
              >
                <Trash className="h-4 w-4" />
              </button>
              <button
                onClick={handleSetCurrentTask}
                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isCurrentTask ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-label={isCurrentTask ? "Unset current task" : "Set as current task"}
              >
                <PlayCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
};

export default TaskItem;