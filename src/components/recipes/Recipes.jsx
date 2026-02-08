import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/recipes"
      );
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

  if (loading) {
    return (
      <p className="text-center mt-16 text-gray-500">
        Loading recipes...
      </p>
    );
  }

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto font-sans">
        {/* GRID → 4 CARDS ON LARGE SCREENS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              onClick={() => navigate(`/recipes/${recipe._id}`)}
              className="group bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
            >
              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-1">
                <h3 className="text-base font-semibold text-gray-800 group-hover:text-primary transition">
                  {recipe.title}
                </h3>

                <p className="text-xs text-gray-500">
                  Click to view recipe
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {recipes.length === 0 && (
          <p className="text-center text-gray-500 mt-20">
            No recipes found
          </p>
        )}
      </div>
    </div>
  );
};

export default Recipes;
