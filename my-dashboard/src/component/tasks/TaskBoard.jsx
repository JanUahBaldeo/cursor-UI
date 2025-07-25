import React, { useContext, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskContext } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import TaskFilters from './TaskFilters';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../shared/Modal';
import { FaFolderOpen } from 'react-icons/fa';

const TASK_TYPE_OPTIONS = ['All', 'Call', 'Email', 'Doc Collection', 'Follow-up', 'Compliance', 'Marketing'];
const LOAN_STAGE_OPTIONS = ['All', 'Application', 'Processing', 'Underwriting', 'Closing', 'Post-Close'];
const ASSIGNEE_OPTIONS = ['All', 'You', 'Team Member 1', 'Team Member 2'];

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

const dropdownVariants = {
  closed: { opacity: 0, scale: 0.98, pointerEvents: 'none', transition: { duration: 0.18 } },
  open: { opacity: 1, scale: 1, pointerEvents: 'auto', transition: { duration: 0.22 } },
};

const SNOOZE_OPTIONS = [
  { label: '1 hour', value: 1 },
  { label: 'Later Today', value: 4 },
  { label: 'Tomorrow', value: 24 },
  { label: 'Custom', value: 'custom' },
];

const TaskBoard = ({ role }) => {
  const { tasksByCategory, updateTask } = useContext(TaskContext);
  const { user, role: userRole } = useUser();
  const [filter, setFilter] = useState('All');
  const [categoryOrder, setCategoryOrder] = useState(() =>
    tasksByCategory ? Object.keys(tasksByCategory) : []
  );
  const [taskType, setTaskType] = useState('All');
  const [loanStage, setLoanStage] = useState('All');
  const [assignee, setAssignee] = useState('All');
  const [dueDate, setDueDate] = useState('');
  const [filters, setFilters] = useState({ search: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [snoozeValue, setSnoozeValue] = useState(SNOOZE_OPTIONS[0].value);
  const [showCompleted, setShowCompleted] = useState(false);
  const [tagFilter, setTagFilter] = useState('All');

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

  const handleFilterChange = (cat) => {
    setFilter(cat);
    setDropdownOpen(false);
  };

  const handleDropdownToggle = () => setDropdownOpen((v) => !v);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = categoryOrder.indexOf(active.id);
      const newIndex = categoryOrder.indexOf(over.id);
      setCategoryOrder(arrayMove(categoryOrder, oldIndex, newIndex));
    }
  };

  // Filtering logic for tasks
  const filterTasks = (tasks) => {
    return tasks.filter(task => {
      const matchType = taskType === 'All' || (task.type && task.type === taskType);
      const matchStage = loanStage === 'All' || (task.stage && task.stage === loanStage);
      const matchAssignee = assignee === 'All' || (assignee === 'You' ? task.assignee === user?.name : task.assignee === assignee);
      const matchDueDate = !dueDate || task.date === dueDate;
      const matchSearch = !filters.search || (task.title && task.title.toLowerCase().includes(filters.search.toLowerCase()));
      const matchTag = tagFilter === 'All' || (task.tags && task.tags.includes(tagFilter));
      const matchCompleted = showCompleted ? (task.status === 'Completed') : (task.status !== 'Completed');
      return matchType && matchStage && matchAssignee && matchDueDate && matchSearch && matchTag && matchCompleted;
    });
  };

  // Collect all unique tags for the filter dropdown
  const allTags = Array.from(new Set(
    Object.values(tasksByCategory)
      .flatMap(cat => cat.items.flatMap(task => task.tags || []))
  ));

  // Action handlers (single-task mode)
  const handleMarkDone = () => {
    // Implement single-task mark done logic or show a modal to select a task
    alert('Mark Done: Please select a task from the card menu.');
  };
  const handleReassign = () => {
    setShowReassignModal(true);
  };
  const handleSnooze = () => {
    setShowSnoozeModal(true);
  };

  // Check if there are any tasks at all
  const hasAnyTasks = Object.values(tasksByCategory).some(cat => cat.items.length > 0);

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
        {/* Enhanced Category Dropdown */}
        <div className="relative">
          <button
            type="button"
            className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 border-cyan-300 bg-white text-cyan-900 shadow-md font-semibold focus:bg-cyan-50 focus:text-cyan-900 transition focus:ring-2 focus:ring-cyan-200 hover:bg-cyan-50 outline-none ${dropdownOpen ? 'ring-2 ring-cyan-200' : ''}`}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            onClick={handleDropdownToggle}
          >
            {filter}
            <svg className={`ml-2 w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <AnimatePresence initial={false}>
            {dropdownOpen && (
              <motion.ul
                initial="closed"
                animate="open"
                exit="closed"
                variants={dropdownVariants}
                className="absolute right-0 mt-2 w-56 bg-white text-cyan-900 rounded-xl shadow-xl border border-cyan-100 z-50 overflow-hidden animate-fade-in"
                role="listbox"
                tabIndex={-1}
                style={{ originY: 0.1 }}
              >
                <li className="px-5 py-3 text-xs text-gray-400 select-none">Select Category</li>
                <li
                  key="All"
                  className={`flex items-center gap-2 px-5 py-3 cursor-pointer hover:bg-cyan-50 focus:bg-cyan-100 transition text-base font-medium ${filter === 'All' ? 'bg-cyan-100 text-cyan-700' : ''}`}
                  role="option"
                  aria-selected={filter === 'All'}
                  tabIndex={0}
                  onClick={() => handleFilterChange('All')}
                >
                  All
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`flex items-center gap-2 px-5 py-3 cursor-pointer hover:bg-cyan-50 focus:bg-cyan-100 transition text-base font-medium ${filter === cat ? 'bg-cyan-100 text-cyan-700' : ''}`}
                    role="option"
                    aria-selected={filter === cat}
                    tabIndex={0}
                    onClick={() => handleFilterChange(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Advanced Filters */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <select value={taskType} onChange={e => setTaskType(e.target.value)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
          {TASK_TYPE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <select value={loanStage} onChange={e => setLoanStage(e.target.value)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
          {LOAN_STAGE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <select value={assignee} onChange={e => setAssignee(e.target.value)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
          {ASSIGNEE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
        <button onClick={() => { setTaskType('All'); setLoanStage('All'); setAssignee('All'); setDueDate(''); }} className="px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">Clear</button>
      </div>
      {/* Completed Tasks Toggle and Tags Filter */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={showCompleted} onChange={e => setShowCompleted(e.target.checked)} className="accent-cyan-600" />
          <span className="text-sm">Show Completed Tasks</span>
        </label>
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
          <option value="All">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setShowCreateModal(true)} className="px-4 py-1.5 rounded-full bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition">+ Create Task</button>
        <button onClick={handleMarkDone} className="px-4 py-1.5 rounded-full bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition">Mark Done</button>
        {(userRole === 'Loan Officer' || userRole === 'LOA / Processor') && (
          <button onClick={handleReassign} className="px-4 py-1.5 rounded-full bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition">Reassign</button>
        )}
        {userRole !== 'Production Partner' && (
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
                        role={role}
                        onViewLoan={task => alert('View Loan/Borrower: ' + (task.loanId || task.borrower || 'N/A'))}
                      />
                    )}
                  </DraggableCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>
      {/* Create Task Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          {/* ...Create Task Form Here... */}
          <div className="p-4">Create Task Form (to be implemented)</div>
        </Modal>
      )}
      {/* Reassign Modal */}
      {showReassignModal && (
        <Modal onClose={() => setShowReassignModal(false)}>
          <div className="p-4">
            <h3 className="font-bold mb-2">Reassign Task(s)</h3>
            <select onChange={e => handleReassign(e.target.value)} className="w-full p-2 rounded border">
              {ASSIGNEE_OPTIONS.filter(opt => opt !== 'All').map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </Modal>
      )}
      {/* Snooze Modal */}
      {showSnoozeModal && (
        <Modal onClose={() => setShowSnoozeModal(false)}>
          <div className="p-4">
            <h3 className="font-bold mb-2">Snooze Task(s)</h3>
            <select value={snoozeValue} onChange={e => setSnoozeValue(e.target.value)} className="w-full p-2 rounded border mb-2">
              {SNOOZE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button onClick={() => handleSnooze(snoozeValue)} className="w-full py-2 rounded bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition">Snooze</button>
          </div>
        </Modal>
      )}
    </motion.section>
  );
};

export default TaskBoard; 