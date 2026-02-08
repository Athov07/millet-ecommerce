import { useState } from "react";
import { createRecipeAPI } from "../../services/recipeService";
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "" },
  ]);

  const [instructions, setInstructions] = useState([
    { step: 1, text: "" },
  ]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("instructions", JSON.stringify(instructions));

      await createRecipeAPI(formData);
      alert("Recipe added successfully ✅");
      navigate("/admin/recipes");
    } catch (error) {
      console.error(error);
      alert("Failed to add recipe ❌");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-card p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Add New Recipe
      </h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Recipe Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium mb-1">Recipe Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
            required
          />
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Ingredients</h3>

          {ingredients.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 mb-3 items-center"
            >
              <input
                type="text"
                placeholder="Ingredient name"
                value={item.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                className="flex-1 border rounded-lg px-3 py-2"
                required
              />

              <input
                type="text"
                placeholder="Quantity"
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

        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Instructions</h3>

          {instructions.map((item, index) => (
            <div key={index} className="mb-4">
              <textarea
                placeholder={`Step ${item.step}`}
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          Create Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
