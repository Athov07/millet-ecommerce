import AddressForm from "../../components/checkout/AddressForm";
import { useNavigate } from "react-router-dom";

const AddressPage = () => {
  const navigate = useNavigate();

  const handleSelect = (address) => {
    // ✅ STORE ONLY ID
    localStorage.setItem("selectedAddressId", address._id);
    navigate("/checkout/summary");
  };

  return <AddressForm onSelect={handleSelect} />;
};

export default AddressPage;
