import FilterSideBar from "@/components/FilterSideBar/FilterSideBar";
import AllGames from "@/components/AllGames/AllGames";
import SearchBar from "@/components/SearchBar/SearchBar";
import CouponSection from "@/components/CouponSection/CouponSection";
import { Gamepad } from "lucide-react";

export default function Games() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-midnight to-midnight/90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Header section */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Gamepad className="text-rosy mr-3 transition-smooth" size={32} />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ivory">
              Catalogue de jeux
            </h1>
          </div>
          <p className="text-ivory/70 text-lg sm:text-xl max-w-2xl mx-auto">
            Découvrez notre collection de jeux incroyables
          </p>
        </div>

        {/* Search bar - Mobile only, hidden on desktop */}
        <div className="mb-8 sm:mb-12 lg:hidden">
          <SearchBar />
        </div>

        {/* Main content area with sticky sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky sidebar with search, filters and coupon */}
          <aside className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="sticky top-22 space-y-6 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
              {/* Search bar - Desktop only, at top of sticky sidebar */}
              <div className="hidden lg:block">
                <SearchBar />
              </div>

              {/* Filters */}
              <div className="bg-midnight/70 backdrop-blur-md p-6 rounded-xl border border-ivory/10 shadow-lg hover-lift">
                <FilterSideBar />
              </div>

              {/* Coupon section - Inline variant */}
              <CouponSection variant="inline" />
            </div>
          </aside>

          {/* Games grid - Main content */}
          <div className="flex-1 min-w-0">
            <AllGames />
          </div>
        </div>
      </div>
    </main>
  );
}
