import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useStore from './store/useStore';
import './App.css';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages - Chargement paresseux pour optimiser les performances
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const VillagePage = lazy(() => import('./pages/VillagePage'));
const ScenarioPage = lazy(() => import('./pages/ScenarioPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EndingPage = lazy(() => import('./pages/EndingPage'));

// Composant de chargement
import LoadingScreen from './components/ui/LoadingScreen';

// Route protégée qui vérifie si l'utilisateur est connecté
const ProtectedRoute = ({ children }) => {
  const user = useStore(state => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const initializeUser = useStore(state => state.initializeUser);
  const isLoading = useStore(state => state.isLoading);

  // Vérifier l'authentification de l'utilisateur au chargement
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
            </Route>
            
            {/* Routes d'authentification */}
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            
            {/* Routes protégées */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="village" element={<VillagePage />} />
              <Route path="scenario/:id" element={<ScenarioPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="ending" element={<EndingPage />} />
            </Route>
            
            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
