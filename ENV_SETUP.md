# Environment Setup

To run the meal planner and shopping list features, you need to configure the following environment variables:

## Required Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# Strapi API Configuration
STRAPI_ENDPOINT=https://your-strapi-instance.com/api/recipes
STRAPI_TOKEN=your-strapi-api-token-here

# Client-side environment variables (must have NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_STRAPI_ENDPOINT=https://your-strapi-instance.com/api/recipes
NEXT_PUBLIC_STRAPI_TOKEN=your-strapi-api-token-here

# Optional: Admin endpoint for adding recipes
NEXT_PUBLIC_ADMIN_ENDPOINT=https://your-strapi-admin-url.com/admin

# Optional: Revalidation secret for API routes
REVALIDATE_SECRET=your-revalidation-secret-here
```

## How to Get Your Strapi API Token

1. Log into your Strapi admin panel
2. Go to Settings → API Tokens
3. Create a new API token with appropriate permissions
4. Copy the token value to your environment variables

## Troubleshooting

If you see infinite loading:

- Check that your Strapi instance is running and accessible
- Verify the API endpoint URL is correct
- Ensure the API token has the necessary permissions
- Check browser/network console for error messages

The app will show helpful error messages if the environment variables are not configured properly.
