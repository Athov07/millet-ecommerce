import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProductById,
  getRelatedProducts,
} from "../../services/productService";
import ProductCard from "../../components/product/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    e.currentTarget.querySelector("img").style.transformOrigin = `${x}% ${y}%`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.querySelector("img").style.transformOrigin = "center";
  };

  /* ============================
     FETCH PRODUCT
  ============================ */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (error) {
        console.error("PRODUCT FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ============================
     SET DEFAULT IMAGE SAFELY
  ============================ */
  useEffect(() => {
    if (product) {
      setActiveImage(product.mainImage);
    }
  }, [product]);

  /* Scroll to top on product change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  //Fetch related products

  useEffect(() => {
    if (!id) return;

    const fetchRelated = async () => {
      try {
        const data = await getRelatedProducts(id);
        setRelatedProducts(data.products);
      } catch (error) {
        console.error("RELATED PRODUCT ERROR:", error);
      }
    };

    fetchRelated();
  }, [id]);

  /* ============================
     LOADING / ERROR STATES
  ============================ */
  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-600">Loading product...</p>
    );
  }

  if (!product) {
    return <p className="text-center mt-20 text-red-500">Product not found</p>;
  }

  const allImages = [
    product.mainImage,
    ...product.images.map((img) => img.url),
  ];

  // Button logic
  const nextThumbs = () => {
    if (startIndex + visibleCount < allImages.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevThumbs = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  /* ============================
     UI
  ============================ */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* IMAGE SECTION */}
        <div>
          {/* Main Image */}
          <div
            className="product-zoom-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={`http://localhost:5000/uploads/products/${activeImage}`}
              alt={product.name}
              className="product-zoom-image"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-2 mt-4">
            {/* Left Button */}
            <button
              onClick={prevThumbs}
              disabled={startIndex === 0}
              className="px-2 py-1 border rounded disabled:opacity-30"
            >
              ◀
            </button>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-hidden w-[280px]">
              {allImages
                .slice(startIndex, startIndex + visibleCount)
                .map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/uploads/products/${img}`}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 object-cover cursor-pointer border rounded
            ${
              activeImage === img
                ? "border-green-600 ring-2 ring-green-500"
                : "border-gray-300"
            }`}
                    alt="thumbnail"
                  />
                ))}
            </div>

            {/* Right Button */}
            <button
              onClick={nextThumbs}
              disabled={startIndex + visibleCount >= allImages.length}
              className="px-2 py-1 border rounded disabled:opacity-30"
            >
              ▶
            </button>
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

          <p className="text-green-600 text-2xl font-semibold mt-4">
            ₹{product.price}
          </p>

          <p className="mt-6 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          <button className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
      {/* ============================
   RELATED PRODUCTS
============================ */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
