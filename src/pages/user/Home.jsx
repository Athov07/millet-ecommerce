import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen font-sans">
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <span className="inline-block bg-primary/25 text-primary px-4 py-1 rounded-full text-sm font-medium">
            Fresh & Homemade
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Discover Delicious <br />
            <span className="text-primary">Recipes </span>made with our <span className="text-primary">Premium Product</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-xl">
            Explore hand-picked recipes created by passionate chefs with our <span className="text-primary">Premium Product</span>.  
            Simple ingredients, clear steps, and amazing taste — all in one place.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/recipes")}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
            >
              Explore Recipes
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition"
            >
              Join Now
            </button>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="grid grid-cols-3 gap-4">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Food 1"
            className="h-56 w-full object-cover rounded-2xl shadow"
          />

          <img
            src="https://images.unsplash.com/photo-1499028344343-cd173ffc68a9"
            alt="Food 2"
            className="h-72 w-full object-cover rounded-2xl shadow mt-8"
          />

          <img
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
            alt="Food 3"
            className="h-56 w-full object-cover rounded-2xl shadow"
          />
        </div>
      </div>

      {/* FEATURE SECTION */}
{/* FEATURE SECTION – ALTERNATE LAYOUT */}
<div className="bg-card py-20">
  <div className="max-w-6xl mx-auto px-4 space-y-16">

    {/* FEATURE 1 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Easy & Clear Recipes
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Every recipe is written in a simple, step-by-step format so
          anyone — beginner or expert — can cook confidently at home.
        </p>
      </div>

      <div className="bg-background p-6 rounded-2xl shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="Easy cooking"
          className="rounded-xl object-cover w-full h-56"
        />
      </div>
    </div>

    {/* FEATURE 2 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
      <div className="bg-background p-6 rounded-2xl shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1499028344343-cd173ffc68a9"
          alt="Ingredients"
          className="rounded-xl object-cover w-full h-56"
        />
      </div>
      
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Fresh & Premium Ingredients
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We focus on freshness and quality. Our premium product
          blends perfectly with carefully selected ingredients
          to deliver great taste every time.
        </p>
      </div>
    </div>

    {/* FEATURE 3 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Trusted by Home Cooks
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Our recipes are loved by users who enjoy simple cooking,
          reliable results, and flavors that feel homemade.
        </p>
      </div>

      <div className="bg-background p-6 rounded-2xl shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
          alt="Happy users"
          className="rounded-xl object-cover w-full h-56"
        />
      </div>
    </div>

  </div>
</div>



    </div>
  );
};

export default Home;
