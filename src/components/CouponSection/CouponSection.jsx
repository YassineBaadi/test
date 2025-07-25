"use client";

import React, { useState } from "react";
import {
  Ticket,
  ShoppingBag,
  Gift,
  Sparkles,
  TrendingUp,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCartItems } from "@/lib/features/cartSlice";
import { calculateCouponDiscount } from "@/lib/features/couponSlice";

export default function CouponSection({ variant = "floating" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cartItems = useSelector(selectCartItems);

  // Calculate coupon discount - returns { isApplicable, cheapestGame, discountAmount }
  const couponInfo = calculateCouponDiscount(cartItems);

  const progressPercentage = Math.min((cartItems.length / 5) * 100, 100);
  const isQualified = cartItems.length >= 5;
  const remaining = Math.max(5 - cartItems.length, 0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Inline variant for games page
  if (variant === "inline") {
    return (
      <div className="bg-midnight/70 backdrop-blur-md p-4 rounded-xl border border-ivory/10 shadow-lg hover-lift">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="bg-gradient-to-br from-rosy to-plum p-2 rounded-lg shadow-md">
              <Gift className="text-white" size={18} />
            </div>
            {isQualified && (
              <div className="absolute -top-1 -right-1 bg-moss rounded-full p-0.5 shadow-md">
                <CheckCircle className="text-white" size={10} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-ivory flex items-center gap-2">
              Offre spéciale
              <Sparkles className="text-amber-400" size={14} />
            </h3>
            <p className="text-ivory/80 text-sm">
              5 jeux = 1 <span className="font-bold text-moss">GRATUIT</span>
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          {/* Progress Info */}
          <div className="flex items-center justify-between">
            <span className="text-ivory/80 text-sm font-medium">
              Progression
            </span>
            <span className="text-ivory font-bold text-sm">
              {cartItems.length}/5
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-midnight/60 rounded-full h-2 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isQualified
                    ? "bg-gradient-to-r from-moss to-pine"
                    : "bg-gradient-to-r from-rosy to-plum"
                }`}
                style={{ width: `${progressPercentage}%` }}>
                {isQualified && (
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="text-white" size={8} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  cartItems.length >= step
                    ? "bg-moss text-white shadow-md"
                    : "bg-midnight/60 text-ivory/60 border border-ivory/20"
                }`}>
                {cartItems.length >= step ? <CheckCircle size={10} /> : step}
              </div>
            ))}
          </div>

          {/* Status Section */}
          <div
            className={`p-3 rounded-lg border transition-all duration-500 ${
              isQualified
                ? "bg-gradient-to-br from-moss/20 to-pine/30 border-moss/30"
                : "bg-midnight/40 border-ivory/20"
            }`}>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`p-1.5 rounded-lg ${
                  isQualified ? "bg-moss/20" : "bg-rosy/20"
                }`}>
                {isQualified ? (
                  <CheckCircle className="text-moss" size={14} />
                ) : (
                  <TrendingUp className="text-rosy" size={14} />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-bold text-sm ${
                    isQualified ? "text-moss" : "text-ivory"
                  }`}>
                  {isQualified ? "Coupon Activé!" : "Presque là!"}
                </h4>
                <p className="text-ivory/70 text-xs">
                  {isQualified
                    ? "Réduction appliquée"
                    : `${remaining} jeu${remaining > 1 ? "x" : ""} restant${
                        remaining > 1 ? "s" : ""
                      }`}
                </p>
              </div>
            </div>

            {isQualified ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-1.5 bg-midnight/40 rounded text-xs">
                  <span className="text-ivory/80">Jeu gratuit:</span>
                  <span className="font-bold text-moss truncate ml-2 max-w-[100px]">
                    {couponInfo.cheapestGame?.title}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-midnight/40 rounded text-xs">
                  <span className="text-ivory/80">Économies:</span>
                  <div className="flex items-center gap-1">
                    <span className="line-through text-ivory/50">
                      {couponInfo.cheapestGame?.price}€
                    </span>
                    <span className="bg-moss/20 text-moss font-bold px-1 py-0.5 rounded text-xs">
                      GRATUIT
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-midnight/40 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-2 text-ivory/60">
                    <ShoppingBag size={12} />
                    <span className="text-xs">
                      Ajoutez {remaining} jeu{remaining > 1 ? "x" : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-ivory/10">
            <div className="flex flex-col gap-1 text-xs text-ivory/60">
              <div className="flex items-center gap-2">
                <Ticket size={10} />
                <span>Offre valable sur tous les jeux</span>
              </div>
              <div className="text-center">
                <span>Réduction automatique • Pas de code requis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Floating variant (default) for other pages
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed Version - Small floating button */}
      {!isExpanded && (
        <div
          onClick={toggleExpand}
          className="cursor-pointer bg-gradient-to-br from-rosy to-plum p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce">
          <div className="relative">
            <Gift className="text-white" size={24} />
            {isQualified && (
              <div className="absolute -top-2 -right-2 bg-moss rounded-full p-0.5 shadow-md">
                <CheckCircle className="text-white" size={14} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expanded Version */}
      {isExpanded && (
        <div className="relative overflow-hidden max-w-xs">
          {/* Compact background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 -left-20 w-40 h-40 bg-rosy rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-moss rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative bg-midnight/90 backdrop-blur-md rounded-xl border border-ivory/20 shadow-lg">
            {/* Close button */}
            <button
              onClick={toggleExpand}
              className="absolute top-2 right-2 text-ivory/60 hover:text-ivory p-1 rounded-full hover:bg-midnight/50 transition-colors">
              <X size={16} />
            </button>

            {/* Compact Header */}
            <div className="p-4 border-b border-ivory/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-gradient-to-br from-rosy to-plum p-3 rounded-xl shadow-md">
                    <Gift className="text-white" size={20} />
                  </div>
                  {isQualified && (
                    <div className="absolute -top-1 -right-1 bg-moss rounded-full p-0.5 shadow-md">
                      <CheckCircle className="text-white" size={12} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ivory flex items-center gap-2">
                    Offre spéciale
                    <Sparkles className="text-amber-400" size={16} />
                  </h3>
                  <p className="text-ivory/80 text-sm">
                    5 jeux = 1{" "}
                    <span className="font-bold text-moss">GRATUIT</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Compact Progress Section */}
            <div className="p-4 space-y-4">
              {/* Progress Info */}
              <div className="flex items-center justify-between">
                <span className="text-ivory/80 text-sm font-medium">
                  Progression
                </span>
                <span className="text-ivory font-bold text-sm">
                  {cartItems.length}/5
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-midnight/60 rounded-full h-3 shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isQualified
                        ? "bg-gradient-to-r from-moss to-pine"
                        : "bg-gradient-to-r from-rosy to-plum"
                    }`}
                    style={{ width: `${progressPercentage}%` }}>
                    {isQualified && (
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="text-white" size={10} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Steps - Compact */}
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      cartItems.length >= step
                        ? "bg-moss text-white shadow-md"
                        : "bg-midnight/60 text-ivory/60 border border-ivory/20"
                    }`}>
                    {cartItems.length >= step ? (
                      <CheckCircle size={12} />
                    ) : (
                      step
                    )}
                  </div>
                ))}
              </div>

              {/* Status Section */}
              <div
                className={`p-4 rounded-lg border transition-all duration-500 ${
                  isQualified
                    ? "bg-gradient-to-br from-moss/20 to-pine/30 border-moss/30"
                    : "bg-midnight/40 border-ivory/20"
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isQualified ? "bg-moss/20" : "bg-rosy/20"
                    }`}>
                    {isQualified ? (
                      <CheckCircle className="text-moss" size={16} />
                    ) : (
                      <TrendingUp className="text-rosy" size={16} />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4
                      className={`font-bold text-sm ${
                        isQualified ? "text-moss" : "text-ivory"
                      }`}>
                      {isQualified ? "Coupon Activé!" : "Presque là!"}
                    </h4>
                    <p className="text-ivory/70 text-xs">
                      {isQualified
                        ? "Réduction appliquée"
                        : `${remaining} jeu${remaining > 1 ? "x" : ""} restant${
                            remaining > 1 ? "s" : ""
                          }`}
                    </p>
                  </div>
                </div>

                {isQualified ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-midnight/40 rounded text-xs">
                      <span className="text-ivory/80">Jeu gratuit:</span>
                      <span className="font-bold text-moss truncate ml-2 max-w-[120px]">
                        {couponInfo.cheapestGame?.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-midnight/40 rounded text-xs">
                      <span className="text-ivory/80">Économies:</span>
                      <div className="flex items-center gap-1">
                        <span className="line-through text-ivory/50">
                          {couponInfo.cheapestGame?.price}€
                        </span>
                        <span className="bg-moss/20 text-moss font-bold px-1 py-0.5 rounded text-xs">
                          GRATUIT
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-midnight/40 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-2 text-ivory/60">
                        <ShoppingBag size={14} />
                        <span className="text-xs">
                          Ajoutez {remaining} jeu{remaining > 1 ? "x" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Compact Footer */}
            <div className="px-4 py-3 bg-midnight/40 border-t border-ivory/10">
              <div className="flex flex-col gap-2 text-xs text-ivory/60">
                <div className="flex items-center gap-2">
                  <Ticket size={12} />
                  <span>Offre valable sur tous les jeux</span>
                </div>
                <div className="text-center">
                  <span>Réduction automatique • Pas de code requis</span>
                </div>
              </div>
            </div>

            {/* Collapse button */}
            <button
              onClick={toggleExpand}
              className="w-full flex items-center justify-center py-2 text-ivory/60 hover:text-ivory hover:bg-midnight/50 transition-colors">
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
