import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import { signOut } from '../../lib/supabase/client';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 bg-opacity-80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-medieval text-white flex items-center">
            <img src="/images/logo.svg" alt="MoralChoice" className="h-8 mr-2" />
            <span className="sr-only">MoralChoice</span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <Home size={18} className="mr-1" /> Accueil
            </Link>
            
            {user && (
              <>
                <Link to="/village" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Map size={18} className="mr-1" /> Village
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <User size={18} className="mr-1" /> Profil
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <LogOut size={18} className="mr-1" /> Déconnexion
                </button>
              </>
            )}
            
            {!user && (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-sin-pride text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </nav>

          {/* Bouton menu mobile */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-gray-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-colors py-2 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} className="mr-2" /> Accueil
              </Link>
              
              {user && (
                <>
                  <Link 
                    to="/village" 
                    className="text-gray-300 hover:text-white transition-colors py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Map size={18} className="mr-2" /> Village
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-300 hover:text-white transition-colors py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} className="mr-2" /> Profil
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-white transition-colors py-2 flex items-center w-full text-left"
                  >
                    <LogOut size={18} className="mr-2" /> Déconnexion
                  </button>
                </>
              )}
              
              {!user && (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-sin-pride text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
