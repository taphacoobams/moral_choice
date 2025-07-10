import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const MoralMeter = ({ score }) => {
  // Normaliser le score entre 0 et 100 (le score original est entre -100 et 100)
  const normalizedScore = ((score + 100) / 2);
  
  // Déterminer la couleur en fonction du score
  const getColor = () => {
    if (score > 50) return 'bg-moral-high';
    if (score < -50) return 'bg-moral-low';
    
    // Dégradé pour les scores intermédiaires
    return 'bg-gradient-to-r from-moral-low via-yellow-500 to-moral-high';
  };

  // Déterminer le message en fonction du score
  const getMessage = () => {
    if (score > 75) return 'Vertueux';
    if (score > 25) return 'Honorable';
    if (score > -25) return 'Neutre';
    if (score > -75) return 'Douteux';
    return 'Corrompu';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm">
        <span className="text-moral-low font-medium">Corruption</span>
        <span className="text-moral-high font-medium">Vertu</span>
      </div>
      
      <div className="moral-meter">
        <motion.div 
          className={`moral-meter-fill ${getColor()}`}
          initial={{ width: '50%' }}
          animate={{ width: `${normalizedScore}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      
      <div className="mt-1 text-center">
        <span className="text-sm font-medieval">{getMessage()} ({score})</span>
      </div>
    </div>
  );
};

MoralMeter.propTypes = {
  score: PropTypes.number.isRequired
};

export default MoralMeter;
