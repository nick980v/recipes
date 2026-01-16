import React from "react";
import RecipeCard from "@/components/RecipeCard";
import { unstable_cache } from "next/cache";

const endpoint = process.env.STRAPI_ENDPOINT;

// Configure static generation and caching
export const revalidate = 86400; // Revalidate every 24 hours
export const dynamicParams = true; // Allow dynamic params not in generateStaticParams

const formatTag = (tag) => {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(" ");
};

const fetchRecipesByTag = async (tag) => {
  const res = await fetch(
    `${endpoint}?filters[recipe_tags][Tag][$containsi]=${tag}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      cache: "force-cache",
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await res.json();
  return data.data;
};

// Cache tag-based recipe fetches
const getCachedRecipesByTag = (tag) => {
  return unstable_cache(
    async () => {
      return await fetchRecipesByTag(tag);
    },
    ["recipes-by-tag", tag],
    {
      revalidate: 86400,
      tags: ["recipes"],
    }
  )();
};

// Generate static params for known tags
export async function generateStaticParams() {
  // Pre-generate pages for common tags
  const commonTags = ["mains", "sides", "breakfast", "desserts"];
  return commonTags.map((tag) => ({
    tag: tag,
  }));
}

const TagPage = async ({ params }) => {
  const { tag } = await params;
  const formattedTag = formatTag(tag); // Ensure it matches Strapi's format

  const recipes = await getCachedRecipesByTag(formattedTag);

  if (!recipes || recipes.length === 0) {
    return <div>No recipes found for this tag.</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-8">Browse {formattedTag}</h2>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              showTag={false}
              priority={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagPage;
