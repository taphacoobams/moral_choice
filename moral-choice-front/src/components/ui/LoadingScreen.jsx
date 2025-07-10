import { motion } from 'framer-motion';

const LoadingScreen = () => {
  // Animation pour les cercles de chargement
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const circleVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -15, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-village-dark flex flex-col items-center justify-center z-50">
      <h2 className="text-3xl font-medieval text-white mb-8">MoralChoice</h2>
      
      <motion.div 
        className="flex space-x-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Cercles représentant les 7 péchés capitaux */}
        <motion.div variants={circleVariants} className="w-4 h-4 rounded-full bg-sin-pride" />
        <motion.div variants={circleVariants} className="w-4 h-4 rounded-full bg-sin-envy" />
        <motion.div variants={circleVariants} className="w-4 h-4 rounded-full bg-sin-wrath" />
        <motion.div variants={circleVariants} className="w-4 h-4 rounded-full bg-sin-sloth" />
        <motion.div variants={circleVariants} className="w-4 h-4 rounded-full bg-sin-greed" />
        <motion.div variants={circleVariants} className="w-4 h-4 rounded-full bg-sin-gluttony" />
        <motion.div variants={circleVariants} className="w-4 h-4 rounded-full bg-sin-lust" />
      </motion.div>
      
      <p className="mt-8 text-gray-400 text-sm">Chargement de votre destinée...</p>
    </div>
  );
};

export default LoadingScreen;
