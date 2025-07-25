"use client";

import { buyUpgrade, clickCookie } from "@/lib/features/clickerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Upgrade from "@/components/cookie-clicker/Upgrade";
import upgrades from "@/components/cookie-clicker/data.json";
import StatsBar from "@/components/cookie-clicker/StatsBar";
import Header from "@/components/cookie-clicker/CookieHeader";
import MainButton from "@/components/cookie-clicker/MainButton";
import { CookieIcon } from "lucide-react";

export default function CookieClicker() {
  const clicker = useSelector((state) => state.clicker);
  const dispatch = useDispatch();

  // Increment cookies per second
  useEffect(() => {
    const interval = setInterval(() => {
      if (clicker.cookiesPerSecond > 0) {
        dispatch(clickCookie(clicker.cookiesPerSecond));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [clicker.cookiesPerSecond, dispatch]);

  const handleCookieClick = () => {
    dispatch(clickCookie());
  };

  const handleBuyUpgrade = (upgrade) => {
    dispatch(buyUpgrade(upgrade));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-cyan-950 text-white relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Animated scan lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse"></div>

      {/* Glitch effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-500/5 to-transparent opacity-50"></div>

      {/* Neon glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 py-8 pt-20 relative z-10">
        {/* Header */}
        <Header
          title="CYBER COOKIE"
          description="WAKE UP • WAKE UP • WAKE UP"
        />

        {/* Stats Bar */}
        <StatsBar clicker={clicker} />

        {/* Main Cookie */}
        <MainButton
          handleCookieClick={handleCookieClick}
          icon={<CookieIcon size={120} />}
        />

        {/* Upgrades Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent tracking-wider uppercase">
            <span className="text-cyan-400">[</span>
            SYSTEM UPGRADES
            <span className="text-purple-400">]</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Upgrade
              upgrades={upgrades}
              clicker={clicker}
              handleBuyUpgrade={handleBuyUpgrade}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
