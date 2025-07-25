import { ShoppingCart } from "lucide-react";
import { X } from "lucide-react";
import { Menu } from "lucide-react";
import { Search } from "lucide-react";
import LoginWrapper from "../../LoginWrapper";
import { NavbarNavLinksComponent } from "../NavLinks/NavbarNavLinks";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCartItems } from "@/lib/features/cartSlice";

function MobileMenu({ toggleMenu, isMenuOpen, toggleCart }) {
  const cartItems = useSelector(selectCartItems);
  const cartItemCount = cartItems?.length || 0;

  return (
    <div className="flex items-center space-x-3">
      {/* Shopping Cart */}
      <div className="relative">
        <button
          onClick={toggleCart}
          className="text-slate-300 hover:text-pine hover:bg-rosy p-2 rounded-full transition-all duration-200 cursor-pointer">
          <ShoppingCart size={20} />
        </button>

        {/* Cart Counter Badge */}
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rosy text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </div>

      {/* Login */}
      <LoginWrapper />

      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="text-slate-300 hover:text-pine hover:bg-rosy p-2 rounded-md transition-all duration-200 cursor-pointer">
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
}

export function MobileMenuNavLinks({ links, toggleMenu }) {
  // Security check to avoid error if links is undefined
  if (!links || !Array.isArray(links)) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Links */}
      <div className="md:hidden w-auto">
        <div className=" pt-2 pb-3 space-y-1 sm:px-3 bg-midnight rounded-lg mt-2 text-center">
          {links.map((link) => (
            <NavbarNavLinksComponent
              key={link.name}
              name={link.name}
              url={link.url}
              toggleMenu={toggleMenu}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
