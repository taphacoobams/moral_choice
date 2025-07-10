import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { getScenarios, getSins } from '../lib/supabase/client';

const VillagePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sins, setSins] = useState([]);
  const navigate = useNavigate();
  
  const setScenarios = useStore(state => state.setScenarios);
  const completedScenarios = useStore(state => state.completedScenarios);
  const areAllScenariosCompleted = useStore(state => state.areAllScenariosCompleted);
  const moralScore = useStore(state => state.moralScore);
  
  // Charger les scénarios et les péchés
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Charger les scénarios
        const { scenarios, error: scenariosError } = await getScenarios();
        if (scenariosError) throw new Error(scenariosError.message);
        setScenarios(scenarios);
        
        // Charger les péchés
        const { sins: sinsData, error: sinsError } = await getSins();
        if (sinsError) throw new Error(sinsError.message);
        setSins(sinsData);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [setScenarios]);
  
  // Rediriger vers la fin si tous les scénarios sont complétés
  useEffect(() => {
    if (areAllScenariosCompleted()) {
      navigate('/ending');
    }
  }, [areAllScenariosCompleted, navigate]);
  
  // Gérer le clic sur un lieu du village
  const handleLocationClick = (scenarioId) => {
    navigate(`/scenario/${scenarioId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse flex space-x-4 mb-4 justify-center">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-3 w-3 bg-gray-500 rounded-full"></div>
            ))}
          </div>
          <p className="text-gray-400">Chargement du village...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medieval text-red-500 mb-4">Erreur</h2>
        <p className="text-gray-300">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-secondary mt-6"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-medieval text-center mb-8">Le Village</h1>
        
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <p className="text-gray-300">
            Explorez le village et faites face aux dilemmes moraux liés aux sept péchés capitaux.
            Chaque choix influencera votre jauge morale et déterminera votre destinée.
          </p>
        </div>
        
        {/* Carte du village */}
        <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden border border-gray-800 mb-8">
          {/* Fond de la carte */}
          <div className="absolute inset-0 bg-village-pattern opacity-30"></div>
          
          {/* Points d'intérêt sur la carte */}
          <div className="absolute inset-0 p-4">
            {sins.map((sin, index) => {
              const isCompleted = completedScenarios.includes(sin.id);
              // Positionner les lieux de manière circulaire autour du centre
              const angle = (index / sins.length) * 2 * Math.PI;
              const radius = 40; // % du rayon du cercle
              const left = 50 + radius * Math.cos(angle);
              const top = 50 + radius * Math.sin(angle);
              
              return (
                <motion.div
                  key={sin.id}
                  className={`absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer ${isCompleted ? 'opacity-50' : 'sin-pulse'}`}
                  style={{ 
                    left: `${left}%`, 
                    top: `${top}%`,
                    backgroundColor: sin.color || `var(--sin-${sin.name.toLowerCase()})` 
                  }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => !isCompleted && handleLocationClick(sin.id)}
                >
                  <div className="text-center">
                    <p className="font-medieval text-white text-sm">{sin.name}</p>
                    {isCompleted && (
                      <span className="text-xs bg-black bg-opacity-60 px-2 py-0.5 rounded-full">
                        Complété
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
            
            {/* Centre du village */}
            <motion.div 
              className="absolute left-1/2 top-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 0 rgba(255,255,255,0.1)',
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 0 rgba(255,255,255,0.1)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <p className="font-medieval text-white text-sm text-center">
                Place du<br />Village
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Légende */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-medieval mb-4">Légende</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sins.map((sin) => (
              <div key={sin.id} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: sin.color || `var(--sin-${sin.name.toLowerCase()})` }}
                ></div>
                <span className="text-sm">{sin.name}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong>Votre score moral actuel:</strong> {moralScore} 
              {moralScore > 50 ? ' - Vous êtes sur la voie de la vertu.' : 
               moralScore < -50 ? ' - La corruption vous guette.' : 
               ' - Votre âme est en équilibre.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VillagePage;
