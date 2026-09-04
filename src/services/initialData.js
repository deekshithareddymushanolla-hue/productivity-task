export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Architect NovaFlow AI core orchestration engine',
    description: 'Design the unified prompt parser, streaming response handler, and context state synchronization.',
    category: 'Engineering',
    priority: 'Urgent',
    status: 'In Progress',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-1', title: 'Define interface for offline vs Gemini API connectors', completed: true },
      { id: 'sub-2', title: 'Implement rate-limiting and fallback handler', completed: true },
      { id: 'sub-3', title: 'Hook prompt templates into context dispatch', completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'task-2',
    title: 'Prepare product launch strategy and email outreach',
    description: 'Draft the beta announcement email and social teasers for product community platforms.',
    category: 'Marketing',
    priority: 'High',
    status: 'To Do',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-4', title: 'Draft email newsletter in Smart Notes', completed: true },
      { id: 'sub-5', title: 'Run AI Polish on subject lines', completed: false },
      { id: 'sub-6', title: 'Schedule Twitter/X thread with launch graphics', completed: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'task-3',
    title: 'Implement Web Audio API 40Hz Gamma Focus soundscape',
    description: 'Synthesize low-latency binaural beats and pink noise filter without external audio assets.',
    category: 'Engineering',
    priority: 'Medium',
    status: 'Completed',
    dueDate: new Date().toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-7', title: 'Setup dual oscillator stereo panner', completed: true },
      { id: 'sub-8', title: 'Tune frequency band for 40Hz beat modulation', completed: true },
      { id: 'sub-9', title: 'Add smooth gain ramp to prevent clicks', completed: true }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'task-4',
    title: 'Conduct weekly productivity retro and energy audit',
    description: 'Review deep focus hours, analyze peak distraction times, and optimize tomorrow block calendar.',
    category: 'Personal',
    priority: 'Medium',
    status: 'To Do',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-10', title: 'Check 7-day focus velocity chart', completed: false },
      { id: 'sub-11', title: 'Log top 3 cognitive wins in Notes', completed: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 'task-5',
    title: 'Research vector indexing for local note recall',
    description: 'Evaluate browser-side lightweight embedding search for fast semantic note retrieval.',
    category: 'Research',
    priority: 'Low',
    status: 'Backlog',
    dueDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-12', title: 'Benchmark MiniLM in WebAssembly', completed: false },
      { id: 'sub-13', title: 'Compare cosine similarity latency in IndexedDB', completed: false }
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Productivity Philosophy: The 3-Hour Deep Work Rule',
    content: `## Deep Work Foundations
- The human prefrontal cortex can typically sustain 3 to 4 hours of maximum creative intensity per day.
- Shield morning 9:00 AM - 12:00 PM from asynchronous notifications and meetings.
- Use 40Hz Gamma sound waves during cognitive heavy-lifting.

### Action Plan
1. Block 9:00 AM to 11:30 AM on calendar as "Nova Deep Work".
2. Turn on Do Not Disturb mode during Pomodoro cycles.
3. Review unfinished tasks every afternoon at 4:30 PM.`,
    tags: ['Philosophy', 'DeepWork', 'Focus'],
    pinned: true,
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'note-2',
    title: 'Sprint 14 Feature Ideas & AI Integrations',
    content: `### Upcoming Capabilities:
- Smart natural language task creation: e.g. "Draft proposal by Friday 3pm urgent".
- Ambient soundscapes with rain and brown noise synthesizers.
- Auto-generate Daily Standup notes from completed Kanban cards.
- Export all workspace state to offline JSON backup.`,
    tags: ['Roadmap', 'Features'],
    pinned: false,
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

export const INITIAL_HABITS = [
  { id: 'habit-1', name: 'Morning Goal Prioritization (Top 3)', streak: 6, completedToday: true, category: 'Planning' },
  { id: 'habit-2', name: '2x 50min Deep Work Sprints', streak: 4, completedToday: true, category: 'Focus' },
  { id: 'habit-3', name: 'Afternoon Brain Dump & Inbox Zero', streak: 12, completedToday: false, category: 'Organization' },
  { id: 'habit-4', name: 'Evening Walk / Screen Shutdown', streak: 3, completedToday: false, category: 'Wellness' }
];

export const INITIAL_STATS = {
  focusMinutesToday: 75,
  sessionsCompletedToday: 3,
  totalTasksCompleted: 14,
  currentStreakDays: 6,
  dailyGoalMinutes: 120
};
