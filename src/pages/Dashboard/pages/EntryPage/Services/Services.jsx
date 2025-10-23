import React from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, CreditCard, Send, TrendingUp, Car, CarFront, Bus } from "lucide-react";
import "./Services.css";

const Services = () => {
  const navigate = useNavigate();

  const serviceItems = [
    { id: "car", label: "Car", icon: CarFront, color: "green" },
    { id: "jeep", label: "Jeep", icon: Car, color: "blue" },
    { id: "pick-up", label: "Pick-Up", icon: CreditCard, color: "orange" },
    { id: "bus", label: "Bus", icon: Bus, color: "teal" },
  ];

  const handleServiceClick = (serviceId) => {
    if (serviceId === "car") {
      navigate("/dashboard/entry/car");
    } else if (serviceId === "jeep") {
      navigate("/dashboard/entry/jeep");
    } else if (serviceId === "pick-up") {
      navigate("/dashboard/entry/pick-up");
    } else if (serviceId === "bus") {
      navigate("/dashboard/entry/bus");
    } else {
      console.log(`${serviceId} clicked`);
    }
  };

  return (
    <div className="services-grid">
      {serviceItems.map((service) => {
        const IconComponent = service.icon;
        return (
          <div
            key={service.id}
            className={`service-item ${service.color}`}
            onClick={() => handleServiceClick(service.id)}
          >
            <IconComponent size={38} />
            <span>{service.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Services;
