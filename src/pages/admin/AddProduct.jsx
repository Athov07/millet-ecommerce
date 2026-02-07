import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProductAPI } from "../../services/adminProductService";
import { PRODUCT_CATEGORIES } from "../../constants/productCategories";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    mainImage: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProductAPI(form);
      navigate("/admin/products");
    } catch {
      alert("Failed to add product");
    }
  };

  return (
    <div className="bg-card p-6 rounded shadow max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <select
          name="category"
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

        <input
          name="mainImage"
          placeholder="Main Image URL"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
