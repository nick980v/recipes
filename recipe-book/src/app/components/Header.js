"use client"; // Mark this file as a client component to allow useState

import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link href={`/`} passHref>
          {/* Adjust the heading size and make it responsive */}
          <h1 className="text-2xl font-semibold sm:text-2xl md:text-3xl text-center sm:text-left">
            Casadei Recipes
          </h1>
        </Link>
        <div className="hidden sm:flex space-x-8 justify-center sm:justify-end">
          {/* Adjust link spacing and hover effect */}
          <Link
            href="/mains"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Mains
          </Link>
          <Link
            href="/sides"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Side Dishes
          </Link>
          <Link
            href="/breakfast"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Breakfast
          </Link>
          <Link
            href="/desserts"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Desserts
          </Link>
          <Link
            href="/healthy"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Healthy Recipes
          </Link>
          <Link
            href="/meal-prep"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Meal Prep
          </Link>
        </div>
        <div className="sm:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white p-2 bg-gray-700 rounded-full"
          >
            {isMenuOpen ? "✖" : "☰"} {/* Change icon based on menu state */}
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="sm:hidden flex flex-col items-center space-y-4 mt-4">
          <Link
            href="/mains"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Mains
          </Link>
          <Link
            href="/sides"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Side Dishes
          </Link>
          <Link
            href="/breakfast"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Breakfast
          </Link>
          <Link
            href="/desserts"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Desserts
          </Link>
          <Link
            href="/healthy"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Healthy Recipes
          </Link>
          <Link
            href="/meal-prep"
            className="text-lg hover:text-yellow-400 transition-colors"
          >
            Meal Prep
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
