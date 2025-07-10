import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { getEndingByMoralScore } from '../lib/supabase/client';

const EndingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ending, setEnding] = useState(null);
  const navigate = useNavigate();
  
  const moralScore = useStore(state => state.moralScore);
  const resetGame = useStore(state => state.resetGame);
  const choices = useStore(state => state.choices);
  
  // Charger la fin appropriée en fonction du score moral
  useEffect(() => {
    const loadEnding = async () => {
      setIsLoading(true);
      try {
        const { ending: endingData, error: endingError } = await getEndingByMoralScore(moralScore);
        
        if (endingError) {
          throw new Error(endingError.message);
        }
        
        if (!endingData) {
          // Fin par défaut si aucune fin spécifique n'est trouvée
          setEnding({
            title: 'Une fin inattendue',
            description: 'Votre parcours dans le village s\'achève, laissant derrière vous une trace indélébile. Vos choix ont façonné votre destinée, pour le meilleur ou pour le pire.',
            moral_range: 'neutre'
          });
        } else {
          setEnding(endingData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEnding();
  }, [moralScore]);
  
  // Gérer la réinitialisation du jeu
  const handleRestart = () => {
    resetGame();
    navigate('/village');
  };
  
  // Obtenir une couleur en fonction de la plage morale
  const getEndingColor = () => {
    if (!ending) return 'text-white';
    
    switch (ending.moral_range) {
      case 'vertueux':
        return 'text-moral-high';
      case 'corrompu':
        return 'text-moral-low';
      case 'neutre':
      default:
        return 'text-purple-400';
    }
  };
  
  // Générer un résumé des choix
  const generateChoicesSummary = () => {
    if (!choices || choices.length === 0) return 'Vous n\'avez fait aucun choix.';
    
    const positiveChoices = choices.filter(c => c.moral_impact > 0).length;
    const negativeChoices = choices.filter(c => c.moral_impact < 0).length;
    const neutralChoices = choices.filter(c => c.moral_impact === 0).length;
    
    return `Vous avez fait ${positiveChoices} choix vertueux, ${negativeChoices} choix corrompus et ${neutralChoices} choix neutres.`;
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
          <p className="text-gray-400">Détermination de votre destinée...</p>
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

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-medieval mb-8">
          <span className={getEndingColor()}>Votre Destinée</span>
        </h1>
        
        <div className="card mb-8">
          {ending && (
            <>
              <h2 className="text-2xl font-medieval mb-6">{ending.title}</h2>
              
              <div className="mb-8">
                <div className="w-24 h-1 bg-gray-600 mx-auto mb-8"></div>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-lg font-handwritten">
                  {ending.description}
                </p>
                
                <div className="w-24 h-1 bg-gray-600 mx-auto mt-8"></div>
              </div>
              
              <div className="mb-8 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <h3 className="font-medieval mb-2">Votre bilan moral</h3>
                <p className="text-sm">{generateChoicesSummary()}</p>
                <p className="mt-2 font-medium">Score final: {moralScore}</p>
              </div>
            </>
          )}
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleRestart}
              className="btn btn-primary"
            >
              Recommencer l'aventure
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>
            Inspiré par <em>The Village</em> de Mark Baker (1993)
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EndingPage;
