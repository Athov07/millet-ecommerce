import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/recipes/${id}`
      );
      setRecipe(res.data.recipe);
    } catch (err) {
      console.error(err);
      alert("Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center mt-16 text-gray-500">
        Loading recipe...
      </p>
    );
  }

  if (!recipe) {
    return (
      <p className="text-center mt-16 text-gray-500">
        Recipe not found
      </p>
    );
  }

  return (
    <div className="bg-background min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8 font-sans">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="text-l font-bold text-primary hover:underline"
        >
          ← Back to Recipes
        </button>

        {/* IMAGE */}
        <div className="overflow-hidden rounded-xl shadow">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-80 object-cover"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {recipe.title}
        </h1>

        {/* INGREDIENTS */}
        {recipe.ingredients?.length > 0 && (
          <div className="bg-card p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-primary mb-3">
              Ingredients
            </h2>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>
                  <span className="font-medium">{ing.name}</span>{" "}
                  <span className="text-gray-500">
                    — {ing.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* INSTRUCTIONS */}
        {recipe.instructions?.length > 0 && (
          <div className="bg-card p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-primary mb-3">
              Instructions
            </h2>

            <ol className="list-decimal list-inside text-gray-700 space-y-3">
              {recipe.instructions.map((step) => (
                <li key={step.step} className="leading-relaxed">
                  {step.text}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
