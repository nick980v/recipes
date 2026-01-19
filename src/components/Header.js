"use client"; // Mark this file as a client component to allow useState

import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <nav className="max-w-screen-xl mx-auto flex justify-between items-center">
          <Link href={`/`} passHref>
            {/* Adjust the heading size and make it responsive */}
            <h1 className="text-2xl font-semibold sm:text-2xl md:text-3xl text-center sm:text-left">
              Casa Dei Recipes
            </h1>
          </Link>
          <div className="hidden sm:flex space-x-8 justify-center sm:justify-end items-center">
            {/* Adjust link spacing and hover effect */}
            <Link
              href="/tags/mains"
              className="text-lg hover:text-yellow-400 transition-colors"
            >
              Mains
            </Link>
            <Link
              href="/tags/sides"
              className="text-lg hover:text-yellow-400 transition-colors"
            >
              Side Dishes
            </Link>
            <Link
              href="/tags/breakfast"
              className="text-lg hover:text-yellow-400 transition-colors"
            >
              Breakfast
            </Link>
            <Link
              href="/tags/desserts"
              className="text-lg hover:text-yellow-400 transition-colors"
            >
              Desserts
            </Link>
            <Link
              href="/meal-planner"
              className="text-lg hover:text-yellow-400 transition-colors"
            >
              Meal Planner
            </Link>
            <Link
              href="/shopping-list"
              className="text-lg hover:text-yellow-400 transition-colors"
            >
              Shopping List
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_ADMIN_ENDPOINT}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            >
              + Add Recipe
            </Link>
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white p-2 bg-gray-700 rounded-full"
            >
              {isMenuOpen ? "✖" : "☰"}
            </button>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="sm:hidden flex flex-col items-center space-y-4 mt-4">
            <Link
              href="/tags/mains"
              className="text-lg hover:text-yellow-400 transition-colors"
              onClick={closeMenu}
            >
              Mains
            </Link>
            <Link
              href="/tags/sides"
              className="text-lg hover:text-yellow-400 transition-colors"
              onClick={closeMenu}
            >
              Side Dishes
            </Link>
            <Link
              href="/tags/breakfast"
              className="text-lg hover:text-yellow-400 transition-colors"
              onClick={closeMenu}
            >
              Breakfast
            </Link>
            <Link
              href="/tags/desserts"
              className="text-lg hover:text-yellow-400 transition-colors"
              onClick={closeMenu}
            >
              Desserts
            </Link>
            <Link
              href="/meal-planner"
              className="text-lg hover:text-yellow-400 transition-colors"
              onClick={closeMenu}
            >
              Meal Planner
            </Link>
            <Link
              href="/shopping-list"
              className="text-lg hover:text-yellow-400 transition-colors"
              onClick={closeMenu}
            >
              Shopping List
            </Link>
          </div>
        )}
      </header>
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <Link
          href={process.env.NEXT_PUBLIC_ADMIN_ENDPOINT}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-yellow-500 text-gray-900 px-5 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition text-lg font-semibold"
        >
          + Add Recipe
        </Link>
      </div>
    </>
  );
};

export default Header;
