"use client";

import {
  authSetEmail,
  authSetPassword,
  authLogout,
  authResetError,
  authSetName,
  fetchUserByCredentials,
  registerUser,
  authClearSuccessMessage,
  authSetUserFromSession,
} from "@/lib/features/authSlice";
import { User, X, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Toast Message
function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded shadow-lg text-white text-center transition-all duration-300
        ${type === "success" ? "bg-pine" : "bg-red-600"}`}
      role="alert">
      {message}
      <button
        className="ml-4 text-white/80 hover:text-white font-bold"
        onClick={onClose}
        aria-label="Fermer le toast">
        ×
      </button>
    </div>
  );
}

// Main function
export default function Login() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [modal, setModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [profileModal, setProfileModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const toastTimeout = useRef();
  const modalRef = useRef(null);
  const profileRef = useRef(null);

  const handleModal = () => {
    setModal(true);
  };

  // If user is connected, close modal and redirect if needed
  useEffect(() => {
    if (auth.user.isConnected || session) {
      setModal(false);

      if (redirect) {
        router.push(redirect);
      }
    }
  }, [auth.user.isConnected, session, redirect, router]);

  // Close modal if clicked outside of its body
  useEffect(() => {
    if (!modal) return;
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModal(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [modal]);

  // Close profile dropdown if clicked outside
  useEffect(() => {
    if (!profileModal) return;
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileModal(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [profileModal]);

  // Display welcome toast when user has succesfully connected
  useEffect(() => {
    if (session?.user) {
      // Update Redux store with session user info
      dispatch(authSetUserFromSession(session.user));

      setToast({
        show: true,
        message: `Bienvenue, ${session.user.name || session.user.username}`,
        type: "success",
      });
      toastTimeout.current = setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        3000
      );
    } else if (auth.user.isConnected) {
      setToast({
        show: true,
        message: `Bienvenue, ${auth.user.name}`,
        type: "success",
      });
      toastTimeout.current = setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        3000
      );
    }
    return () => clearTimeout(toastTimeout.current);
  }, [session?.user, auth.user.isConnected, dispatch]);

  // Display success messages as toasts
  useEffect(() => {
    if (auth.successMessage) {
      setToast({
        show: true,
        message: auth.successMessage,
        type: "success",
      });
      toastTimeout.current = setTimeout(() => {
        setToast((t) => ({ ...t, show: false }));
        dispatch(authClearSuccessMessage());
      }, 3000);
    }
    return () => clearTimeout(toastTimeout.current);
  }, [auth.successMessage, dispatch]);

  // Display error toast
  useEffect(() => {
    if (auth.isError && (auth.error.login || auth.error.register)) {
      setToast({
        show: true,
        message: auth.error.login || auth.error.register,
        type: "error",
      });
      toastTimeout.current = setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        3000
      );
    }
    return () => clearTimeout(toastTimeout.current);
  }, [auth.isError, auth.error.login, auth.error.register]);

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
        fetchUserByCredentials({
          email: auth.setEmail,
          password: auth.setPassword,
        })
      );
    } else {
      // Register
      await dispatch(
        registerUser({
          name: auth.setName,
          email: auth.setEmail,
          password: auth.setPassword,
        })
      );
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: redirect || window.location.pathname });
  };

  // If user is authenticated with NextAuth (Google)
  if (session?.user) {
    return (
      <>
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((t) => ({ ...t, show: false }))}
          />
        )}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center text-slate-300 hover:text-pine hover:bg-midnight p-2 rounded-full transition-all duration-200 cursor-pointer"
            onClick={() => setProfileModal(!profileModal)}>
            {/* Profile Picture */}
            {session.user.avatar_url ? (
              <Image
                src={session.user.avatar_url}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full mr-2 border-2 border-pine"
              />
            ) : (
              <User size={20} className="mr-2" />
            )}

            {/* Username */}
            <span className="font-bold text-rosy">
              {session.user.username || session.user.name}
            </span>
          </div>

          {/* Profile Dropdown */}
          {profileModal && (
            <div className="absolute top-12 right-0 bg-midnight border border-slate-700 rounded-lg shadow-lg p-2 min-w-48 z-50">
              <div className="flex items-center p-2 border-b border-slate-700 mb-2">
                {session.user.avatar_url ? (
                  <Image
                    src={session.user.avatar_url}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                ) : (
                  <User size={20} className="mr-3" />
                )}
                <div>
                  <p className="font-bold text-white">{session.user.name}</p>
                  <p className="text-sm text-gray-400">
                    @{session.user.username}
                  </p>
                </div>
              </div>
              <ul className="space-y-1 text-white">
                <Link href="/profile">
                  <li className="cursor-pointer px-2 py-1 hover:bg-pine rounded text-sm transition-all duration-100">
                    Mon Profil
                  </li>
                </Link>
                <Link href="/library">
                  <li className="cursor-pointer px-2 py-1 hover:bg-pine rounded text-sm transition-all duration-100">
                    Ma Bibliothèque
                  </li>
                </Link>
                <li
                  className="cursor-pointer px-2 py-1 hover:bg-pine rounded text-sm text-red-400 hover:text-red-300 font-bold transition-all duration-100"
                  onClick={() => {
                    signOut();
                    setProfileModal(false);
                  }}>
                  Déconnexion
                </li>
              </ul>
            </div>
          )}
        </div>
      </>
    );
  }

  // If user is authenticated with email/password
  if (auth.user.isConnected) {
    return (
      <>
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((t) => ({ ...t, show: false }))}
          />
        )}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center text-slate-300 hover:text-pine hover:bg-midnight p-2 rounded-full transition-all duration-200 cursor-pointer"
            onClick={() => setProfileModal(!profileModal)}>
            {/* Profile Icon */}
            <User
              size={20}
              className="rounded-full mr-2 border-2 border-pine"
            />

            {/* Username */}
            <span className="font-bold text-rosy">{auth.user.name}</span>
          </div>

          {/* Profile Dropdown */}
          {profileModal && (
            <div className="absolute top-12 right-0 bg-midnight border border-slate-700 rounded-lg shadow-lg p-2 min-w-48 z-50">
              <div className="flex items-center p-2 border-b border-slate-700 mb-2">
                <User size={20} className="mr-3 text-white" />
                <div>
                  <p className="font-bold text-white">{auth.user.name}</p>
                  <p className="text-sm text-white/60">{auth.user.mail}</p>
                </div>
              </div>
              <ul className="space-y-1 text-white">
                <Link href="/profile">
                  <li className="cursor-pointer px-2 py-1 hover:bg-pine rounded text-sm transition-all duration-100">
                    Mon Profil
                  </li>
                </Link>
                <Link href="/library">
                  <li className="cursor-pointer px-2 py-1 hover:bg-pine rounded text-sm transition-all duration-100">
                    Ma Bibliothèque
                  </li>
                </Link>
                <li
                  className="cursor-pointer px-2 py-1 hover:bg-pine rounded text-sm text-red-400 hover:text-red-300 font-bold transition-all duration-100"
                  onClick={() => {
                    dispatch(authLogout());
                    setProfileModal(false);
                  }}>
                  Déconnexion
                </li>
              </ul>
            </div>
          )}
        </div>
      </>
    );
  }

  // If user is not authenticated
  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
        />
      )}
      <button className="text-slate-300 hover:text-pine hover:bg-rosy p-2 rounded-full transition-all duration-200 cursor-pointer">
        <User size={20} onClick={handleModal} />
      </button>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4  mt-100">
          <div
            className="bg-midnight text-ivory w-full max-w-md rounded-2xl shadow-2xl transform transition-all animate-fadeIn"
            ref={modalRef}>
            {/* Header */}
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {isLogin ? "Connexion" : "Créer un compte"}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="text-slate-400 hover:text-ivory p-1 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
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
                        value={auth.setName}
                        autoComplete="username"
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
                      value={auth.setEmail}
                      autoComplete="email"
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
                      value={auth.setPassword}
                      autoComplete="current-password"
                      onChange={(e) =>
                        dispatch(authSetPassword(e.target.value))
                      }
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
                {auth.isError && (
                  <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 flex items-start gap-3">
                    <AlertCircle
                      size={18}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-red-400 text-sm">
                      {isLogin ? auth.error.login : auth.error.register}
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={auth.isLoading}
                  className="w-full bg-pine hover:bg-moss text-ivory py-3 rounded-lg font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {auth.isLoading ? (
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
      )}
    </>
  );
}
