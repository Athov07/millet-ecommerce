import Recipes from "../../components/recipes/Recipes";

const RecipesPage = () => {
  return (
    <div className="bg-background min-h-screen font-sans">
      {/* PAGE HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Recipes
        </h1>

        {/* RECIPES GRID */}
        <Recipes />
      </div>
    </div>
  );
};

export default RecipesPage;
