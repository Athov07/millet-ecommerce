import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllProductsAPI,
  deleteProductAPI,
} from "../../services/adminProductService";
import { PRODUCT_CATEGORIES } from "../../constants/productCategories";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await getAllProductsAPI();
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProductAPI(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  /* ✅ FILTER + SORT (NEWEST FIRST) */
  const filteredProducts = products
    .filter((p) => {
      return (
        (!category || p.category === category) &&
        (!maxPrice || p.price <= Number(maxPrice))
      );
    })
    .sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <div className="bg-card p-6 rounded shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Products</h2>
          <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-lg border">
          <p className="text-sm text-gray-600">
            Total Products:{" "}
            <span className="font-semibold">
              {filteredProducts.length}
            </span>
          </p>
          </div>
        </div>

        <Link
          to="/admin/products/add"
          className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
        >
          + Add Product
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded w-40"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Sr No</th>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Stock</th>
              <th className="p-3 border">Edit</th>
              <th className="p-3 border">Remove</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, index) => (
              <tr key={p._id} className="hover:bg-gray-50 transition text-center">
                {/* SR NO */}
                <td className="p-3 border">
                  {index + 1}
                </td>

                <td className="p-3 border">
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    className="w-14 h-14 object-cover rounded border "
                  />
                </td>

                <td className="p-3 border font-medium">
                  {p.name}
                </td>

                <td className="p-3 border">
                  {p.category}
                </td>

                <td className="p-3 border text-center">
                  ₹{p.price}
                </td>

                <td className="p-3 border text-center">
                  {p.stock}
                </td>

                {/* EDIT */}
                <td className="p-3 border text-center">
                  <button
                    onClick={() =>
                      navigate(`/admin/products/edit/${p._id}`)
                    }
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Edit
                  </button>
                </td>

                {/* REMOVE */}
                <td className="p-3 border text-center">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="p-4 text-center text-gray-500"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
