import { Search, CreditCard } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import LoginWrapper from "../../LoginWrapper";
import { useSelector } from "react-redux";
import { selectCartItems } from "@/lib/features/cartSlice";
import { Suspense } from "react";

export default function DesktopMenu({
  isSearchOpen,
  handleSearchClick,
  handleSearchBlur,
  searchInputRef,
  toggleCart,
}) {
  const cartItems = useSelector(selectCartItems);
  const { user } = useSelector((state) => state.auth);
  const cartItemCount = cartItems?.length || 0;

  return (
    <div className="flex items-center space-x-4">
      {/* Shopping Cart */}
      <div className="relative">
        <button
          onClick={toggleCart}
          className="text-slate-300 hover:text-pine hover:bg-rosy p-2 rounded-full transition-all duration-200 cursor-pointer">
          <ShoppingCart size={20} />
        </button>

        {/* Cart Counter Badge */}
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-moss text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </div>

      {/* Credit Balance - Only show if user is logged in */}
      {user.isConnected && (
        <div className="flex items-center gap-2 bg-neutral-700/50 px-3 py-1 rounded-lg border border-neutral-600">
          <CreditCard size={16} className="text-pine" />
          <span className="text-sm font-medium text-white">
            {(user.creditBalance || 0).toFixed(2)} €
          </span>
        </div>
      )}

      {/* Login */}
      <Suspense fallback={<div>Loading...</div>}>
        <LoginWrapper />
      </Suspense>
    </div>
  );
}
