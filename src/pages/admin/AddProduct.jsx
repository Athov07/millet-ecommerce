import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProductAPI } from "../../services/adminProductService";
import { PRODUCT_CATEGORIES } from "../../constants/productCategories";

const AddProduct = () => {
  const navigate = useNavigate();

  // Form fields
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  // Main image file & preview
  const [mainImage, setMainImage] = useState(null);
  const [previewMain, setPreviewMain] = useState("");

  // Gallery images & previews
  const [images, setImages] = useState([]);
  const [previewGallery, setPreviewGallery] = useState([]);

  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     HANDLE FILE CHANGES
  ========================= */
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreviewMain(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewGallery(files.map((f) => URL.createObjectURL(f)));
  };

  /* =========================
     SUBMIT FORM
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      return alert("Main image is required");
    }

    // Disable button while submitting
    setLoading(true);

    try {
      // Prepare FormData
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));

      formData.append("mainImage", mainImage);
      images.forEach((img) => formData.append("images", img));

      // API call
      await createProductAPI(formData);

      // Reset form
      setForm({ name: "", description: "", price: "", stock: "", category: "" });
      setMainImage(null);
      setImages([]);
      setPreviewMain("");
      setPreviewGallery([]);

      // Navigate to admin products
      navigate("/admin/products");
    } catch (err) {
      console.error("Add Product Error:", err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded shadow max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PRODUCT NAME */}
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {/* PRICE & STOCK */}
        <div className="flex gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* CATEGORY */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
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
          <label className="block mb-1 font-medium">Main Image *</label>
          <input type="file" accept="image/*" onChange={handleMainImageChange} required />
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

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
