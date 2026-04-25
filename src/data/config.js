// ============================================
// HOW TO ADD MORE QUESTIONS OR TASKS
// ============================================
// 1. To add a question, add a new object to the `questionsData` array.
// 2. To add a task, add a new object to the `challengesData` array.
// ============================================

export const questionsData = [
  {
    id: 1,
    text: "What do you enjoy watching?",
    options: ["Documentaries & Tech", "Art & Design", "People talking & Drama", "Action & Fast-paced"]
  },
  {
    id: 2,
    text: "What type of tasks do you like?",
    options: ["Solving puzzles", "Creating visuals", "Organizing things", "Talking to people"]
  },
  {
    id: 3,
    text: "When faced with a complex problem, you...",
    options: ["Break it down logically", "Brainstorm wild ideas", "Look for a system", "Ask for opinions"]
  },
  {
    id: 4,
    text: "In your free time, you prefer to...",
    options: ["Learn a new skill", "Draw or write", "Plan your week", "Hang out with friends"]
  },
  {
    id: 5,
    text: "You feel most fulfilled when you...",
    options: ["Figure out how things work", "Make something beautiful", "Complete a checklist", "Help someone out"]
  }
];

export const challengesData = [
  { id: 1, title: 'Record a 1-min explanation video', duration: '15 min' },
  { id: 2, title: 'Design a simple poster', duration: '20 min' },
  { id: 3, title: 'Solve a logic problem', duration: '15 min' }
];
