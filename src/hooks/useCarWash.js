import { useState } from 'react';
import { createCarWashRecord } from '../api/createRecordApi';

/**
 * Custom hook for car wash booking operations
 */
export const useCarWash = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new car wash booking
   * @param {Object} bookingData - Booking data
   * @param {string} bookingData.plateNumber - Vehicle plate number
   * @param {string} bookingData.washer - Washer/attendant name
   * @param {Array} bookingData.items - Selected items [{name, price}]
   * @param {string} bookingData.paymentMethod - Payment method (cash/transfer)
   * @param {number} bookingData.totalAmount - Total amount
   * @param {string} bookingData.vehicleType - Type of vehicle
   * @returns {Promise<Object>} Response data
   */
  const createBooking = async (bookingData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createCarWashRecord(bookingData);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Booking created successfully'
        };
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while creating the booking';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset error state
   */
  const clearError = () => {
    setError(null);
  };

  return {
    createBooking,
    isLoading,
    error,
    clearError
  };
};