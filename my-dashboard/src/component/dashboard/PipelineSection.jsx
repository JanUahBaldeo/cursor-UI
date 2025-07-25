import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useModal } from '../../App';

// Pipeline configs for each type (as per prompt)
const PIPELINE_CONFIGS = {
  LO: {
    label: 'Loan Application Pipeline',
    stages: [
  { key: 'New Lead', color: 'teal', icon: '🟢' },
  { key: 'Contacted', color: 'gray', icon: '📞' },
  { key: 'Application Started', color: 'blue', icon: '📝' },
  { key: 'Pre-Approved', color: 'red', icon: '✅' },
  { key: 'In Underwriting', color: 'orange', icon: '🔍' },
  { key: 'Closed', color: 'green', icon: '🏁' },
    ],
    mockData: [
      // Add mock data for demo
      { id: '1', borrower: 'Alice Smith', address: '123 Main St', loanType: 'Conventional', stage: 'New Lead', timeInStage: 2, status: 'On Track', loanNumber: 'LO-001' },
      { id: '2', borrower: 'Bob Johnson', address: '456 Oak Ave', loanType: 'FHA', stage: 'Contacted', timeInStage: 5, status: 'Delayed', loanNumber: 'LO-002' },
      { id: '3', borrower: 'Carol Lee', address: '789 Pine Rd', loanType: 'VA', stage: 'Application Started', timeInStage: 1, status: 'On Track', loanNumber: 'LO-003' },
      { id: '4', borrower: 'David Kim', address: '321 Maple Dr', loanType: 'Jumbo', stage: 'Pre-Approved', timeInStage: 8, status: 'Stalled', loanNumber: 'LO-004' },
      { id: '5', borrower: 'Eva Green', address: '654 Cedar Ln', loanType: 'Conventional', stage: 'In Underwriting', timeInStage: 3, status: 'On Track', loanNumber: 'LO-005' },
      { id: '6', borrower: 'Frank Moore', address: '987 Birch Blvd', loanType: 'FHA', stage: 'Closed', timeInStage: 0, status: 'On Track', loanNumber: 'LO-006' },
    ],
  },
  ClosedClient: {
    label: 'Closed Client Management Pipeline',
    stages: [
      { key: 'Just Closed', color: 'teal', icon: '🎉' },
      { key: '30-Day Review', color: 'blue', icon: '📆' },
      { key: 'Refi Opportunity Identified', color: 'yellow', icon: '💡' },
      { key: 'Annual Review', color: 'purple', icon: '📅' },
      { key: 'Event Campaign', color: 'pink', icon: '🎈' },
      { key: 'Dormant / Watchlist', color: 'gray', icon: '🕰️' },
    ],
    mockData: [], // Add mock data as needed
  },
  LOA: {
    label: 'LOA File Processing Pipeline',
    stages: [
      { key: 'App Received', color: 'teal', icon: '📥' },
      { key: 'Pre-Approval Issued', color: 'blue', icon: '✅' },
      { key: 'In Processing', color: 'orange', icon: '🔄' },
      { key: 'Submitted to UW', color: 'purple', icon: '📤' },
      { key: 'Conditional Approval', color: 'yellow', icon: '📝' },
      { key: 'CTC', color: 'green', icon: '✔️' },
      { key: 'Docs Out / Scheduled', color: 'pink', icon: '📄' },
      { key: 'Funded', color: 'cyan', icon: '💰' },
      { key: 'Post-Close Follow-Up', color: 'gray', icon: '🔚' },
    ],
    mockData: [], // Add mock data as needed
  },
  CEM: {
    label: 'Production Partner Prospect Pipeline',
    stages: [
      { key: 'Clicked Ad', color: 'teal', icon: '🖱️' },
      { key: 'Landing Page Viewed', color: 'blue', icon: '🌐' },
      { key: 'Form Submitted', color: 'orange', icon: '📝' },
      { key: 'Qualified Lead', color: 'green', icon: '✅' },
      { key: 'Booked Appointment', color: 'purple', icon: '📅' },
      { key: 'Engaged / Assigned', color: 'pink', icon: '🤝' },
    ],
    mockData: [], // Add mock data as needed
  },
};

const STATUS_COLORS = {
  'On Track': 'bg-green-100 text-green-700',
  'Delayed': 'bg-yellow-100 text-yellow-700',
  'Stalled': 'bg-red-100 text-red-700',
};

const MOCK_ROLE = 'LO'; // Replace with real context/logic

// Color hex map for animatable colors
const COLOR_HEX = {
  teal: '#14b8a6',
  gray: '#9ca3af',
  blue: '#3b82f6',
  red: '#ef4444',
  orange: '#fb923c',
  green: '#22c55e',
  yellow: '#facc15',
  purple: '#a78bfa',
  pink: '#f472b6',
  cyan: '#06b6d4',
};

const PipelineSection = () => {
  const [pipelineType, setPipelineType] = useState(MOCK_ROLE);
  const config = PIPELINE_CONFIGS[pipelineType];
  const STAGES = config.stages;
  const [pipelineData, setPipelineData] = useState(config.mockData);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showModal } = useModal();

  // Kanban: group by stage
  const cardsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.key] = pipelineData.filter((c) => c.stage === stage.key);
    return acc;
  }, {});

  // Metrics header (total per stage, avg time, conversion, revenue)
  const metrics = STAGES.map(stage => {
    const cards = cardsByStage[stage.key];
    const total = cards.length;
    const avgTime = total ? (cards.reduce((sum, c) => sum + (c.timeInStage || 0), 0) / total).toFixed(1) : 0;
    // Conversion and revenue are mocked for now
    return { stage: stage.key, total, avgTime, conversion: '—', revenue: '—' };
  });

  // Filter bar (mocked, not functional yet)
  // ...implement as needed...

  // Drag-and-drop handler (auto-update stage)
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const card = cardsByStage[source.droppableId][source.index];
    let newData = pipelineData.filter((c) => c.id !== card.id);
    newData.push({ ...card, stage: destination.droppableId, timeInStage: 0 }); // Reset time in stage
    setPipelineData(newData);
  };

  // Card modal view
  const handleCardClick = (item) => {
    showModal(
      <div className="space-y-2">
        <h2 className="text-xl font-bold mb-2">{item.borrower} ({item.loanNumber})</h2>
        <div><strong>Address:</strong> {item.address}</div>
        <div><strong>Loan Type:</strong> {item.loanType}</div>
        <div><strong>Stage:</strong> {item.stage}</div>
        <div><strong>Time in Stage:</strong> {item.timeInStage} days</div>
        <div><strong>Status:</strong> <span className={`inline-block px-2 py-0.5 rounded ${STATUS_COLORS[item.status]}`}>{item.status}</span></div>
        {/* Add CTA dropdown, text/call widget, etc. here */}
      </div>
    );
  };

  // PipelineCard (inner component)
  function PipelineCard({ borrower, address, loanType, stage, timeInStage, status, loanNumber }) {
    // Find the color for the current stage
    const stageColor = COLOR_HEX[
      (PIPELINE_CONFIGS[pipelineType]?.stages.find(s => s.key === stage)?.color || 'teal')
    ];
    return (
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 flex flex-col gap-2 border border-gray-100 dark:border-gray-800"
        whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(1,129,142,0.10)', borderColor: stageColor }}
        tabIndex={0}
        aria-label={`Pipeline card for ${borrower}, stage ${stage}`}
        onClick={() => handleCardClick({ borrower, address, loanType, stage, timeInStage, status, loanNumber })}
        style={{ borderColor: stageColor }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="font-bold text-gray-800 dark:text-white text-base">{borrower}</div>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[status]}`}>{status}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-300">{address || loanNumber}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 font-semibold uppercase">{loanType}</span>
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">{stage}</span>
          <span className="ml-auto text-xs">⏱️ {timeInStage}d</span>
        </div>
        {/* CTA dropdown, text/call widget, alert if stalled, etc. can go here */}
      </motion.div>
    );
  }

  return (
    <section className="relative w-full px-2 sm:px-6 py-8">
      {/* Pipeline Switcher */}
      <div className="flex gap-3 mb-8">
        {Object.entries(PIPELINE_CONFIGS).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setPipelineType(key)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 ${pipelineType === key ? 'bg-[#01818E] text-white border-[#01818E]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
          >
            {cfg.label}
          </button>
        ))}
      </div>
      {/* Metrics Header */}
      <div className="flex flex-wrap gap-6 mb-8 justify-center">
        {metrics.map(m => (
          <div key={m.stage} className="min-w-[160px] bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center border border-gray-100 dark:border-gray-800">
            <div className="font-bold text-cyan-700 dark:text-cyan-300 text-lg mb-1">{m.stage}</div>
            <div className="text-xs text-gray-500 mb-1">Total: <span className="font-semibold text-gray-700 dark:text-white">{m.total}</span></div>
            <div className="text-xs text-gray-500 mb-1">Avg Time: <span className="font-semibold text-gray-700 dark:text-white">{m.avgTime}d</span></div>
            <div className="text-xs text-gray-500">Conversion: {m.conversion}</div>
          </div>
        ))}
      </div>
      {/* Kanban Board */}
      <div className="overflow-x-auto pb-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-8 min-w-[900px]">
            {STAGES.map((stage, idx) => {
              const cards = cardsByStage[stage.key];
              return (
                <div key={stage.key} className="flex-1 min-w-[280px] max-w-[340px] flex flex-col items-center snap-start">
                  {/* Cards in Droppable */}
                  <Droppable droppableId={stage.key} key={stage.key}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col gap-8 py-2 w-full items-center"
                      >
                <AnimatePresence>
                          {cards.length === 0 && (
                            <div className="text-xs text-gray-400 italic px-4">No cards</div>
                          )}
                          {cards.map((item, i) => (
                            <Draggable draggableId={item.id} index={i} key={item.id}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-2 w-full ${snapshot.isDragging ? 'ring-2 ring-cyan-300' : ''}`}
                                >
                                  {/* Column header and add button inside the first card */}
                                  {i === 0 && (
                                    <div className="flex flex-col items-center mb-2 mt-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="w-4 h-4 rounded-full bg-cyan-400"></span>
                                        <span className="flex items-center gap-2 text-lg font-bold text-gray-700">
                                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-400 text-white text-xl">{stage.icon}</span>
                                          {stage.key}
                                        </span>
                                      </div>
                                      <button
                                        className="mt-2 mb-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center text-2xl z-10 border-4 border-white/60 backdrop-blur transition-transform duration-200 hover:scale-110 focus:scale-110 focus:outline-none animate-pulse hover:animate-none"
                                        onClick={() => setShowAddModal(true)}
                                        title={`Add to ${stage.key}`}
                                        aria-label={`Add to ${stage.key}`}
                                      >
                                        <HiPlus />
                                      </button>
                                    </div>
                                  )}
                                  <PipelineCard {...item} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                </AnimatePresence>
              </div>
                    )}
                  </Droppable>
            </div>
              );
            })}
        </div>
        </DragDropContext>
      </div>
      {/* Add Modal Placeholder (not implemented) */}
    </section>
  );
};

export default PipelineSection;
