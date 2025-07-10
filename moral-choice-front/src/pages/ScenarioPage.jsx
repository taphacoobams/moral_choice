import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { getScenarioById, saveUserChoice } from '../lib/supabase/client';

const ScenarioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  
  const user = useStore(state => state.user);
  const updateMoralScore = useStore(state => state.updateMoralScore);
  const completeScenario = useStore(state => state.completeScenario);
  const addChoice = useStore(state => state.addChoice);
  
  // Charger le scénario
  useEffect(() => {
    const loadScenario = async () => {
      setIsLoading(true);
      try {
        const { scenario: scenarioData, error: scenarioError } = await getScenarioById(id);
        
        if (scenarioError) {
          throw new Error(scenarioError.message);
        }
        
        if (!scenarioData) {
          throw new Error('Scénario non trouvé');
        }
        
        setScenario(scenarioData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadScenario();
  }, [id]);
  
  // Gérer la sélection d'un choix
  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
  };
  
  // Gérer la confirmation du choix
  const handleConfirmChoice = async () => {
    if (!selectedChoice) return;
    
    try {
      // Mettre à jour le score moral
      const newMoralScore = updateMoralScore(selectedChoice.moral_impact);
      
      // Enregistrer le choix dans la base de données
      await saveUserChoice(
        user.id,
        scenario.id,
        selectedChoice.id,
        selectedChoice.moral_impact
      );
      
      // Ajouter le choix à l'historique local
      addChoice({
        scenario_id: scenario.id,
        scenario_title: scenario.title,
        choice_text: selectedChoice.text,
        moral_impact: selectedChoice.moral_impact,
        timestamp: new Date().toISOString()
      });
      
      // Marquer le scénario comme complété
      completeScenario(scenario.id);
      
      // Afficher le résultat
      setResultMessage(selectedChoice.consequence);
      setShowResult(true);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du choix: ' + err.message);
    }
  };
  
  // Retourner à la carte du village
  const handleContinue = () => {
    navigate('/village');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse flex space-x-4 mb-4 justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 w-3 bg-gray-500 rounded-full"></div>
            ))}
          </div>
          <p className="text-gray-400">Chargement du scénario...</p>
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
          onClick={() => navigate('/village')}
          className="btn btn-secondary mt-6"
        >
          Retour au village
        </button>
      </div>
    );
  }

  if (!scenario) {
    return null;
  }

  return (
    <div className="py-6">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="scenario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-medieval text-center mb-6">{scenario.title}</h1>
              
              <div 
                className="card mb-8"
                style={{
                  borderColor: scenario.sin_color || 'gray',
                  boxShadow: `0 0 15px ${scenario.sin_color || 'rgba(0,0,0,0.5)'}`
                }}
              >
                <h2 className="text-xl font-medieval mb-4">
                  {scenario.sin_name && (
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: scenario.sin_color }}
                    ></span>
                  )}
                  {scenario.sin_name || 'Dilemme'}
                </h2>
                
                <p className="text-gray-300 mb-6 leading-relaxed">{scenario.description}</p>
                
                <div className="space-y-4">
                  <h3 className="font-medieval">Que choisissez-vous ?</h3>
                  
                  {scenario.choices && scenario.choices.map((choice) => (
                    <motion.div
                      key={choice.id}
                      className={`scenario-option ${selectedChoice?.id === choice.id ? 'border-sin-pride bg-gray-700' : ''}`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleChoiceSelect(choice)}
                    >
                      <p>{choice.text}</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => navigate('/village')}
                    className="btn btn-secondary"
                  >
                    Retour au village
                  </button>
                  
                  <button
                    onClick={handleConfirmChoice}
                    className="btn btn-primary"
                    disabled={!selectedChoice}
                  >
                    Confirmer mon choix
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl font-medieval text-center mb-6">Conséquence</h1>
            
            <div className="card mb-8">
              <h2 className="text-xl font-medieval mb-4">Votre choix a des répercussions...</h2>
              
              <p className="text-gray-300 mb-6 leading-relaxed font-handwritten text-lg">
                {resultMessage}
              </p>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleContinue}
                  className="btn btn-primary"
                >
                  Continuer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioPage;
