import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import "./Rug.css";
import { useNavigate } from "react-router-dom";

const Rug = () => {
  const [rugPrice, setRugPrice] = useState("");
  const [washerName, setWasherName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

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
    setIsProcessing(true);
    setShowModal(false);

    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const requestBody = {
        rugPrice: parseFloat(rugPrice),
        washer: washerName.trim(),
        paymentMethod: paymentMethod,
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
          setRugPrice("");
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
          <label className="input-label">Attendant Name</label>
          <input
            type="text"
            placeholder="Enter attendant name..."
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
          disabled={
            !rugPrice ||
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
                <span className="confirm-label">Rug Price</span>
                <span className="confirm-value">
                  ₦{parseFloat(rugPrice).toLocaleString()}
                </span>
              </div>

              <div className="confirm-row">
                <span className="confirm-label">Attendant</span>
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

export default Rug;