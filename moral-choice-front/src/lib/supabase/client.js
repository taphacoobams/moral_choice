import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement pour Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Les variables d\'environnement Supabase ne sont pas définies.\n' +
    'Veuillez créer un fichier .env.local à la racine du projet avec les variables suivantes:\n' +
    'VITE_SUPABASE_URL=votre_url_supabase\n' +
    'VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase'
  );
}

// Création du client Supabase avec des valeurs par défaut pour le développement
// Remplacez ces valeurs par vos propres identifiants Supabase en production
export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseAnonKey || 'example-anon-key'
);

// Fonctions d'aide pour l'authentification
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
};

// Fonctions pour les scénarios
export const getScenarios = async () => {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('id');
  return { scenarios: data, error };
};

export const getScenarioById = async (id) => {
  // Récupérer le scénario avec ses informations de base
  const { data: scenario, error: scenarioError } = await supabase
    .from('scenarios')
    .select('*, sins(*)')
    .eq('id', id)
    .single();
    
  if (scenarioError) return { error: scenarioError };
  if (!scenario) return { error: { message: 'Scénario non trouvé' } };
  
  // Récupérer les choix associés au scénario
  const { data: choices, error: choicesError } = await supabase
    .from('scenario_choices')
    .select('*')
    .eq('scenario_id', id);
    
  if (choicesError) return { error: choicesError };
  
  // Éliminer les doublons potentiels en utilisant les IDs comme clés
  const uniqueChoices = choices ? 
    Array.from(new Map(choices.map(choice => [choice.id, choice])).values()) : 
    [];
  
  // Trier les choix par ID pour assurer un ordre cohérent
  uniqueChoices.sort((a, b) => a.id - b.id);
  
  // Enrichir le scénario avec les données du péché et les choix uniques
  const enrichedScenario = {
    ...scenario,
    sin_name: scenario.sins?.name,
    sin_color: scenario.sins?.color,
    choices: uniqueChoices
  };
  
  console.log('Choix récupérés:', uniqueChoices.length, 'sur', choices ? choices.length : 0, 'total');
  
  return { scenario: enrichedScenario, error: null };
};

// Fonctions pour les choix de l'utilisateur
export const saveUserChoice = async (userId, scenarioId, choiceId, moralImpact) => {
  const { data, error } = await supabase
    .from('user_choices')
    .insert([
      { 
        user_id: userId, 
        scenario_id: scenarioId, 
        choice_id: choiceId,
        moral_impact: moralImpact,
        created_at: new Date()
      }
    ]);
  return { data, error };
};

export const getUserChoices = async (userId) => {
  const { data, error } = await supabase
    .from('user_choices')
    .select(`
      *,
      scenarios:scenario_id(id, title, description),
      choice:choice_id(id, text, consequence)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  // Transformer les données pour les rendre plus faciles à utiliser
  const transformedChoices = data?.map(choice => ({
    id: choice.id,
    user_id: choice.user_id,
    scenario_id: choice.scenario_id,
    choice_id: choice.choice_id,
    moral_impact: choice.moral_impact,
    created_at: choice.created_at,
    scenario_title: choice.scenarios?.title || 'Scénario inconnu',
    scenario_description: choice.scenarios?.description || '',
    choice_text: choice.choice?.text || 'Choix inconnu',
    choice_consequence: choice.choice?.consequence || ''
  })) || [];
  
  return { choices: transformedChoices, error };
};

// Fonction pour récupérer la fin personnalisée en fonction du score moral
export const getEndingByMoralScore = async (moralScore) => {
  // Déterminer la plage morale
  let moralRange;
  if (moralScore > 50) moralRange = 'vertueux';
  else if (moralScore < -50) moralRange = 'corrompu';
  else moralRange = 'neutre';
  
  try {
    // Récupérer la fin correspondante
    // Vérifier d'abord la structure de la table pour déterminer le nom correct de la colonne
    const { data: tableInfo, error: tableError } = await supabase
      .from('endings')
      .select('*')
      .limit(1);
    
    if (tableError) throw tableError;
    
    // Déterminer le nom de la colonne pour la plage morale
    let rangeColumnName = 'moral_range';
    if (tableInfo && tableInfo.length > 0) {
      const sampleRow = tableInfo[0];
      if ('moral_range' in sampleRow) {
        rangeColumnName = 'moral_range';
      } else if ('moralRange' in sampleRow) {
        rangeColumnName = 'moralRange';
      } else if ('range' in sampleRow) {
        rangeColumnName = 'range';
      }
    }
    
    // Récupérer la fin avec le nom de colonne correct
    const { data, error } = await supabase
      .from('endings')
      .select('*')
      .eq(rangeColumnName, moralRange)
      .maybeSingle(); // Utiliser maybeSingle() au lieu de single() pour éviter l'erreur
    
    return { ending: data, error };
  } catch (err) {
    console.error('Erreur lors de la récupération de la fin :', err);
    return { ending: null, error: err };
  }
};

// Fonction pour récupérer les péchés
export const getSins = async () => {
  const { data, error } = await supabase
    .from('sins')
    .select('*');
  return { sins: data, error };
};

// Fonction pour récupérer les fins possibles
export const getEndings = async () => {
  const { data, error } = await supabase
    .from('endings')
    .select('*');
  return { endings: data, error };
};


// Fonctions pour les profils utilisateurs
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { profile: data, error };
};

export const createUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{ user_id: userId }])
    .select()
    .single();
  return { profile: data, error };
};

export const updateUserMoralScore = async (userId, moralImpact) => {
  // D'abord, récupérer le profil actuel
  const { profile, error: fetchError } = await getUserProfile(userId);
  
  if (fetchError) {
    // Si le profil n'existe pas, le créer
    if (fetchError.code === 'PGRST116') {
      const { profile: newProfile, error: createError } = await createUserProfile(userId);
      if (createError) return { error: createError };
      
      // Utiliser le nouveau profil pour la mise à jour
      return updateExistingProfile(newProfile, moralImpact);
    }
    return { error: fetchError };
  }
  
  // Mettre à jour le profil existant
  return updateExistingProfile(profile, moralImpact);
};

// Fonction d'aide pour mettre à jour un profil existant
const updateExistingProfile = async (profile, moralImpact) => {
  // Déterminer le type de choix (vertueux, neutre, corrompu)
  let virtuous_choices = profile.virtuous_choices || 0;
  let neutral_choices = profile.neutral_choices || 0;
  let corrupt_choices = profile.corrupt_choices || 0;
  
  if (moralImpact > 0) virtuous_choices += 1;
  else if (moralImpact < 0) corrupt_choices += 1;
  else neutral_choices += 1;
  
  // Calculer le nouveau score moral
  const newScore = (profile.moral_score || 0) + moralImpact;
  
  // Mettre à jour le profil
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      moral_score: newScore,
      virtuous_choices,
      neutral_choices,
      corrupt_choices,
      updated_at: new Date()
    })
    .eq('id', profile.id)
    .select()
    .single();
  
  return { profile: data, error };
};

// Fonction pour réinitialiser la progression d'un utilisateur
export const resetUserProgress = async (userId) => {
  // Supprimer tous les choix de l'utilisateur
  const { error: deleteChoicesError } = await supabase
    .from('user_choices')
    .delete()
    .eq('user_id', userId);
  
  if (deleteChoicesError) return { error: deleteChoicesError };
  
  // Réinitialiser le profil de l'utilisateur
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      moral_score: 0,
      virtuous_choices: 0,
      neutral_choices: 0,
      corrupt_choices: 0,
      updated_at: new Date()
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  return { profile: data, error };
};

// Fonction pour vérifier si un scénario a été complété par l'utilisateur
export const isScenarioCompleted = async (userId, scenarioId) => {
  const { data, error } = await supabase
    .from('user_choices')
    .select('id')
    .eq('user_id', userId)
    .eq('scenario_id', scenarioId)
    .single();
  
  return { completed: !!data, error };
};

// Fonction pour obtenir les statistiques globales de l'utilisateur
export const getUserStats = async (userId) => {
  const { profile, error: profileError } = await getUserProfile(userId);
  if (profileError) return { error: profileError };
  
  const { choices, error: choicesError } = await getUserChoices(userId);
  if (choicesError) return { error: choicesError };
  
  const { scenarios, error: scenariosError } = await getScenarios();
  if (scenariosError) return { error: scenariosError };
  
  const completedScenarios = choices ? [...new Set(choices.map(c => c.scenario_id))].length : 0;
  const totalScenarios = scenarios ? scenarios.length : 0;
  
  return {
    stats: {
      moralScore: profile?.moral_score || 0,
      virtuousChoices: profile?.virtuous_choices || 0,
      neutralChoices: profile?.neutral_choices || 0,
      corruptChoices: profile?.corrupt_choices || 0,
      completedScenarios,
      totalScenarios,
      progress: totalScenarios > 0 ? (completedScenarios / totalScenarios) * 100 : 0
    }
  };
};
