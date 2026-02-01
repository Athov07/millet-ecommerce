import { Link } from "react-router-dom";
import { useState } from "react";


const ProductCard = ({ product }) => {
  const [activeImage, setActiveImage] = useState(product.mainImage);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Main Image */}
      <img
        src={`http://localhost:5000/uploads/products/${activeImage}`}
        className="w-full h-64 object-cover rounded"
        alt={product.name}
      />
      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-green-700 font-bold text-lg">
            ₹{product.price}
          </span>

          <Link
            to={`/products/${product._id}`}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View
          </Link>
        </div>
      </div>
 
    </div>
  );
};

export default ProductCard;
