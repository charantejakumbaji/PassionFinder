export const TRAITS = {
  CREATIVE: { id: 'creative', label: 'Creative', color: '#ff007f' },
  ANALYTICAL: { id: 'analytical', label: 'Analytical', color: '#00f2fe' },
  SOCIAL: { id: 'social', label: 'Social', color: '#8a2be2' },
  BUSINESS: { id: 'business', label: 'Business', color: '#ffd700' },
  PHYSICAL: { id: 'physical', label: 'Physical', color: '#ff4500' },
  LEADERSHIP: { id: 'leadership', label: 'Leadership', color: '#32cd32' },
};

export const QUESTIONS = [
  {
    id: 1,
    text: "What do you feel like doing right now?",
    options: [
      { text: "Create something", trait: 'creative' },
      { text: "Solve something", trait: 'analytical' },
      { text: "Talk to people", trait: 'social' },
      { text: "Think of ideas/money", trait: 'business' },
      { text: "Do physical activity", trait: 'physical' },
      { text: "Lead or organize", trait: 'leadership' },
    ]
  },
  {
    id: 2,
    text: "Which activity sounds most interesting?",
    options: [
      { text: "Painting, writing, or designing", trait: 'creative' },
      { text: "Analyzing data or fixing bugs", trait: 'analytical' },
      { text: "Meeting new people or teaching", trait: 'social' },
      { text: "Starting a project or selling", trait: 'business' },
      { text: "Sports, dancing, or working out", trait: 'physical' },
      { text: "Planning an event or team task", trait: 'leadership' },
    ]
  },
  {
    id: 3,
    text: "If you had 1 free hour, what would you choose?",
    options: [
      { text: "Make a DIY craft", trait: 'creative' },
      { text: "Research a deep topic", trait: 'analytical' },
      { text: "Call a friend for a deep chat", trait: 'social' },
      { text: "Work on a side hustle", trait: 'business' },
      { text: "Go for a run or swim", trait: 'physical' },
      { text: "Organize a group activity", trait: 'leadership' },
    ]
  }
];

export const TASKS_DATA = {
  creative: {
    task1: {
      title: "Quick Spark",
      instruction: "Create something in 2 minutes (write a short poem, draw a doodle, or sketch a UI idea).",
      duration: 120
    },
    task2Deep: {
      title: "Concept Bridge",
      instruction: "Expand your creation: What is its purpose? Who is it for? Write 3 bullet points.",
      duration: 180
    },
    task2Switch: {
      title: "Logic Flip",
      instruction: "Solve this: 2, 4, 8, 16, ?. What comes next and why?",
      duration: 120
    }
  },
  analytical: {
    task1: {
      title: "Sequence Master",
      instruction: "Solve: 2, 4, 8, 16, ?. What is the logic behind it?",
      duration: 120
    },
    task2Deep: {
      title: "Complex Flow",
      instruction: "If A > B and B > C, is C > A? Explain the path clearly.",
      duration: 180
    },
    task2Switch: {
      title: "Idea Spark",
      instruction: "Think of a name for a new coffee brand that uses 100% recycled cups.",
      duration: 120
    }
  },
  social: {
    task1: {
      title: "Clear Voice",
      instruction: "Explain one idea clearly (like why you like your favorite movie).",
      duration: 120
    },
    task2Deep: {
      title: "Persuasion Pro",
      instruction: "Think of 3 arguments to convince someone to join your favorite hobby.",
      duration: 180
    },
    task2Switch: {
      title: "Quiet Focus",
      instruction: "Brainstorm 5 ways to improve the efficiency of a kitchen layout.",
      duration: 120
    }
  },
  business: {
    task1: {
      title: "Market Mind",
      instruction: "Think of something to sell and who will buy it (target audience).",
      duration: 120
    },
    task2Deep: {
      title: "Model Maker",
      instruction: "Explain how you would make $100 profit from this idea in one week.",
      duration: 180
    },
    task2Switch: {
      title: "Design Touch",
      instruction: "Sketch a simple logo or mascot for a new fitness app.",
      duration: 120
    }
  },
  physical: {
    task1: {
      title: "Movement Burst",
      instruction: "Do 1 minute of physical activity (pushups, stretching, or walking in place).",
      duration: 60
    },
    task2Deep: {
      title: "Form Check",
      instruction: "Describe the perfect technique for a squat or a yoga pose.",
      duration: 120
    },
    task2Switch: {
      title: "Team Strategy",
      instruction: "How would you organize a group of people to move a heavy sofa safely?",
      duration: 120
    }
  },
  leadership: {
    task1: {
      title: "Order Finder",
      instruction: "Think of one thing to organize or improve in your current room.",
      duration: 120
    },
    task2Deep: {
      title: "Captain's Log",
      instruction: "If you had a team of 5, how would you assign roles to clean a park?",
      duration: 180
    },
    task2Switch: {
      title: "Deep Analysis",
      instruction: "Look at a nearby object. How many ways can you break it down into parts?",
      duration: 120
    }
  }
};
