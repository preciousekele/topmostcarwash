import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import "./Car.css";
import { useNavigate } from "react-router-dom";
import { useCarWash } from "../../../../../hooks/useCarWash";
import toast, { Toaster } from "react-hot-toast";

const Car = () => {
  const [plateNumber, setPlateNumber] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [washerName, setWasherName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { createBooking, isLoading } = useCarWash();

  const washItems = [
    { id: "car-basic", name: "Basic(Car)", price: 1200 },
    { id: "engine", name: "Engine", price: 2000 },
    { id: "radiator", name: "Radiator", price: 1500 },
    { id: "condenser", name: "Condenser", price: 1500 },
    { id: "seat", name: "Seat(two)", price: 1300 },
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
    if (
      plateNumber &&
      selectedItems.length > 0 &&
      washerName &&
      paymentMethod
    ) {
      setShowModal(true);
    }
  };

  const handleConfirm = async () => {
    setShowModal(false);

    try {
      const bookingData = {
        plateNumber: plateNumber.trim(),
        washer: washerName.trim(),
        items: selectedItems.map((item) => ({
          name: item.name,
          price: item.price,
        })),
        paymentMethod: paymentMethod,
        totalAmount: calculateTotal(),
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        // Reset form
        setPlateNumber("");
        setSelectedItems([]);
        setWasherName("");
        setPaymentMethod("");

        // Show success message
        toast.success(result.message || "Booking created successfully!", {
          duration: 4000,
          position: "top-center",
        });

        // Optional: Navigate to a different page
        // navigate("/userdashboard/home");
      } else {
        toast.error(result.message || "Booking failed. Please try again.", {
          duration: 5000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      toast.error("An error occurred. Please try again.", {
        duration: 5000,
        position: "top-right",
      });
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
                <span className="car-item-price">₦{item.price}</span>
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
            <span className="total-amount">
              ₦{calculateTotal().toLocaleString()}
            </span>
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
            isLoading
          }
        >
          {isLoading ? "Processing..." : "Book Now"}
        </button>
      </div>

      {/* Processing Overlay */}
      {isLoading && (
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
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Car;
