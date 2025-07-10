import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MoralMeter from '../ui/MoralMeter';
import useStore from '../../store/useStore';

const MainLayout = () => {
  const user = useStore(state => state.user);
  const moralScore = useStore(state => state.moralScore);

  return (
    <div className="flex flex-col min-h-screen bg-village-dark">
      <Navbar />
      
      {/* Contenu principal avec animation */}
      <motion.main 
        className="flex-grow container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Afficher la jauge morale uniquement si l'utilisateur est connecté */}
        {user && (
          <div className="mb-6">
            <MoralMeter score={moralScore} />
          </div>
        )}
        
        <Outlet />
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
