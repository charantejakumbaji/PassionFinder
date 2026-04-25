import { supabase } from './supabaseClient';

/**
 * AUTHENTICATION
 */
export const logoutUser = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

/**
 * HISTORY & PROGRESS
 */

export const saveAttempt = async (userId, attempt) => {
  const { error } = await supabase
    .from('results')
    .insert({
      user_id: userId,
      traits: {
        strengths: attempt.strengths,
        careers: attempt.careers
      },
      career_recommendations: {
        loopType: attempt.loopType || 'standard'
      }
    });

  if (error) {
    console.error('Error saving attempt:', error);
    throw error;
  }

  // Clear progress once completed
  await clearProgress(userId);
};

export const getUserHistory = async (userId) => {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: true });

  if (error) {
    console.error('Error fetching history:', error);
    return [];
  }

  // Map back to the format the app expects
  return data.map(record => ({
    ...record.traits,
    ...record.career_recommendations,
    id: record.id,
    date: record.completed_at
  }));
};

export const saveProgress = async (userId, state) => {
  const { error } = await supabase
    .from('discovery_sessions')
    .upsert({
      user_id: userId,
      state: state,
      last_updated: new Date().toISOString()
    });

  if (error) {
    console.error('Error saving progress:', error);
  }
};

export const getProgress = async (userId) => {
  const { data, error } = await supabase
    .from('discovery_sessions')
    .select('state')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
    console.error('Error fetching progress:', error);
    return null;
  }

  return data ? data.state : null;
};

export const clearProgress = async (userId) => {
  const { error } = await supabase
    .from('discovery_sessions')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing progress:', error);
  }
};

/**
 * ADMIN - QUESTIONS & TASKS
 */

export const checkAdmin = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();

  if (error) return false;
  return data?.is_admin || false;
};

export const getQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
};

export const getAdminQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
};

export const saveQuestion = async (question) => {
  const { id, ...payload } = question;
  if (id) {
    const { error } = await supabase.from('questions').update(payload).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('questions').insert(payload);
    if (error) throw error;
  }
};

export const deleteQuestion = async (id) => {
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) throw error;
};

export const getAdminTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('level_id', { ascending: true })
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
};

export const saveTask = async (task) => {
  const { id, ...payload } = task;
  if (id) {
    const { error } = await supabase.from('tasks').update(payload).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('tasks').insert(payload);
    if (error) throw error;
  }
};

/**
 * ADMIN - SYSTEM OVERVIEW
 */

export const getSystemStats = async () => {
  const [profiles, results, tasks] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('results').select('id', { count: 'exact', head: true }),
    supabase.from('tasks').select('id', { count: 'exact', head: true })
  ]);

  return {
    totalUsers: profiles.count || 0,
    totalDiscoveries: results.count || 0,
    totalTasks: tasks.count || 0
  };
};

/**
 * USER PROFILE
 */

export const updateProfile = async (userId, profileData) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      bio: profileData.bio,
      goal: profileData.goal,
      interests: profileData.interests,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) throw error;
};

export const deleteTask = async (id) => {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
};

/**
 * USER TASKS (Level 1)
 */

export const getTasksWithStatus = async (userId) => {
  // 1. Fetch all tasks
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .order('id', { ascending: true });
  
  if (tasksError) throw tasksError;

  // 2. Fetch user's completion status
  const { data: userStatuses, error: statusError } = await supabase
    .from('user_tasks')
    .select('task_id, is_completed')
    .eq('user_id', userId);
  
  if (statusError) throw statusError;

  // 3. Merge status into tasks
  return tasks.map(task => {
    const status = userStatuses.find(s => s.task_id === task.id);
    return {
      ...task,
      is_completed: status ? status.is_completed : false
    };
  });
};

export const toggleTaskCompletion = async (userId, taskId, currentStatus) => {
  const { error } = await supabase
    .from('user_tasks')
    .upsert({
      user_id: userId,
      task_id: taskId,
      is_completed: !currentStatus,
      completed_at: !currentStatus ? new Date().toISOString() : null
    }, { onConflict: 'user_id,task_id' });

  if (error) throw error;
};
