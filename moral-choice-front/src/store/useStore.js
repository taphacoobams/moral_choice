import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrentUser } from '../lib/supabase/client';

// Store principal de l'application
const useStore = create(
  persist(
    (set, get) => ({
      // État de l'utilisateur
      user: null,
      isLoading: false,
      error: null,
      
      // État de la jauge morale (entre -100 et 100)
      moralScore: 0,
      
      // Historique des choix
      choices: [],
      
      // Scénarios
      scenarios: [],
      currentScenario: null,
      completedScenarios: [],
      
      // Actions pour l'utilisateur
      setUser: (user) => set({ user }),
      
      initializeUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const { user, error } = await getCurrentUser();
          if (error) throw error;
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      logout: () => set({ 
        user: null,
        moralScore: 0,
        choices: [],
        completedScenarios: []
      }),
      
      // Actions pour la jauge morale
      updateMoralScore: (impact) => {
        const currentScore = get().moralScore;
        const newScore = Math.max(-100, Math.min(100, currentScore + impact));
        set({ moralScore: newScore });
        return newScore;
      },
      
      // Actions pour les scénarios
      setScenarios: (scenarios) => set({ scenarios }),
      
      setCurrentScenario: (scenarioId) => {
        const scenario = get().scenarios.find(s => s.id === scenarioId);
        set({ currentScenario: scenario });
      },
      
      completeScenario: (scenarioId) => {
        const completedScenarios = [...get().completedScenarios, scenarioId];
        set({ completedScenarios });
      },
      
      // Actions pour les choix
      addChoice: (choice) => {
        const choices = [...get().choices, choice];
        set({ choices });
      },
      
      // Vérifier si tous les scénarios sont complétés
      areAllScenariosCompleted: () => {
        const { scenarios, completedScenarios } = get();
        return scenarios.length > 0 && completedScenarios.length === scenarios.length;
      },
      
      // Réinitialiser le jeu
      resetGame: () => set({
        moralScore: 0,
        choices: [],
        currentScenario: null,
        completedScenarios: []
      }),
    }),
    {
      name: 'moral-choice-storage',
      partialize: (state) => ({
        user: state.user,
        moralScore: state.moralScore,
        choices: state.choices,
        completedScenarios: state.completedScenarios
      }),
    }
  )
);

export default useStore;
