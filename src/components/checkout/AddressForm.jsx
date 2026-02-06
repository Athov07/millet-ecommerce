import { useEffect, useState } from "react";
import {
  getAddressesAPI,
  addAddressAPI,
  updateAddressAPI,
  deleteAddressAPI
} from "../../services/addressService";

const AddressForm = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const res = await getAddressesAPI();
    setAddresses(res.data.addresses);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateAddressAPI(editingId, form);
    } else {
      await addAddressAPI(form);
    }

    resetForm();
    fetchAddresses();
  };

  const handleEdit = (addr, e) => {
    e.stopPropagation(); // 🔥 prevent select
    setForm(addr);
    setEditingId(addr._id);
    setShowForm(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // 🔥 prevent select
    await deleteAddressAPI(id);
    fetchAddresses();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold">Select Delivery Address</h2>

      {addresses.length === 0 && (
        <p>No address found. Please add one.</p>
      )}

      {addresses.map((addr) => (
        <div
          key={addr._id}
          onClick={() => onSelect(addr)}
          className="border p-4 rounded cursor-pointer hover:border-green-600 flex justify-between"
        >
          <div>
            <p className="font-semibold">{addr.fullName}</p>
            <p>{addr.street}, {addr.city}</p>
            <p>{addr.state} - {addr.pincode}</p>
            <p>{addr.phone}</p>
          </div>

          {/* 🔹 ACTION BUTTONS */}
          <div className="flex gap-3 items-start">
            <button
              onClick={(e) => handleEdit(addr, e)}
              className="text-blue-600 text-sm"
            >
              Edit
            </button>
            <button
              onClick={(e) => handleDelete(addr._id, e)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="text-green-600 underline"
        >
          + Add New Address
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              placeholder={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full border p-2"
              required
            />
          ))}

          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              {editingId ? "Update Address" : "Save Address"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressForm;
