import { useContext, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TaskContext } from '../../context/TaskContext';
import TaskCard from '../tasks/TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';

// Hook for draggable TaskCard
const DraggableCard = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {typeof children === 'function'
        ? children({ isDragging, listeners, attributes, setNodeRef })
        : children}
    </div>
  );
};

const TASK_TYPE_OPTIONS = ['All', 'Call', 'Email', 'Meeting', 'Follow-up'];
const LOAN_STATUS_OPTIONS = ['All', 'In Progress', 'Approved', 'Closed', 'Denied'];
const ASSIGNEE_OPTIONS = ['All', 'You', 'Team Member 1', 'Team Member 2'];

const STATUS_TABS = [
  { label: 'Today', value: 'today' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Upcoming (48h)', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
];

const TaskSection = () => {
  const { tasksByCategory } = useContext(TaskContext);
  const { role, user } = useUser();
  // All hooks must come first
  const [filter, setFilter] = useState('All');
  const [categoryOrder, setCategoryOrder] = useState(() =>
    tasksByCategory ? Object.keys(tasksByCategory) : []
  );
  const [activeTab, setActiveTab] = useState('today');
  const [taskType, setTaskType] = useState('All');
  const [loanStatus, setLoanStatus] = useState('All');
  const [assignee, setAssignee] = useState('All');
  const [dueDate, setDueDate] = useState('');

  // Show loading if tasksByCategory is not ready
  if (!tasksByCategory) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-400 text-lg animate-pulse">
        Loading tasks...
      </div>
    );
  }

  const categories = Object.keys(tasksByCategory);
  const filteredCategories =
    filter === 'All' ? categoryOrder : categoryOrder.filter((c) => c === filter);

  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleTabChange = (tab) => setActiveTab(tab);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = categoryOrder.indexOf(active.id);
      const newIndex = categoryOrder.indexOf(over.id);
      setCategoryOrder(arrayMove(categoryOrder, oldIndex, newIndex));
    }
  };

  // Action stubs
  const handleMarkDone = () => {};
  const handleReassign = () => {};
  const handleSnooze = () => {};
  const handleCreateTask = () => {};

  // Filtering logic for tasks (mock, to be replaced with real logic)
  const filterTasks = (tasks) => {
    return tasks.filter(task => {
      const matchType = taskType === 'All' || task.type === taskType;
      const matchStatus = loanStatus === 'All' || task.loanStatus === loanStatus;
      const matchAssignee = assignee === 'All' || (assignee === 'You' ? task.assignee === user?.name : task.assignee === assignee);
      const matchDueDate = !dueDate || task.dueDate === dueDate;
      return matchType && matchStatus && matchAssignee && matchDueDate;
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: 'easeOut'
      }
    }),
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      filter: 'blur(6px)',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="tasks-section w-full px-2 sm:px-4 md:px-10 py-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800 dark:text-white flex items-center gap-2">
            📋 Task Overview
          </h2>
          <div className="mt-1 h-1 w-24 bg-gradient-to-r from-[#01818E] to-cyan-400 rounded-full" />
        </div>
        {/* Category Filter */}
        <motion.select
          key={filter}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onChange={handleFilterChange}
          value={filter}
          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:ring-2 hover:ring-[#01818E] transition-all duration-300"
        >
          <option>All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </motion.select>
      </div>
      {/* Advanced Filters */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <select value={taskType} onChange={e => setTaskType(e.target.value)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
          {TASK_TYPE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <select value={loanStatus} onChange={e => setLoanStatus(e.target.value)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
          {LOAN_STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <select value={assignee} onChange={e => setAssignee(e.target.value)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
          {ASSIGNEE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
        <button onClick={() => { setTaskType('All'); setLoanStatus('All'); setAssignee('All'); setDueDate(''); }} className="px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">Clear</button>
      </div>
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${activeTab === tab.value ? 'bg-cyan-500 text-white border-cyan-500 shadow' : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-cyan-100 dark:hover:bg-cyan-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={handleCreateTask} className="px-4 py-1.5 rounded-full bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition">+ Create Task</button>
        <button onClick={handleMarkDone} className="px-4 py-1.5 rounded-full bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition">Mark Done</button>
        {/* Only show Reassign and Snooze for certain roles */}
        {(role === 'Loan Officer' || role === 'LOA / Processor') && (
          <button onClick={handleReassign} className="px-4 py-1.5 rounded-full bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition">Reassign</button>
        )}
        {role !== 'Production Partner' && (
          <button onClick={handleSnooze} className="px-4 py-1.5 rounded-full bg-purple-500 text-white font-semibold shadow hover:bg-purple-600 transition">Snooze</button>
        )}
      </div>
      {/* Draggable Cards */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredCategories} strategy={verticalListSortingStrategy}>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredCategories.map((category, idx) => (
                <motion.div
                  key={category}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="will-change-transform"
                >
                  <DraggableCard id={category}>
                    {({ isDragging, listeners, attributes, setNodeRef }) => (
                      <TaskCard
                        id={category}
                        title={category}
                        color={tasksByCategory[category].color || 'gray'}
                        tasks={filterTasks(tasksByCategory[category].items)}
                        listeners={listeners}
                        attributes={attributes}
                        setNodeRef={setNodeRef}
                        isDragging={isDragging}
                        activeTab={activeTab}
                        role={role}
                      />
                    )}
                  </DraggableCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>
    </motion.section>
  );
};

export default TaskSection;
