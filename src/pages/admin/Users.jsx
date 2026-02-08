import { useEffect, useState } from "react";
import { getAllUsersAPI } from "../../services/adminService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsersAPI();
        setUsers(res.data.users || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // counts
  const totalUsers = users.length;
  const userCount = users.filter((u) => u.role === "user").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  // search filter
  const filteredUsers = users.filter((user) =>
    user.phone?.includes(searchPhone)
  );

  // UI-only remove
  const handleRemoveUser = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?"
    );
    if (!confirmDelete) return;

    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  if (loading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  return (
    <div className="bg-card p-6 rounded shadow">
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>

        <input
          type="text"
          placeholder="Search by phone..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-60 focus:outline-none focus:ring focus:ring-primary/30"
        />
      </div>

      {/* stats */}
      <div className="flex gap-4 mb-4 text-sm">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
          Total Users: {totalUsers}
        </span>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
          Users: {userCount}
        </span>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded">
          Admins: {adminCount}
        </span>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="text-left text-sm">
            <tr>
              <th className="p-3 border">Sr No</th>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Verified</th>
              <th className="p-3 border">State</th>
              <th className="p-3 border">Pincode</th>
              <th className="p-3 border">Created</th>
              <th className="p-3 border text-center">Remove</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan="10"
                  className="p-4 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}

            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition text-sm"
              >
                {/* SR NO */}
                <td className="p-3 border text-center">
                  {index + 1}
                </td>

                <td className="p-3 border text-xs text-gray-500 text-center">
                  {user._id}
                </td>

                <td className="p-3 border font-medium">
                  {user.name || "—"}
                </td>

                <td className="p-3 border text-center">{user.phone}</td>

                <td className="p-3 border capitalize">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-3 border text-center">
                  {user.isVerified ? "Yes" : "No"}
                </td>

                <td className="p-3 border text-center">
                  {user.addresses?.[0]?.state || "—"}
                </td>

                <td className="p-3 border text-center">
                  {user.addresses?.[0]?.pincode || "—"}
                </td>

                <td className="p-3 border text-center">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* REMOVE (TEXT ONLY) */}
                <td className="p-3 border text-center">
                  {user.role === "admin" ? (
                    <span className="text-gray-400 text-xs">
                      Protected
                    </span>
                  ) : (
                    <span
                      onClick={() => handleRemoveUser(user._id)}
                      className="text-red-600 cursor-pointer hover:underline text-xs"
                    >
                      Remove
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
