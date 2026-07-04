const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Add Recipe
export async function addRecipe(recipe) {
  const res = await fetch(`${API_URL}/api/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(recipe),
  });

  if (!res.ok) {
    throw new Error("Failed to add recipe");
  }

  return res.json();
}

// Get All Recipes
export async function getRecipes(page = 1, limit = 6, category = "All") {
  let url = `${API_URL}/api/recipes?page=${page}&limit=${limit}`;

  if (category !== "All") {
    url += `&categories=${category}`;
  }

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return res.json();
}

// Get Single Recipe
export async function getRecipe(id) {
  const res = await fetch(`${API_URL}/api/recipes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Recipe not found");
  }

  return res.json();
}

// Like Recipe
export async function likeRecipe(id) {
  const res = await fetch(`${API_URL}/api/recipes/${id}/like`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed to like recipe");
  }

  return res.json();
}

// Update Recipe
export async function updateRecipe(id, recipe) {
  const res = await fetch(`${API_URL}/api/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(recipe),
  });

  if (!res.ok) {
    throw new Error("Failed to update recipe");
  }

  return res.json();
}

// Get My Recipes
export async function getMyRecipes(email) {
  const res = await fetch(
    `${API_URL}/api/recipes/my-recipes/${email}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch my recipes");
  }

  return res.json();
}