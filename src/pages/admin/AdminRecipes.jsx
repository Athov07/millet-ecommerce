import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllRecipesAPI,
  deleteRecipeAPI,
} from "../../services/recipeService";

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const res = await getAllRecipesAPI();
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await deleteRecipeAPI(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipe");
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading recipes...
      </p>
    );
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* TITLE + COUNT */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            Recipes
          </h2>

          <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-lg border">
            <span className="text-sm text-gray-600">
              Total Recipes:
            </span>
            <span className="text-sm font-semibold text-primary">
              {recipes.length}
            </span>
          </div>
        </div>

        {/* SEARCH + ADD */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search recipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary/30"
          />

          <Link
            to="/admin/recipes/add"
            className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 text-sm"
          >
            + Add Recipe
          </Link>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredRecipes.length === 0 && (
        <p className="text-gray-500 text-center">
          No recipes found
        </p>
      )}

      {/* TABLE */}
      {filteredRecipes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-background">
              <tr className="text-left">
                <th className="p-3 border">Sr No</th>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border text-center">Edit</th>
                <th className="p-3 border text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecipes.map((recipe, index) => (
                <tr
                  key={recipe._id}
                  className="hover:bg-gray-50"
                >
                  <td className="p-3 border">
                    {index + 1}
                  </td>

                  <td className="p-3 border">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>

                  <td className="p-3 border font-medium">
                    {recipe.title}
                  </td>

                  <td className="p-3 border text-center">
                    <Link
                      to={`/admin/recipes/edit/${recipe._id}`}
                      className="text-info hover:underline font-medium"
                    >
                      Edit
                    </Link>
                  </td>

                  <td className="p-3 border text-center">
                    <span
                      onClick={() =>
                        handleDelete(recipe._id)
                      }
                      className="text-error hover:underline font-medium cursor-pointer"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRecipes;
