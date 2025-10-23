import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import "./Car.css";
import { useNavigate } from "react-router-dom";

const Car = () => {
  const [plateNumber, setPlateNumber] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [washerName, setWasherName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const washItems = [
    { id: "car-basic", name: "Car (Basic)", price: 1200 },
    { id: "engine", name: "Engine", price: 2000 },
    { id: "radiator", name: "Radiator", price: 1500 },
    { id: "condenser", name: "Condenser", price: 1500 },
    { id: "seat", name: "Seat", price: 1300 },
    { id: "floor", name: "Floor", price: 800 },
    { id: "roof", name: "Roof", price: 800 },
    { id: "boot", name: "Boot", price: 800 },
  ];

  const paymentMethods = [
    { id: "cash", name: "Cash" },
    { id: "transfer", name: "Transfer" },
  ];

  const handleItemToggle = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.price, 0);
  };

  const handlePay = () => {
    if (plateNumber && selectedItems.length > 0 && washerName && paymentMethod) {
      setShowModal(true);
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setShowModal(false);

    try {
      // Get token from localStorage (adjust based on your auth implementation)
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const requestBody = {
        plateNumber: plateNumber.trim(),
        items: selectedItems.map(item => ({
          name: item.name,
          price: item.price
        })),
        washer: washerName.trim(),
        paymentMethod: paymentMethod,
        totalAmount: calculateTotal(),
      };

      console.log("Sending booking request:", requestBody);

      const response = await fetch("YOUR_API_ENDPOINT_HERE", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Response status:", response.status);

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);

        if (
          textResponse.includes("<!DOCTYPE html>") ||
          textResponse.includes("<html>")
        ) {
          throw new Error(
            "Server returned HTML page instead of API response. Check if the API endpoint is correct."
          );
        } else {
          throw new Error(`Server returned: ${textResponse}`);
        }
      }

      console.log("Response data:", data);

      if (response.ok) {
        setTimeout(() => {
          setIsProcessing(false);
          console.log("Booking successful:", data);
          // Reset form
          setPlateNumber("");
          setSelectedItems([]);
          setWasherName("");
          setPaymentMethod("");
          alert("Booking successful!");
        }, 2000);
      } else {
        setTimeout(() => {
          setIsProcessing(false);
          const errorMessage =
            data?.message ||
            data?.error ||
            "Booking failed. Please try again.";
          console.error("Booking failed:", errorMessage);
          alert(errorMessage);
        }, 2000);
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      setTimeout(() => {
        setIsProcessing(false);

        let errorMessage = "An error occurred. Please try again.";

        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Unable to connect to server. Please check your internet connection.";
        } else if (error.message.includes("Authentication token not found")) {
          errorMessage = "Please log in again to continue.";
        } else if (error.message.includes("HTML page")) {
          errorMessage = "Server configuration error. Please contact support.";
        } else {
          errorMessage = error.message;
        }

        console.error("Final error:", errorMessage);
        alert(errorMessage);
      }, 2000);
    }
  };

  return (
    <div className="carwash-container">
      <div className="carwash-header">
        <button
          className="back-button"
          onClick={() => navigate("/userdashboard/home")}
        >
          <ArrowLeft size={22} />
        </button>
        <h2>Car Wash Booking</h2>
      </div>

      <div className="carwash-content">
        {/* Plate Number Input */}
        <div className="input-section">
          <label className="input-label">Plate Number</label>
          <input
            type="text"
            placeholder="Enter plate number..."
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            className="plate-input"
          />
        </div>

        <div className="items-section">
          <h3>Select Items to Wash</h3>
          <div className="items-grid">
            {washItems.map((item) => (
              <button
                key={item.id}
                className={`item-button ${
                  selectedItems.find((i) => i.id === item.id) ? "selected" : ""
                }`}
                onClick={() => handleItemToggle(item)}
              >
                <span className="car-item-name">{item.name}</span>
                <span className="car-item-price">{item.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Washer Name Input */}
        <div className="input-section">
          <label className="input-label">Washer (Attendant)</label>
          <input
            type="text"
            placeholder="Enter washer name..."
            value={washerName}
            onChange={(e) => setWasherName(e.target.value)}
            className="washer-input"
          />
        </div>

        {/* Payment Method Selection */}
        <div className="payment-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`payment-button ${
                  paymentMethod === method.id ? "selected" : ""
                }`}
                onClick={() => setPaymentMethod(method.id)}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>

        {/* Total Display */}
        {selectedItems.length > 0 && (
          <div className="total-display">
            <span className="total-label">Subtotal</span>
            <span className="total-amount">₦{calculateTotal().toLocaleString()}</span>
          </div>
        )}

        {/* Book Button */}
        <button
          className="book-button"
          onClick={handlePay}
          disabled={
            !plateNumber ||
            selectedItems.length === 0 ||
            !washerName ||
            !paymentMethod ||
            isProcessing
          }
        >
          {isProcessing ? "Processing..." : "Book Now"}
        </button>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-message">
            <div className="processing-spinner"></div>
            <p className="processing-text">Processing booking...</p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Booking</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="confirm-row">
                <span className="confirm-label">Plate Number</span>
                <span className="confirm-value">{plateNumber}</span>
              </div>

              <div className="confirm-row items-row">
                <span className="confirm-label">Items Washed</span>
                <div className="items-list">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="item-row">
                      <span className="item-name-small">{item.name}</span>
                      <span className="item-price-small">
                        ₦{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="confirm-row">
                <span className="confirm-label">Washer</span>
                <span className="confirm-value">{washerName}</span>
              </div>

              <div className="confirm-row">
                <span className="confirm-label">Payment Method</span>
                <span className="confirm-value">
                  {paymentMethod === "cash" ? "Cash" : "Transfer"}
                </span>
              </div>

              <div className="confirm-row total-row">
                <span className="confirm-label">Total</span>
                <span className="confirm-value">
                  ₦{calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>

            <button
              className="confirm-button"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Car;

