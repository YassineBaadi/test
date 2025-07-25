"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavbarNavLinks } from "./NavLinks/NavbarNavLinks";
import navbar_data from "./data.json";
import DesktopMenu from "./Menu/DesktopMenu";
import MobileMenu, { MobileMenuNavLinks } from "./Menu/MobileMenu";
import CartModal from "../CartModal/CartModal";

export default function Navbar() {
  // Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Cart Modal
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toggle Menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle Search
  const handleSearchClick = () => {
    setIsSearchOpen((prev) => !prev);
  };

  // Toggle Cart
  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Focus on search input when search is open
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when click outside of its body
  const handleSearchBlur = (e) => {
    setTimeout(() => setIsSearchOpen(false), 100);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-midnight/50 sm:bg-midnight/50 backdrop-blur-md shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/gamestart-2.png"
                  width={80}
                  height={80}
                  alt="GameStart logo"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:block ml-10 items-baseline space-x-8">
              <NavbarNavLinks
                links={navbar_data || []}
                toggleMenu={toggleMenu}
              />
            </div>

            {/* Desktop Menu*/}
            <div className="hidden md:flex items-center space-x-4">
              <DesktopMenu
                isSearchOpen={isSearchOpen}
                handleSearchClick={handleSearchClick}
                handleSearchBlur={handleSearchBlur}
                searchInputRef={searchInputRef}
                toggleCart={toggleCart}
              />
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <MobileMenu
                toggleMenu={toggleMenu}
                isMenuOpen={isMenuOpen}
                toggleCart={toggleCart}
              />
            </div>
          </div>

          {/* Mobile Menu Links */}
          {isMenuOpen && (
            <MobileMenuNavLinks
              links={navbar_data || []}
              toggleMenu={toggleMenu}
            />
          )}
        </div>
      </nav>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={toggleCart} />
    </>
  );
}
