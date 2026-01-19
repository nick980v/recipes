import React from "react";
import ShoppingListClient from "./ShoppingListClient";

const ShoppingListPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Shopping List</h1>
      <ShoppingListClient />
    </div>
  );
};

export default ShoppingListPage;