"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Trash2, ShoppingBag, ShoppingCart, Tag } from "lucide-react";
import { removeFromCart, addToCart } from "@/lib/features/gameDetailsSlice";
import {
  selectCartItems,
  selectOriginalPrices,
  selectDiscountedPrices,
  selectCouponDiscount,
  selectSubtotal,
  selectTotal,
  selectIsCouponApplicable,
} from "@/lib/features/cartSlice";
import GamePrice from "@/components/GamePrice";
import Link from "next/link";

export default function CartModal({ isOpen, onClose }) {
  const cartItems = useSelector(selectCartItems);
  const originalPrices = useSelector(selectOriginalPrices);
  const discountedPrices = useSelector(selectDiscountedPrices);
  const couponDiscount = useSelector(selectCouponDiscount);
  const subtotal = useSelector(selectSubtotal);
  const total = useSelector(selectTotal);
  const isCouponApplicable = useSelector(selectIsCouponApplicable);

  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const [addingGameId, setAddingGameId] = useState(null);
  const [removingGameId, setRemovingGameId] = useState(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Check if a game is in the cart
  const isInCart = (gameId) => {
    return cartItems.some((item) => item.id === gameId);
  };

  // Handle adding item to cart
  const handleAddToCart = async (game) => {
    try {
      setAddingGameId(game.id);
      await dispatch(addToCart(game)).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingGameId(null);
    }
  };

  // Handle removing item from cart
  const handleRemoveFromCart = async (gameId) => {
    try {
      setRemovingGameId(gameId);
      await dispatch(removeFromCart(gameId)).unwrap();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    } finally {
      setRemovingGameId(null);
    }
  };

  // Helper to generate price based on item ID
  const generatePrice = (itemId) => {
    const originalPrice = originalPrices[itemId] || 0;
    const discountedPrice = discountedPrices[itemId] || 0;
    return discountedPrice === 0 ? originalPrice : discountedPrice;
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - Full screen on mobile, semi-transparent overlay on desktop */}
      <div className="fixed inset-0 bg-midnight/50 z-50 transition" />

      {/* Modal - Full screen on mobile, lateral on desktop */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-slate-900 transition-all duration-200 ease-in-out
                   w-full sm:max-w-md shadow-lg transform ${
                     isOpen ? "translate-x-0" : "translate-x-full"
                   }`}
        ref={modalRef}>
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-ivory flex items-center">
            <ShoppingBag className="mr-2 text-pine w-5 h-5 sm:w-6 sm:h-6" /> Mon
            Panier
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-ivory p-1 rounded-full">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Body - Cart Items */}
        <div className="p-3 sm:p-4 overflow-y-auto h-[calc(100%-8rem)] sm:h-[calc(100%-12rem)]">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-ivory">
              <ShoppingBag className="mx-auto mb-4 opacity-30 w-12 h-12 sm:w-16 sm:h-16" />
              <p className="text-sm sm:text-base mb-4">Votre panier est vide</p>
              <Link href="/games">
                <button
                  onClick={onClose}
                  className="bg-rosy text-ivory px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-plum transition-colors text-sm sm:text-base">
                  Voir les jeux
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 sm:gap-4 bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative rounded overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-white text-sm sm:text-base mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mb-2">
                      {item.genre}
                    </p>
                    <div className="flex items-center justify-between">
                      <GamePrice
                        game={item}
                        gameId={item.id}
                        size="small"
                        showDiscountBadge={false}
                        className="text-rosy"
                      />
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-full transition-colors">
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Total and Checkout */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-slate-900 border-t border-slate-700">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <span className="text-slate-300 text-sm sm:text-base">
                Total:
              </span>
              <span className="text-white font-bold text-lg sm:text-xl">
                ${total.toFixed(2)}
              </span>
            </div>
            <Link href="/checkout" className="block">
              <button
                onClick={onClose}
                className="w-full bg-pine hover:bg-moss text-white font-medium py-2 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base">
                Aller au checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
