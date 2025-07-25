"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCredits } from "@/lib/features/authSlice";
import { X, CreditCard, AlertCircle, CheckCircle } from "lucide-react";

export default function AddCreditsModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(e) {
      if (isOpen && e.target.classList.contains("modal-overlay")) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) {
      setError("Veuillez entrer un montant valide supérieur à 0");
      return;
    }

    if (numAmount > 10000) {
      setError("Montant maximum : 10,000 €");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await dispatch(
        addCredits({ userId: user.id, amount: numAmount })
      ).unwrap();
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error || "Erreur lors de l'ajout de crédits");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value);
      setError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 border border-neutral-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-pine rounded-lg p-2">
              <CreditCard size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Ajouter des crédits
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Current Balance */}
        <div className="bg-neutral-700/50 rounded-lg p-4 mb-6">
          <p className="text-neutral-400 text-sm mb-1">Solde actuel</p>
          <p className="text-2xl font-bold text-white">
            {(user.creditBalance || 0).toFixed(2)} €
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-neutral-300 mb-2">
              Montant à ajouter (€)
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent"
              disabled={isSubmitting}
            />
            <p className="text-xs text-neutral-500 mt-1">
              Maximum: 10,000.00 €
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-sm">
                Crédits ajoutés avec succès !
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
              disabled={isSubmitting}>
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              className="flex-1 px-4 py-3 bg-pine text-white rounded-lg hover:bg-pine/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Ajout en cours..." : "Ajouter des crédits"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
