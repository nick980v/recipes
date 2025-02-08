import React from "react";
import Link from "next/link";
import Image from "next/image";

const RecipeCard = ({ recipe }) => {
  const imageUrl = recipe.Image?.url
    ? `http://localhost:1337${recipe.Image.url}`
    : null;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105">
      <Link href={`/recipes/${recipe.documentId}`} passHref>
        <div className="p-4">
          {/* Recipe Title */}
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {recipe.Title}
          </h3>
          {/* Recipe Image */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={recipe.Title}
              width={400} // Width can be adjusted based on design needs
              height={250} // Height can be adjusted based on design needs
              className="rounded-md object-cover w-full mb-3"
            />
          )}
          {/* Recipe Instructions */}
          <p className="text-gray-600 text-sm">
            {recipe.Instructions.slice(0, 100)}...
          </p>{" "}
          {/* Optional: Limit the instructions */}
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
