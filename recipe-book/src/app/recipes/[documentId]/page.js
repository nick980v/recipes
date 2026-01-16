import React from "react";
import Image from "next/image";
import { unstable_cache } from "next/cache";

const endpoint = process.env.STRAPI_ENDPOINT;

// Configure static generation and caching
export const revalidate = 86400; // Revalidate every 24 hours
export const dynamicParams = true; // Allow dynamic params not in generateStaticParams

const fetchRecipe = async (documentId) => {
  console.log("endpoint: ", endpoint);
  const res = await fetch(`${endpoint}/${documentId}?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    cache: "force-cache",
    next: {
      revalidate: 86400, // Cache for 24 hours
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await res.json();
  return data.data;
};

// Cache individual recipe fetches
const getCachedRecipe = (documentId) => {
  return unstable_cache(
    async () => {
      return await fetchRecipe(documentId);
    },
    ["recipe", documentId],
    {
      revalidate: 86400,
      tags: ["recipes"],
    }
  )();
};

// Generate static params for popular recipes (optional - can be expanded)
export async function generateStaticParams() {
  // Fetch all recipe IDs to pre-generate pages
  try {
    const res = await fetch(`${endpoint}?fields[0]=documentId`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      cache: "force-cache",
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data.map((recipe) => ({
      documentId: recipe.documentId.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

const RecipeDetailPage = async ({ params }) => {
  const { documentId } = await params;
  const recipe = await getCachedRecipe(documentId);
  if (!recipe) {
    return <div>Error: Recipe not found</div>;
  }

  const imageUrl = recipe.Image?.url ? `${recipe.Image.url}` : null;

  const ingredients = recipe?.ingredient || [];

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
            {ingredients.length > 0 ? (
              ingredients.map((ingredient) => (
                <li key={ingredient.id || Math.random()}>
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </li>
              ))
            ) : (
              <p>No ingredients listed</p>
            )}
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
