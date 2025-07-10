import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { signUp } from '../lib/supabase/client';
import useStore from '../store/useStore';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: authData, error: authError } = await signUp(data.email, data.password);
      
      if (authError) {
        throw new Error(authError.message || 'Erreur lors de l\'inscription');
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
      <h1 className="text-3xl font-medieval text-center mb-6">Inscription</h1>
      
      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-700 text-white p-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            className="input w-full"
            {...register('username', { 
              required: 'Le nom d\'utilisateur est requis',
              minLength: {
                value: 3,
                message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
              }
            })}
          />
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>
        
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
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="input w-full"
            {...register('confirmPassword', { 
              required: 'Veuillez confirmer votre mot de passe',
              validate: value => value === password || 'Les mots de passe ne correspondent pas'
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-sin-pride hover:underline">
            Se connecter
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

export default RegisterPage;
