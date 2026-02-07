import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const categories = [
  "Millet Rava",
  "Millet Flours",
  "Millet Flakes",
  "Millet Instant Mixes",
  "Millet Rice",
  "Combo Pack",
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    mainImage: "",
  });

  /* =========================
     FETCH PRODUCT
  ========================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const product = res.data.product;

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          stock: product.stock || "",
          mainImage: product.mainImage || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.category || !form.stock) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Edit Product</h2>

      {error && (
        <p className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded shadow space-y-4"
      >
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border p-3 rounded"
          />
        </div>

        {/* PRICE & STOCK */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              min="0"
              required
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category *
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* MAIN IMAGE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Main Image URL *
          </label>
          <input
            type="text"
            name="mainImage"
            value={form.mainImage}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        {form.mainImage && (
          <img
            src={form.mainImage}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="border px-6 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
