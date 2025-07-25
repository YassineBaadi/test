"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {
  X,
  User,
  Lock,
  Mail,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
  authSetEmail,
  authSetPassword,
  authSetName,
  authResetError,
  fetchUserByCredentials,
  registerUser,
} from "@/lib/features/authSlice";

export default function AuthModal({ isOpen, onClose, redirectPath }) {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { user, setEmail, setPassword, setName, isError, error, isLoading } =
    useSelector((state) => state.auth);

  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // If authenticated, close modal and redirect
  useEffect(() => {
    if (user.isConnected || session) {
      onClose();
      if (redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [user.isConnected, session, router, redirectPath, onClose]);

  // Reset error when switching modes
  useEffect(() => {
    dispatch(authResetError());
  }, [isLogin, dispatch]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authResetError());

    if (isLogin) {
      // Login
      await dispatch(
        fetchUserByCredentials({ email: setEmail, password: setPassword })
      );
    } else {
      // Register
      await dispatch(
        registerUser({ name: setName, email: setEmail, password: setPassword })
      );
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: redirectPath || window.location.pathname });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div
        className="bg-midnight text-ivory w-full max-w-md rounded-2xl shadow-2xl transform transition-all animate-fadeIn"
        ref={modalRef}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isLogin ? "Connexion Requise" : "Créer un compte"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-ivory p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Message */}
          <div className="mb-6">
            <p className="text-lg text-ivory/80">
              {isLogin
                ? "Veuillez vous connecter pour accéder à cette page."
                : "Créez un compte pour accéder à toutes les fonctionnalités."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="group">
                <label className="block text-sm font-medium text-ivory/70 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-ivory/50" />
                  </div>
                  <input
                    type="text"
                    value={setName}
                    onChange={(e) => dispatch(authSetName(e.target.value))}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800 text-ivory placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent"
                    placeholder="Entrez votre nom d'utilisateur"
                    required
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label className="block text-sm font-medium text-ivory/70 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-ivory/50" />
                </div>
                <input
                  type="email"
                  value={setEmail}
                  onChange={(e) => dispatch(authSetEmail(e.target.value))}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800 text-ivory placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent"
                  placeholder="Entrez votre email"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-ivory/70 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-ivory/50" />
                </div>
                <input
                  type="password"
                  value={setPassword}
                  onChange={(e) => dispatch(authSetPassword(e.target.value))}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800 text-ivory placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent"
                  placeholder={
                    isLogin
                      ? "Entrez votre mot de passe"
                      : "Créez un mot de passe"
                  }
                  required
                />
              </div>
            </div>

            {/* Error message */}
            {isError && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="text-red-500 mt-0.5 flex-shrink-0"
                />
                <p className="text-red-400 text-sm">
                  {isLogin ? error.login : error.register}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pine hover:bg-moss text-ivory py-3 rounded-lg font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin"></div>
                  {isLogin
                    ? "Connexion en cours..."
                    : "Inscription en cours..."}
                </>
              ) : (
                <>
                  {isLogin ? "Se connecter" : "S'inscrire"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-slate-700"></div>
            <p className="mx-4 text-sm text-ivory/50">ou</p>
            <div className="flex-grow h-px bg-slate-700"></div>
          </div>

          {/* Social login */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-800 hover:bg-gray-100 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
            Continuer avec Google
          </button>

          {/* Switch between login and register */}
          <div className="mt-6 text-center">
            <p className="text-ivory/60">
              {isLogin ? "Pas encore inscrit ?" : "Déjà inscrit ?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-pine hover:text-moss font-medium">
                {isLogin ? "Créer un compte" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
