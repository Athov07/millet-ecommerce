import { useState, useEffect } from "react";
import {
  updateProfileImageAPI,
  updateProfileInfoAPI
} from "../../services/authService";
import AddressForm from "../../components/checkout/AddressForm";

const ProfileInfo = ({ user, refreshProfile }) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // sync when user loads/updates
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (!user) return <p>Loading user info...</p>;

  /* =========================
     IMAGE UPLOAD
  ========================= */
  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      await updateProfileImageAPI(formData);
      await refreshProfile();
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PROFILE INFO UPDATE
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ VALIDATIONS
    if (!name.trim()) {
      return setError("Name is required");
    }

    if (!email.trim()) {
      return setError("Email is required");
    }

    if (!email.includes("@")) {
      return setError("Please enter a valid email");
    }

    setLoading(true);

    try {
      await updateProfileInfoAPI({ name, email });
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= PROFILE INFO ================= */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Profile Information</h2>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-primary font-medium hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {/* IMAGE */}
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || "/avatar-placeholder.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />

          <label className="cursor-pointer text-sm text-primary font-medium">
            {loading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* VIEW MODE */}
        {!isEditing && (
          <div className="space-y-1 text-sm">
            <p><strong>Name:</strong> {user.name || "Not provided"}</p>
            <p><strong>Email:</strong> {user.email || "Not provided"}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
          </div>
        )}

        {/* EDIT MODE */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                placeholder="Add your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-primary/30"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ================= ADDRESS SECTION ================= */}
      <div className="border rounded-lg p-4 bg-card">
        <h2 className="text-lg font-semibold mb-3">Saved Addresses</h2>

        {/* reuse existing address logic */}
        <AddressForm onSelect={() => {}} />
      </div>
    </div>
  );
};

export default ProfileInfo;
