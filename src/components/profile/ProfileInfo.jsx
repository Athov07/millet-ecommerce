import { useState } from "react";
import { updateProfileImageAPI } from "../../services/authService";


const ProfileInfo = ({ user, refreshProfile }) => {
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Loading user info...</p>;

  const handleImageChange = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    await updateProfileImageAPI(formData);

    if (typeof refreshProfile === "function") {
      refreshProfile();
    }
  } catch (err) {
    console.error(err);
  }
  };
  
  return (
    <div className="border p-4 rounded space-y-4 bg-card">
      <h2 className="text-lg font-semibold">Profile Information</h2>

      {/* PROFILE IMAGE */}
      <div className="flex items-center gap-4">
        <img
          src={user.avatar || "/avatar-placeholder.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />

        <label className="cursor-pointer text-sm text-primary font-medium">
          {loading ? "Uploading..." : "Edit"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* INFO */}
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
      <p><strong>Address count:</strong> {user.addresses?.length || 0}</p>
    </div>
  );
};

export default ProfileInfo;
