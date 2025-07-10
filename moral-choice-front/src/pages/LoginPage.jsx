import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { signIn } from '../lib/supabase/client';
import useStore from '../store/useStore';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: authData, error: authError } = await signIn(data.email, data.password);
      
      if (authError) {
        throw new Error(authError.message || 'Erreur lors de la connexion');
      }
      
      setUser(authData.user);
      navigate('/village');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="card w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-medieval text-center mb-6">Connexion</h1>
      
      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-700 text-white p-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input w-full"
            {...register('email', { 
              required: 'L\'email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Adresse email invalide'
              }
            })}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            className="input w-full"
            {...register('password', { 
              required: 'Le mot de passe est requis',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
              }
            })}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-sin-pride hover:underline">
            S'inscrire
          </Link>
        </p>
        
        <p className="mt-2 text-sm text-gray-500">
          <Link to="/" className="hover:underline">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
