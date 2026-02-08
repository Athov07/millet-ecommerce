import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRecipeByIdAPI,
  updateRecipeAPI,
} from "../../services/recipeService";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  /* FETCH RECIPE */
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await getRecipeByIdAPI(id);
        const recipe = res.data.recipe;

        setTitle(recipe.title);
        setPreviewImage(recipe.image);
        setIngredients(recipe.ingredients);
        setInstructions(recipe.instructions);
      } catch (error) {
        console.error(error);
        alert("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  /* INGREDIENT HANDLERS */
  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  /* INSTRUCTION HANDLERS */
  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index].text = value;
    setInstructions(updated);
  };

  const addInstruction = () => {
    setInstructions([
      ...instructions,
      { step: instructions.length + 1, text: "" },
    ]);
  };

  const removeInstruction = (index) => {
    const updated = instructions
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, step: i + 1 }));
    setInstructions(updated);
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (image) formData.append("image", image);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("instructions", JSON.stringify(instructions));

      await updateRecipeAPI(id, formData);

      alert("Recipe updated successfully ✅");
      navigate("/admin/recipes");
    } catch (error) {
      console.error(error);
      alert("Failed to update recipe ❌");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading recipe...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-card p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Edit Recipe
      </h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6"
      >
        {/* TITLE */}
        <div>
          <label className="block font-medium mb-1">Recipe Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="block font-medium mb-1">Recipe Image</label>

          {previewImage && (
            <img
              src={previewImage}
              alt="Recipe"
              className="w-40 h-40 object-cover rounded mb-3"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />

          <p className="text-sm text-gray-500 mt-1">
            Leave empty to keep existing image
          </p>
        </div>

        {/* INGREDIENTS */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Ingredients</h3>

          {ingredients.map((item, index) => (
            <div key={index} className="flex gap-3 mb-3 items-center">
              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                className="flex-1 border rounded-lg px-3 py-2"
                required
              />

              <input
                type="text"
                value={item.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                className="w-40 border rounded-lg px-3 py-2"
                required
              />

              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-error font-semibold"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredient}
            className="text-primary font-medium"
          >
            + Add Ingredient
          </button>
        </div>

        {/* INSTRUCTIONS */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Instructions</h3>

          {instructions.map((item, index) => (
            <div key={index} className="mb-4">
              <textarea
                value={item.text}
                onChange={(e) =>
                  handleInstructionChange(index, e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2 min-h-[80px]"
                required
              />

              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="text-error mt-1"
                >
                  Remove Step
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addInstruction}
            className="text-primary font-medium"
          >
            + Add Step
          </button>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
