"use client";

import Link from "next/link";
import { useState } from "react";
import CopyrightDisclaimer from "./CopyrightDisclaimer/CopyrightDisclaimer";
import FooterNavLinks from "./NavLinks/FooterNavLinks";
import Newsletter from "./Newsletter/Newsletter";
import footer_data from "./data.json";

export default function Footer() {
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const handleNewsletter = (e) => {
    e.preventDefault();
    setNewsletterSuccess(true);
    setTimeout(() => setNewsletterSuccess(false), 2500);
  };

  return (
    <>
      <footer className="bg-midnight">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0 pr-12 transition-all duration-100 translate-y-8">
              <Link href={"/"} className="flex items-center">
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-ivory">
                  GameStart
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-0">
              <FooterNavLinks links={footer_data} />

              <Newsletter
                handleNewsletter={handleNewsletter}
                newsletterSuccess={newsletterSuccess}
              />
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <CopyrightDisclaimer />
        </div>
      </footer>
    </>
  );
}
