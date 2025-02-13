// pages/tags/[tag].js
import React from "react";
import axios from "axios";
import RecipeCard from "@/components/RecipeCard";

const token = process.env.STRAPI_TOKEN;
const endpoint = process.env.STRAPI_ENDPOINT;

const formatTag = (tag) => {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(" ");
};

const fetchRecipesByTag = async (tag) => {
  console.log("tag", tag);
  const res = await axios.get(
    `${endpoint}?filters[recipe_tags][Tag][$containsi]=${tag}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data;
};

const TagPage = async ({ params }) => {
  const { tag } = await params;
  const formattedTag = formatTag(tag); // Ensure it matches Strapi's format

  const recipes = await fetchRecipesByTag(formattedTag);

  if (!recipes || recipes.length === 0) {
    return <div>No recipes found for this tag.</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-8">Browse {formattedTag}</h2>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} showTag={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagPage;
