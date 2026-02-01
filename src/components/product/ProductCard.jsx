import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl = product?.images?.[0]?.url
    ? `http://localhost:5000/uploads/products/${product.images[0].url}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* IMAGE */}
      <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full object-contain"
        />
      </div>

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
