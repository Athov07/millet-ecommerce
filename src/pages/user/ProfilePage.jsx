import ProfileTabs from "../../components/profile/ProfileTabs";

const ProfilePage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <ProfileTabs />
    </div>
  );
};

export default ProfilePage;
