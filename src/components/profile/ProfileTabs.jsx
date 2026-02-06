import { useState, useEffect } from "react";
import ProfileInfo from "./ProfileInfo";
import MyOrders from "./MyOrders";
import api from "../../services/api";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);

  // MOVE fetchUser HERE
  const fetchUser = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch user info");
    }
  };

  // initial load
  useEffect(() => {
    fetchUser();
  }, []);

  // used after image upload
  const refreshProfile = async () => {
    await fetchUser();
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "profile"
              ? "border-b-2 border-blue-600 font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>

        <button
          className={`px-4 py-2 ${
            activeTab === "orders"
              ? "border-b-2 border-blue-600 font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          My Orders
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <ProfileInfo user={user} refreshProfile={refreshProfile} />
      )}
      {activeTab === "orders" && <MyOrders />}
    </div>
  );
};

export default ProfileTabs;
