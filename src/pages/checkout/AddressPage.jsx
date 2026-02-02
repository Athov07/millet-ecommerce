import AddressForm from "../../components/checkout/AddressForm";
import { useNavigate } from "react-router-dom";

const AddressPage = () => {
  const navigate = useNavigate();

  const handleSelect = (address) => {
    localStorage.setItem(
      "selectedAddress",
      JSON.stringify(address)
    );
    navigate("/checkout/summary");
  };

  return <AddressForm onSelect={handleSelect} />;
};

export default AddressPage;
