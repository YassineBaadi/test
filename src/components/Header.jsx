// src/components/Header.jsx
import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <header className="w-full">
      {/* Desktop/tablette */}
      <div className="relative w-full h-[180px] md:h-[320px] hidden sm:block">
        <Image
          src="/gog.com-summer-sale.jpg"
          alt="Summer Sale Banner Desktop"
          fill
          sizes="auto"
          className="object-cover w-full h-full"
          priority
        />
      </div>
      {/* Mobile */}
      <div className="relative w-full h-[320px] sm:hidden">
        <Image
          src="/gog.com-summer-sale-mobile.jpg"
          alt="Summer Sale Banner Mobile"
          fill
          sizes="auto"
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </header>
  );
}
