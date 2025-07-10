import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const HomePage = () => {
  const user = useStore(state => state.user);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <motion.div
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-medieval mb-6 text-white"
          variants={itemVariants}
        >
          <span className="text-sin-pride">M</span>oral<span className="text-sin-wrath">C</span>hoice
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-8 text-gray-300"
          variants={itemVariants}
        >
          Explorez un village où chaque décision révèle votre véritable nature
        </motion.p>
        
        <motion.div 
          className="mb-12 text-gray-400 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <p>
            Inspiré par le court-métrage <em>The Village</em> de Mark Baker, MoralChoice vous place face aux sept péchés capitaux dans un village isolé où vos choix détermineront votre destinée morale.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          {user ? (
            <Link 
              to="/village" 
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Entrer dans le village
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className="btn btn-primary px-8 py-3 text-lg"
              >
                Commencer l'aventure
              </Link>
              <Link 
                to="/login" 
                className="btn btn-secondary px-8 py-3 text-lg"
              >
                Continuer votre quête
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>
      
      {/* Section des 7 péchés */}
      <motion.div
        className="mt-20 w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <h2 className="text-2xl font-medieval mb-8 text-white">Les sept péchés vous attendent...</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: 'Orgueil', color: 'bg-sin-pride' },
            { name: 'Envie', color: 'bg-sin-envy' },
            { name: 'Colère', color: 'bg-sin-wrath' },
            { name: 'Paresse', color: 'bg-sin-sloth' },
            { name: 'Avarice', color: 'bg-sin-greed' },
            { name: 'Gourmandise', color: 'bg-sin-gluttony' },
            { name: 'Luxure', color: 'bg-sin-lust' }
          ].map((sin, index) => (
            <div 
              key={sin.name}
              className={`aspect-square flex items-center justify-center rounded-lg card sin-pulse ${sin.color} bg-opacity-20 hover:bg-opacity-30 transition-all`}
            >
              <span className={`text-xl font-medieval ${sin.color.replace('bg-', 'text-')}`}>
                {sin.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
