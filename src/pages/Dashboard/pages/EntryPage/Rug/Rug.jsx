import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import "./Rug.css";
import { useNavigate } from "react-router-dom";
import { useCarWash } from "../../../../../hooks/useCarWash";
import toast, { Toaster } from "react-hot-toast";

const Rug = () => {
  const [rugPrice, setRugPrice] = useState("");
  const [washerName, setWasherName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { createBooking, isLoading } = useCarWash();

  const paymentMethods = [
    { id: "cash", name: "Cash" },
    { id: "transfer", name: "Transfer" },
  ];

  const handlePay = () => {
    if (rugPrice && washerName && paymentMethod) {
      setShowModal(true);
    }
  };

  const handleConfirm = async () => {
    setShowModal(false);

    try {
      // FIXED: Send data in the correct format expected by backend
      const bookingData = {
        carNumber: "N/A", // Optional for rug wash
        carModel: "N/A", // Optional for rug wash
        customerName: "", // Optional
        customerPhone: "", // Optional
        paymentMethod: paymentMethod,
        items: [
          {
            washerName: washerName.trim(), // Backend expects washerName
            serviceItemName: "Rug", // Backend expects serviceItemName
            customPrice: parseFloat(rugPrice), // Backend expects customPrice for variable pricing
          },
        ],
      };

      console.log("Booking data:", bookingData);
      const result = await createBooking(bookingData);

      if (result.success) {
        // Reset form
        setRugPrice("");
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
        <h2>Rug Wash Booking</h2>
      </div>

      <div className="carwash-content">
        {/* Rug Price Input */}
        <div className="input-section">
          <label className="input-label">Rug Price (₦)</label>
          <input
            type="number"
            placeholder="Enter rug price..."
            value={rugPrice}
            onChange={(e) => setRugPrice(e.target.value)}
            className="plate-input"
            min="0"
            step="100"
          />
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
        {rugPrice && (
          <div className="total-display">
            <span className="total-label">Total Amount</span>
            <span className="total-amount">
              ₦{parseFloat(rugPrice).toLocaleString()}
            </span>
          </div>
        )}

        {/* Book Button */}
        <button
          className="book-button"
          onClick={handlePay}
          disabled={!rugPrice || !washerName || !paymentMethod || isLoading}
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
                <span className="confirm-label">Service</span>
                <span className="confirm-value">Rug Wash</span>
              </div>

              <div className="confirm-row">
                <span className="confirm-label">Price</span>
                <span className="confirm-value">
                  ₦{parseFloat(rugPrice).toLocaleString()}
                </span>
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
                  ₦{parseFloat(rugPrice).toLocaleString()}
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

export default Rug;
