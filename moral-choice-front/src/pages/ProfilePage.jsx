import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useStore from '../store/useStore';
import { getUserChoices } from '../lib/supabase/client';

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userChoices, setUserChoices] = useState([]);
  
  const user = useStore(state => state.user);
  const moralScore = useStore(state => state.moralScore);
  const resetGame = useStore(state => state.resetGame);
  
  // Charger l'historique des choix de l'utilisateur
  useEffect(() => {
    const loadUserChoices = async () => {
      setIsLoading(true);
      try {
        const { choices, error: choicesError } = await getUserChoices(user.id);
        
        if (choicesError) {
          throw new Error(choicesError.message);
        }
        
        setUserChoices(choices || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserChoices();
  }, [user.id]);
  
  // Préparer les données pour le graphique
  const prepareChartData = () => {
    // Compter les choix positifs et négatifs
    const positiveChoices = userChoices.filter(choice => choice.moral_impact > 0).length;
    const negativeChoices = userChoices.filter(choice => choice.moral_impact < 0).length;
    const neutralChoices = userChoices.filter(choice => choice.moral_impact === 0).length;
    
    return [
      { name: 'Vertueux', value: positiveChoices, color: '#22c55e' },
      { name: 'Neutres', value: neutralChoices, color: '#8b5cf6' },
      { name: 'Corrompus', value: negativeChoices, color: '#dc2626' }
    ];
  };
  
  // Gérer la réinitialisation du jeu
  const handleResetGame = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser votre progression ? Cette action est irréversible.')) {
      resetGame();
      window.location.href = '/village';
    }
  };
  
  // Obtenir une description basée sur le score moral
  const getMoralDescription = () => {
    if (moralScore > 75) return 'Vous êtes une personne vertueuse, guidée par des principes moraux solides.';
    if (moralScore > 25) return 'Vous avez tendance à faire des choix honorables, mais n\'êtes pas insensible aux tentations.';
    if (moralScore > -25) return 'Vous naviguez entre le bien et le mal, sans vous engager fermement d\'un côté ou de l\'autre.';
    if (moralScore > -75) return 'Vous cédez souvent aux tentations et aux vices, mais gardez une part d\'humanité.';
    return 'Vous avez embrassé la corruption et les péchés, sans remords apparents.';
  };
  
  const chartData = prepareChartData();

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-medieval text-center mb-8">Votre Profil</h1>
        
        <div className="max-w-3xl mx-auto">
          {/* Informations utilisateur */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-3xl font-medieval">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-medieval mb-2">{user.user_metadata?.username || user.email}</h2>
                <p className="text-gray-400 mb-4">Membre depuis {new Date(user.created_at).toLocaleDateString()}</p>
                
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-700">
                  <span 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ 
                      backgroundColor: moralScore > 0 ? 'var(--moral-high)' : 
                                       moralScore < 0 ? 'var(--moral-low)' : 'gray'
                    }}
                  ></span>
                  <span className="text-sm">
                    Score moral: {moralScore}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="font-medieval mb-3">Votre nature morale</h3>
              <p className="text-gray-300">{getMoralDescription()}</p>
            </div>
          </div>
          
          {/* Statistiques des choix */}
          <div className="card mb-8">
            <h2 className="text-xl font-medieval mb-4">Vos choix</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse flex space-x-4 mb-4 justify-center">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-3 w-3 bg-gray-500 rounded-full"></div>
                  ))}
                </div>
                <p className="text-gray-400">Chargement de vos choix...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-red-400">{error}</p>
              </div>
            ) : userChoices.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Vous n'avez pas encore fait de choix.</p>
            ) : (
              <div className="space-y-6">
                {/* Graphique des choix */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} choix`, 'Quantité']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Historique des choix récents */}
                <div>
                  <h3 className="font-medieval mb-3">Historique récent</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {userChoices.slice(0, 5).map((choice, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-gray-800 rounded-md border-l-4"
                        style={{ 
                          borderColor: choice.moral_impact > 0 ? 'var(--moral-high)' : 
                                      choice.moral_impact < 0 ? 'var(--moral-low)' : 'gray'
                        }}
                      >
                        <p className="text-sm font-medium mb-1">{choice.scenario_title}</p>
                        <p className="text-xs text-gray-400">{choice.choice_text}</p>
                        <p className="text-xs text-right mt-1">
                          {new Date(choice.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="card">
            <h2 className="text-xl font-medieval mb-4">Actions</h2>
            
            <div className="space-y-4">
              <button
                onClick={handleResetGame}
                className="btn btn-secondary w-full"
              >
                Réinitialiser ma progression
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
