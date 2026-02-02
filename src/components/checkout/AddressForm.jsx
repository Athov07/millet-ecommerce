import { useEffect, useState } from "react";
import { getAddressesAPI, addAddressAPI } from "../../services/addressService";

const AddressForm = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  const handleAdd = async (e) => {
    e.preventDefault();
    await addAddressAPI(form);
    setShowForm(false);
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
          className="border p-4 rounded cursor-pointer hover:border-green-600"
        >
          <p className="font-semibold">{addr.fullName}</p>
          <p>{addr.street}, {addr.city}</p>
          <p>{addr.state} - {addr.pincode}</p>
          <p>{addr.phone}</p>
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
        <form onSubmit={handleAdd} className="space-y-3">
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

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Save Address
          </button>
        </form>
      )}
    </div>
  );
};

export default AddressForm;
