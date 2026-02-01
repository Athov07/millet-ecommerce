import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../../services/productService";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageUrl = product?.images?.[0]?.url
    ? `http://localhost:5000/uploads/products/${product.images[0].url}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">

        <img
          src={imageUrl}
          alt={product.name}
          className="rounded-xl w-full h-96 object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-green-600 text-2xl font-semibold mt-4">
            ₹{product.price}
          </p>

          <p className="mt-6 text-gray-700">{product.description}</p>

          <button
            className="mt-8 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
