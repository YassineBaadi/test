"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  purchaseGames,
  purchaseGamesWithCredits,
} from "@/lib/features/authSlice";
import {
  setCartItems,
  selectCartItems,
  selectOriginalPrices,
  selectDiscountedPrices,
  selectCouponDiscount,
  selectSubtotal,
  selectTotal,
  selectIsCouponApplicable,
} from "@/lib/features/cartSlice";
import {
  X,
  Check,
  ShoppingCart,
  CreditCard,
  Loader,
  AlertCircle,
  Tag,
} from "lucide-react";
import { apiService } from "@/lib/services/apiService";

export default function Checkout() {
  const { user, isLoading, successMessage } = useSelector(
    (state) => state.auth
  );
  const cartItems = useSelector(selectCartItems);
  const originalPrices = useSelector(selectOriginalPrices);
  const discountedPrices = useSelector(selectDiscountedPrices);
  const couponDiscount = useSelector(selectCouponDiscount);
  const subtotal = useSelector(selectSubtotal);
  const total = useSelector(selectTotal);
  const isCouponApplicable = useSelector(selectIsCouponApplicable);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [fetchingCart, setFetchingCart] = useState(true);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "credits"
  const [checkoutError, setCheckoutError] = useState("");

  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setFetchingCart(true);
        const data = await apiService.getCart();
        dispatch(setCartItems(data));
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setFetchingCart(false);
      }
    };

    fetchCart();
  }, [dispatch]);

  // Check for successful purchase (backup mechanism)
  useEffect(() => {
    if (
      successMessage === "Purchase completed successfully" ||
      successMessage === "Purchase completed successfully with credits"
    ) {
      // Clear Redux cart state as backup
      dispatch(setCartItems([]));
      if (!purchaseComplete) {
        setPurchaseComplete(true);
      }
    }
  }, [successMessage, dispatch, purchaseComplete]);

  // Check if user has sufficient credits
  const hasSufficientCredits = (user.creditBalance || 0) >= total;
  const creditBalance = user.creditBalance || 0;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      // Get the correct user ID - check Redux user first, then fallback to email lookup
      const userId = user.id || (await getUserIdFromEmail());
      if (!userId) {
        throw new Error("Unable to determine user ID for checkout");
      }

      if (paymentMethod === "credits") {
        // Purchase with credits
        await dispatch(purchaseGamesWithCredits({ userId, total })).unwrap();
      } else {
        // Regular purchase
        await dispatch(purchaseGames(userId)).unwrap();
      }

      // Clear cart immediately after successful purchase
      dispatch(setCartItems([]));
      setPurchaseComplete(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      setCheckoutError(error?.message || "Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Helper function to get user ID by email from session
  const getUserIdFromEmail = async () => {
    if (!session?.user?.email) return null;

    try {
      // Query the API to find the user by email
      const response = await fetch(
        `/api/users/lookup?email=${encodeURIComponent(session.user.email)}`
      );
      const data = await response.json();

      if (data.success && data.user) {
        return data.user.id;
      }
      return null;
    } catch (error) {
      console.error("Error looking up user ID:", error);
      return null;
    }
  };

  const handleClearCart = async () => {
    try {
      // Clear cart from server
      for (const item of cartItems) {
        await fetch(`/api/cart/remove?gameId=${item.id}`, {
          method: "DELETE",
        });
      }
      // Clear Redux cart state
      dispatch(setCartItems([]));
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  if (fetchingCart || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center pt-20">
        <div className="flex items-center">
          <Loader className="animate-spin mr-2" />
          <p>Loading checkout information...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute redirectTo="/checkout">
      <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col pt-20 px-6 md:px-10">
        {purchaseComplete ? (
          <div className="max-w-4xl mx-auto w-full bg-neutral-800 rounded-lg p-8 my-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-pine rounded-full p-3">
                <Check size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Achat terminé!</h1>
            <p className="text-neutral-300 mb-6">
              Vos jeux ont été ajoutés à votre bibliothèque.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => router.push("/library")}
                className="px-6 py-3 bg-pine text-white rounded-md hover:bg-pine/90 transition">
                Aller à la bibliothèque
              </button>
              <button
                onClick={() => router.push("/games")}
                className="px-6 py-3 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition">
                Continuer les achats
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="max-w-4xl mx-auto w-full bg-neutral-800 rounded-lg p-8 my-8 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-neutral-400" />
            <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
            <p className="text-neutral-400 mb-6">
              Ajoutez des jeux à votre panier avant de passer à la caisse.
            </p>
            <button
              onClick={() => router.push("/games")}
              className="px-6 py-3 bg-pine text-white rounded-md hover:bg-pine/90 transition">
              Parcourir les jeux
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
              Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="bg-neutral-800 rounded-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-white">
                    <ShoppingCart size={20} className="mr-2" />
                    Cart Items
                  </h2>

                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const originalPrice = originalPrices[item.id] || 0;
                      const discountedPrice = discountedPrices[item.id] || 0;
                      const hasDiscount = originalPrice > discountedPrice;

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center bg-neutral-700/50 p-3 sm:p-4 rounded-md gap-3 sm:gap-4">
                          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 relative rounded overflow-hidden">
                            <img
                              src={
                                item.thumbnail ||
                                "https://via.placeholder.com/80?text=Game"
                              }
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-medium text-white text-sm sm:text-base mb-1">
                              {item.title}
                            </h3>
                            <p className="text-neutral-400 text-xs sm:text-sm">
                              Téléchargement digital
                            </p>
                          </div>
                          <div className="flex-shrink-0 font-medium text-right">
                            {hasDiscount ? (
                              <div className="text-right">
                                <div className="line-through text-neutral-400 text-xs sm:text-sm">
                                  ${originalPrice.toFixed(2)}
                                </div>
                                <div className="text-green-400 text-sm sm:text-base">
                                  ${discountedPrice.toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-white text-sm sm:text-base">
                                ${originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button
                      onClick={handleClearCart}
                      className="text-red-400 hover:text-red-300 flex items-center text-sm">
                      <X size={16} className="mr-1" />
                      Vider le panier
                    </button>

                    <div className="text-base sm:text-lg text-white">
                      Total:{" "}
                      <span className="font-bold">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Coupon Notification */}
                  {isCouponApplicable && couponDiscount > 0 && (
                    <div className="mt-4 p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400">
                        <Tag size={16} />
                        <span className="font-medium text-sm sm:text-base">
                          4+1 Promotion appliquée!
                        </span>
                      </div>
                      <p className="text-green-300 text-xs sm:text-sm mt-1">
                        Vous avez économisé ${couponDiscount.toFixed(2)} sur
                        votre jeu le moins cher.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment section */}
              <div className="lg:col-span-1">
                <div className="bg-neutral-800 rounded-lg p-4 sm:p-6 sticky top-24">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-white">
                    <CreditCard size={20} className="mr-2" />
                    Paiement
                  </h2>

                  {/* Credit Balance Display */}
                  <div className="bg-neutral-700/50 p-4 rounded-md mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-neutral-300 text-sm">
                        Solde de crédit
                      </span>
                      <span className="text-lg font-bold text-white">
                        ${creditBalance.toFixed(2)}
                      </span>
                    </div>
                    {!hasSufficientCredits && (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle size={14} />
                        <span>Solde insuffisant</span>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-neutral-300 mb-3">
                      Méthode de paiement
                    </h3>

                    {/* Banking Card Option */}
                    <label className="flex items-center p-3 bg-neutral-700/50 rounded-md cursor-pointer hover:bg-neutral-700/70 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-pine" />
                        <span className="text-white text-sm sm:text-base">
                          Carte bancaire
                        </span>
                      </div>
                    </label>

                    {/* Credit Balance Option */}
                    <label
                      className={`flex items-center p-3 rounded-md cursor-pointer transition-colors mt-2 ${
                        hasSufficientCredits
                          ? "bg-neutral-700/50 hover:bg-neutral-700/70"
                          : "bg-neutral-800/50 opacity-50 cursor-not-allowed"
                      }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credits"
                        checked={paymentMethod === "credits"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={!hasSufficientCredits}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-pine" />
                        <span className="text-white text-sm sm:text-base">
                          Solde de crédit
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-neutral-700/50 p-4 rounded-md mb-4">
                    <p className="text-neutral-300 mb-2 text-sm sm:text-base">
                      Récapitulatif de la commande
                    </p>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-neutral-400">Sous-total</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between mb-1 text-green-400 text-sm">
                        <span className="flex items-center gap-1">
                          <Tag size={12} />
                          4+1 Promotion
                        </span>
                        <span>-${couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-neutral-400">Taxe</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <div className="border-t border-neutral-600 my-2"></div>
                    <div className="flex justify-between font-medium text-sm sm:text-base">
                      <span className="text-white">Total à payer</span>
                      <span className="text-white">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {checkoutError && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                      <AlertCircle size={16} className="text-red-400" />
                      <span className="text-red-400 text-sm">
                        {checkoutError}
                      </span>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-pine hover:bg-pine/90 disabled:bg-neutral-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isCheckingOut ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                        <span>Traitement...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        <span>Finaliser la commande</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
