import React from "react";
import Image from "next/image";

const endpoint = process.env.STRAPI_ENDPOINT;

const fetchRecipe = async (documentId) => {
  const res = await fetch(`${endpoint}/${documentId}?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await res.json();
  return data.data;
};

const RecipeDetailPage = async ({ params }) => {
  const { documentId } = await params;
  const recipe = await fetchRecipe(documentId);
  console.log("recipe", recipe.ingredient);
  if (!recipe) {
    return <div>Error: Recipe not found</div>;
  }

  const imageUrl = recipe.Image?.url ? `${recipe.Image.url}` : null;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Recipe Image */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={recipe.Title}
            width={400} // Adjust width as desired
            height={300} // Adjust height as desired
            className="rounded-md object-cover mb-6 max-w-sm mx-auto"
          />
        )}

        {/* Recipe Title */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          {recipe.Title}
        </h1>

        {/* Ingredients Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ingredients
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            {recipe.ingredient.map((ingredient) => (
              <li key={ingredient.id} className="text-gray-700 text-lg">
                <p key={ingredient.name} className="text-sm text-gray-600">
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Instructions
          </h2>
          <p className="text-lg text-gray-700">{recipe.Instructions}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
