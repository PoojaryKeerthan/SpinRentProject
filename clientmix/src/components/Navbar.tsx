"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/searchpage" },
    ...(isSignedIn ? [{ name: "Dashboard", href: "/userdetails" }] : []),
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg border-gray-100" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={handleLinkClick}>
            <span className={`text-xl font-bold transition-colors duration-300 ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}>
              Spin<span className="text-orange-500">Rent</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  pathname === item.href
                    ? "text-orange-500"
                    : isScrolled
                    ? "text-gray-700 hover:text-orange-500"
                    : "text-white hover:text-orange-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <div className="flex items-center">
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <Link
                href="/auth"
                className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled 
                    ? "text-gray-700 hover:text-orange-500" 
                    : "text-white hover:text-orange-400"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isScrolled
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                    : "bg-white hover:bg-gray-100 text-gray-900 shadow-lg"
                }`}
              >
                Get Started
              </Link>
            </SignedOut>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? "text-gray-700 hover:bg-gray-100" 
                : "text-white hover:bg-white/10"
            }`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}>
          <div className={`py-4 px-2 mt-2 rounded-xl transition-all duration-300 ${
            isScrolled 
              ? "bg-white shadow-lg border border-gray-100" 
              : "bg-gray-900/95 backdrop-blur-md shadow-2xl border border-white/10"
          }`}>
            {/* Mobile Nav Items */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    pathname === item.href
                      ? isScrolled
                        ? "text-orange-600 bg-orange-50"
                        : "text-orange-400 bg-white/10"
                      : isScrolled
                      ? "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                      : "text-white hover:text-orange-400 hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile Auth Section */}
            <div className={`mt-4 pt-4 space-y-3 border-t ${
              isScrolled ? "border-gray-200" : "border-white/20"
            }`}>
              <SignedIn>
                <div className="px-4 py-2 flex items-center">
                  <UserButton />
                  <span className={`ml-3 font-medium ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}>
                    Account
                  </span>
                </div>
              </SignedIn>
              <SignedOut>
                <div className="space-y-2">
                  <Link
                    href="/auth"
                    onClick={handleLinkClick}
                    className={`block px-4 py-3 text-center font-medium rounded-lg border-2 transition-all duration-300 ${
                      isScrolled
                        ? "text-gray-700 border-gray-200 hover:border-orange-500 hover:text-orange-600"
                        : "text-white border-white/30 hover:border-orange-400 hover:text-orange-400"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    onClick={handleLinkClick}
                    className={`block px-4 py-3 text-center font-medium rounded-lg transition-all duration-300 ${
                      isScrolled
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                        : "bg-white hover:bg-gray-100 text-gray-900 shadow-lg"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}