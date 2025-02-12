import React from "react";
import Link from "next/link";
import Image from "next/image";
import Tag from "./Tag";

const RecipeCard = ({ recipe, showTag }) => {
  const imageUrl = recipe.Image?.url ? `${recipe.Image.url}` : null;
  console.log("recipe", recipe);
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105">
      <div className="p-4">
        <Link href={`/recipes/${recipe.documentId}`} passHref>
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
              priority={true} // This will preload the image
            />
          )}
        </Link>
        {/* Recipe Tags */}
        {showTag && (
          <div className="flex flex-wrap">
            {recipe.recipe_tags.map((tag) => (
              <Tag key={tag.id} tag={tag.Tag} />
            ))}
          </div>
        )}
        {/* Recipe Instructions */}
        <p className="text-gray-600 text-sm">
          {recipe.Instructions
            ? recipe.Instructions.slice(0, 100)
            : "No instructions available"}
        </p>
        {/* Optional: Limit the instructions */}
      </div>
    </div>
  );
};

export default RecipeCard;
