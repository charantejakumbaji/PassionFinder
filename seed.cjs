const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dnownuclqbnqwyjqjdmq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRub3dudWNscWJucXd5anFqZG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDUzNzUsImV4cCI6MjA5MjY4MTM3NX0.HPGmnGek82kXj7zlbgY7CIAlmwQPhe7iB7JlSWkko9U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const questions = [
  {
    text: "When you are faced with a completely free weekend, what is your first impulse?",
    options: [
      { text: "Start a new DIY project or creative hobby.", trait: "creative" },
      { text: "Organize my space or plan my schedule for next week.", trait: "analytical" },
      { text: "Reach out to friends or family to hang out.", trait: "social" },
      { text: "Research a new way to make money or improve my career.", trait: "business" }
    ],
    level_id: 0,
    type: "assessment"
  },
  {
    text: "If a piece of furniture arrives without an assembly manual, what do you do?",
    options: [
      { text: "I figure it out as I go and make it look unique.", trait: "creative" },
      { text: "I look up the blueprint online and follow it exactly.", trait: "analytical" },
      { text: "I call a friend who is good at building things to help.", trait: "social" },
      { text: "I hire someone else to do it so I can focus on other things.", trait: "business" }
    ],
    level_id: 0,
    type: "assessment"
  },
  {
    text: "In a group project, which role do you naturally gravitate toward?",
    options: [
      { text: "Designing the presentation and visuals.", trait: "creative" },
      { text: "Fact-checking, researching, and data analysis.", trait: "analytical" },
      { text: "Coordinating the team and ensuring everyone is happy.", trait: "social" },
      { text: "Setting the goals and ensuring we stay on budget.", trait: "leadership" }
    ],
    level_id: 0,
    type: "assessment"
  },
  {
    text: "When do you most often 'lose track of time'?",
    options: [
      { text: "While drawing, writing, or playing an instrument.", trait: "creative" },
      { text: "While solving a complex puzzle or debugging code.", trait: "analytical" },
      { text: "During a deep, meaningful conversation with someone.", trait: "social" },
      { text: "While fixing something broken or building something physical.", trait: "physical" }
    ],
    level_id: 0,
    type: "assessment"
  },
  // Feedback Questions
  {
    text: "Did you feel 'in the zone' while doing this task?",
    options: ["Yes, completely", "Somewhat", "Not really"],
    level_id: 0,
    type: "feedback"
  },
  {
    text: "On a scale of 1-5, how much energy did this task give you?",
    options: ["1 (Drained)", "2", "3 (Neutral)", "4", "5 (Energized)"],
    level_id: 0,
    type: "feedback"
  },
  {
    text: "Would you like to do more tasks like this in the future?",
    options: ["Definitely", "Maybe", "No thanks"],
    level_id: 0,
    type: "feedback"
  }
];

const tasks = [
  {
    title: "The 5-Minute Logo",
    description: "Pick a random object in your room and sketch a quick logo for a fictional brand based on it.",
    duration: "10 min",
    level_id: 0,
    trait: "creative"
  },
  {
    title: "Logic Puzzle Audit",
    description: "Find a complex problem you faced today and break it down into 5 logical steps to solve it.",
    duration: "15 min",
    level_id: 0,
    trait: "analytical"
  },
  {
    title: "The Active Listener",
    description: "Call a friend and ask them about their day. Listen for 5 minutes without talking about yourself.",
    duration: "10 min",
    level_id: 0,
    trait: "social"
  },
  {
    title: "The Value Proposition",
    description: "Think of a product you use and write a 3-sentence pitch on how to make it more profitable.",
    duration: "10 min",
    level_id: 0,
    trait: "business"
  },
  {
    title: "Tallest Tower",
    description: "Build the tallest possible tower using only 10 sheets of paper and no tape.",
    duration: "15 min",
    level_id: 0,
    trait: "physical"
  },
  {
    title: "Mission Statement",
    description: "Write a clear vision statement for your next 3 months of personal growth.",
    duration: "15 min",
    level_id: 0,
    trait: "leadership"
  }
];

async function seed() {
  console.log('Seeding questions...');
  const { error: qError } = await supabase.from('questions').insert(questions);
  if (qError) console.error('Error seeding questions:', qError);
  else console.log('Questions seeded successfully!');

  console.log('Seeding tasks...');
  const { error: tError } = await supabase.from('tasks').insert(tasks);
  if (tError) console.error('Error seeding tasks:', tError);
  else console.log('Tasks seeded successfully!');
}

seed();
