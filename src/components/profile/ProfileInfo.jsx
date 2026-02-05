const ProfileInfo = ({ user }) => {
  if (!user) return <p>Loading user info...</p>;

  return (
    <div className="border p-4 rounded space-y-2">
      <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
      <p><strong>Address count:</strong> {user.addresses?.length || 0}</p>
    </div>
  );
};

export default ProfileInfo;
