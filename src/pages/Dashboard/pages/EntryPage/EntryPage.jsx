import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import Services from "./Services/Services";

const EntryPage = () => {
  const navigate = useNavigate();

  const handleServiceClick = (id) => {
    switch(id) {
      case "car":
        navigate("/car");
        break;
      case "jeep":
        navigate("/jeep");
        break;
      case "pick-up":
        navigate("/pick-up");
        break;
      case "bus":
        navigate("/bus");
        break;
      default:
        console.log(`Service ${id} clicked`);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Cars Entry" />
      {/* <Balance /> */}
      <Services handleServiceClick={handleServiceClick} />
    </div>
  );
};

export default EntryPage;
