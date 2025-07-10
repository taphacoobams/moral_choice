import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 bg-opacity-80 py-8 text-gray-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-medieval text-white flex items-center">
              <img src="/images/logo.svg" alt="MoralChoice" className="h-6 mr-2" />
            </Link>
            <p className="mt-2 text-sm">
              Une expérience narrative inspirée par <em>The Village</em> de Mark Baker
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-medieval mb-2">Navigation</h3>
              <ul className="space-y-1">
                <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link to="/village" className="hover:text-white transition-colors">Village</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Profil</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medieval mb-2">Réseaux</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors" aria-label="Github">
                  <Github size={20} />
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="mailto:contact@moralchoice.com" className="hover:text-white transition-colors" aria-label="Email">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} MoralChoice. Tous droits réservés.</p>
          <p className="mt-1">
            <Link to="/privacy" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            {' • '}
            <Link to="/terms" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
