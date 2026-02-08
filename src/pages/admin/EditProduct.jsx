import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { PRODUCT_CATEGORIES } from "../../constants/productCategories";

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
    stock: "",
    category: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [previewMain, setPreviewMain] = useState("");
  const [previewGallery, setPreviewGallery] = useState([]);

  /* =========================
     FETCH PRODUCT
  ========================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data.product;

        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          category: p.category,
        });

        setPreviewMain(p.mainImage || "");
        setPreviewGallery((p.images || []).map((i) => i.url));
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
    setPreviewMain(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewGallery(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.category || !form.stock) {
      setError("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (mainImage) formData.append("mainImage", mainImage);
    images.forEach((img) => formData.append("images", img));

    try {
      setSaving(true);
      await api.put(`/products/${id}`, formData);
      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Edit Product</h2>

      {error && (
        <p className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded shadow space-y-4"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Product Name"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          className="w-full border p-3 rounded"
          placeholder="Description"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            placeholder="Price"
            min="0"
            required
          />
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            placeholder="Stock"
            min="0"
            required
          />
        </div>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Category</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* MAIN IMAGE */}
        <div>
          <label className="block mb-1 font-medium">Main Image</label>
          <input type="file" accept="image/*" onChange={handleMainImageChange} />
          {previewMain && (
            <img
              src={previewMain}
              alt="Preview"
              className="w-32 h-32 object-cover mt-2 rounded border"
            />
          )}
        </div>

        {/* GALLERY IMAGES */}
        <div>
          <label className="block mb-1 font-medium">Gallery Images</label>
          <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />
          <div className="flex gap-2 mt-2 flex-wrap">
            {previewGallery.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery ${idx}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>

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
