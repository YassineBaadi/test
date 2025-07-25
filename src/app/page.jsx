"use client";

import Header from "@/components/Header";
import DiscountCarousel from "@/components/Carousel/DiscountCarousel";
import PopularGames from "@/components/PopularGames";
import CouponSection from "@/components/CouponSection/CouponSection";
import BudgetGames from "@/components/BudgetGames/BudgetGames";

export default function Home() {
  return (
    <main>
      <Header />
      <DiscountCarousel />
      <CouponSection />
      <PopularGames />
      <BudgetGames />
    </main>
  );
}
