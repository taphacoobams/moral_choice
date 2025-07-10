import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-village-dark">
      {/* En-tête simple pour les pages d'authentification */}
      <header className="py-4 px-6 bg-gray-900 bg-opacity-80">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-medieval text-white">
            MoralChoice
          </Link>
        </div>
      </header>
      
      {/* Contenu principal avec animation */}
      <motion.main 
        className="flex-grow flex items-center justify-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </motion.main>
      
      {/* Pied de page simple */}
      <footer className="py-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} MoralChoice - Inspiré par The Village de Mark Baker</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
