// AI Service: Handles both intelligent offline productivity heuristics and live Gemini API requests

export async function askGeminiAPI(apiKey, prompt, systemInstruction = '') {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [{
          text: systemInstruction ? `${systemInstruction}\n\nUser Request: ${prompt}` : prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}: Failed to communicate with Gemini API`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No response received from Gemini.';
  } catch (error) {
    console.error('Gemini API error, falling back to built-in offline engine:', error);
    throw error;
  }
}

// Built-in intelligent offline productivity generation engine
export function generateOfflineResponse(prompt, mode, context = {}) {
  const trimmed = prompt.trim();
  const lower = trimmed.toLowerCase();

  if (mode === 'goal_breakdown' || lower.includes('break down') || lower.includes('plan for') || lower.includes('launch') || lower.includes('project')) {
    // Generate structured tasks that can be directly added to Kanban
    const topic = trimmed.replace(/^(break down|plan for|how to|create a plan for)\s+/i, '') || 'Project';
    
    const tasks = [
      {
        id: `ai-${Date.now()}-1`,
        title: `Define core scope & success metrics for ${topic}`,
        description: `Establish non-negotiable milestones, required resources, and deliverable specifications for ${topic}.`,
        category: 'Planning',
        priority: 'Urgent',
        status: 'To Do',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        subtasks: [
          { id: `st-1`, title: 'Draft 1-page requirements specification', completed: false },
          { id: `st-2`, title: 'Identify potential bottlenecks & dependencies', completed: false },
          { id: `st-3`, title: 'Align with key stakeholders', completed: false }
        ]
      },
      {
        id: `ai-${Date.now()}-2`,
        title: `Execute Sprint 1 implementation / prototype of ${topic}`,
        description: `Deep focus sprint to build the initial baseline or draft deliverable.`,
        category: 'Engineering',
        priority: 'High',
        status: 'To Do',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        subtasks: [
          { id: `st-4`, title: 'Setup foundational architecture / outline', completed: false },
          { id: `st-5`, title: 'Iterate through main components', completed: false }
        ]
      },
      {
        id: `ai-${Date.now()}-3`,
        title: `Quality review, testing & polish for ${topic}`,
        description: `Review against baseline goals, eliminate defects, and prepare final handover.`,
        category: 'Marketing',
        priority: 'Medium',
        status: 'Backlog',
        dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        subtasks: [
          { id: `st-6`, title: 'Run user/peer feedback loop', completed: false },
          { id: `st-7`, title: 'Publish or ship final deliverables', completed: false }
        ]
      }
    ];

    const markdownText = `### 🎯 Actionable Plan: ${topic}\n\nI have deconstructed your objective into **3 structured milestone tasks** with priority ratings and estimated time horizons:\n\n1. **Define core scope & success metrics** (Urgent · 1 Day)\n   - 1-page requirements specification\n   - Identify bottlenecks & dependencies\n2. **Execute Sprint 1 implementation / prototype** (High · 2 Days)\n   - Setup foundational architecture\n   - Core components build\n3. **Quality review, testing & polish** (Medium · 4 Days)\n   - Peer review & quality validation\n   - Final release checklist\n\n*Click below to automatically populate these tasks onto your Kanban board!*`;

    return {
      text: markdownText,
      hasStructuredTasks: true,
      tasks: tasks
    };
  }

  if (mode === 'email_polish' || lower.includes('email') || lower.includes('rephrase') || lower.includes('rewrite')) {
    return {
      text: `### ✉️ Polished Communication Options\n\n**Option A: Executive & Crisp (Recommended)**\n> "Hi Team,\n> \n> Following up on our current milestones: we are currently tracking ahead of schedule. Please review the attached deliverables by 3:00 PM today so we can finalize rollout.\n> \n> Let me know if there are any immediate blockers."\n\n**Option B: Friendly & Collaborative**\n> "Hey everyone! Hope your day is going great. Just wanted to share a quick update on our progress—things look fantastic. When you get a chance, take a peek at the updates so we can wrap this up smoothly. Thanks a ton for your hard work!"\n\n**Key Refinements Made:** Removed conversational fluff, placed the specific deadline front-and-center, and defined the single desired action item clearly.`,
      hasStructuredTasks: false
    };
  }

  if (mode === 'daily_standup' || lower.includes('standup') || lower.includes('retro')) {
    const completed = context.completedTasks || ['Implemented Web Audio API Gamma Soundscapes', 'Sprint 14 Planning'];
    const inProgress = context.inProgressTasks || ['Architect NovaFlow AI orchestration engine'];

    return {
      text: `### 📋 Daily Standup Summary\n\n**✅ Done Yesterday / Completed:**\n${completed.map(t => `- ${t}`).join('\n') || '- Completed core sprint items'}\n\n**⚡ In Progress Today:**\n${inProgress.map(t => `- ${t}`).join('\n') || '- Deep work focus on high-priority tickets'}\n- 2x 50-minute uninterrupted Pomodoro sprint blocks scheduled\n\n**🛑 Potential Blockers:**\n- None currently. Shielding 9:00 AM - 11:30 AM for deep work.`,
      hasStructuredTasks: false
    };
  }

  if (mode === 'focus_coach' || lower.includes('tired') || lower.includes('focus') || lower.includes('distracted') || lower.includes('pomodoro')) {
    return {
      text: `### 🧠 Cognitive Performance & Focus Protocol\n\n1. **The 20-20-20 Rule**: Look at an object at least 20 feet away for 20 seconds to reset your optic nerve strain.\n2. **Sound Entrainment**: Toggle on the **40Hz Gamma Focus** soundscape in the Focus Flow tab. 40Hz oscillation is clinically proven to boost attentional binding and working memory.\n3. **Friction-Free Entry**: Don't commit to working for 4 hours. Commit to **just 5 minutes** on your highest-leverage task. The Zeigarnik effect will carry you forward naturally.\n4. **Hydration & Dopamine**: Drink 250ml of cold water right now. Mild 1-2% dehydration drops cognitive velocity by over 12%.`,
      hasStructuredTasks: false
    };
  }

  // General helpful response
  return {
    text: `### 💡 Productivity Insight\n\nI am ready to accelerate your workflow. Here are a few ways you can direct me:\n\n- **"Break down [project goal]"**: I will automatically generate prioritized cards and load them onto your Kanban board.\n- **"Draft standup update"**: I will synthesize all your in-progress and completed cards into an executive standup report.\n- **"Polish this message: [text]"**: Reframe any note or message for high-impact clarity.\n- **"Optimize my focus schedule"**: Get custom time-blocking recommendations based on your current workload.`,
    hasStructuredTasks: false
  };
}

// Subtask generator for Kanban cards
export function generateSubtasksForTask(taskTitle, taskDescription = '') {
  const combined = `${taskTitle} ${taskDescription}`.toLowerCase();

  if (combined.includes('email') || combined.includes('newsletter') || combined.includes('marketing')) {
    return [
      { id: `st-${Date.now()}-1`, title: 'Define target audience segment & key hook', completed: false },
      { id: `st-${Date.now()}-2`, title: 'Draft primary value proposition & CTA link', completed: false },
      { id: `st-${Date.now()}-3`, title: 'Run A/B subject line clarity check', completed: false },
      { id: `st-${Date.now()}-4`, title: 'Schedule send time for peak open rates', completed: false }
    ];
  }

  if (combined.includes('code') || combined.includes('engine') || combined.includes('api') || combined.includes('design') || combined.includes('dev')) {
    return [
      { id: `st-${Date.now()}-1`, title: 'Draft interface definition & data contracts', completed: false },
      { id: `st-${Date.now()}-2`, title: 'Implement core functionality & error boundaries', completed: false },
      { id: `st-${Date.now()}-3`, title: 'Write unit tests for edge cases', completed: false },
      { id: `st-${Date.now()}-4`, title: 'Perform peer review and merge', completed: false }
    ];
  }

  return [
    { id: `st-${Date.now()}-1`, title: `Outline prerequisites & requirements`, completed: false },
    { id: `st-${Date.now()}-2`, title: `Execute Phase 1 deep work block`, completed: false },
    { id: `st-${Date.now()}-3`, title: `Review output against quality checklist`, completed: false },
    { id: `st-${Date.now()}-4`, title: `Finalize and archive deliverables`, completed: false }
  ];
}

// Convert a note's text into actionable Kanban cards
export function extractTasksFromNoteText(noteContent) {
  const lines = noteContent.split('\n');
  const extracted = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    // Matches checklist items, bullet points, or numbered points with action words
    if (/^[-*]\s*\[\s*\]/.test(trimmed) || /^[0-9]+\.\s+/.test(trimmed) || /^[-*]\s+(Block|Draft|Create|Implement|Setup|Review|Run|Finish|Schedule|Write|Test|Deploy)/i.test(trimmed)) {
      const cleanTitle = trimmed
        .replace(/^[-*]\s*\[\s*\]\s*/, '')
        .replace(/^[0-9]+\.\s*/, '')
        .replace(/^[-*]\s*/, '');

      if (cleanTitle.length > 5) {
        extracted.push({
          id: `extracted-${Date.now()}-${index}`,
          title: cleanTitle,
          description: `Extracted from Smart Note on ${new Date().toLocaleDateString()}`,
          category: 'Extracted',
          priority: 'Medium',
          status: 'To Do',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          subtasks: [
            { id: `sub-${Date.now()}-1`, title: 'Complete first review', completed: false }
          ]
        });
      }
    }
  });

  // If no specific bullet was detected, make a general task
  if (extracted.length === 0 && noteContent.trim().length > 10) {
    extracted.push({
      id: `extracted-${Date.now()}-main`,
      title: `Action Item: ${noteContent.slice(0, 50)}...`,
      description: noteContent.slice(0, 200),
      category: 'Extracted',
      priority: 'Medium',
      status: 'To Do',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      subtasks: []
    });
  }

  return extracted;
}
