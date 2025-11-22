import apiClient from './client';

/**
 * Create a car wash record
 * @param {Object} recordData - The car wash record data
 * @param {string} recordData.plateNumber - Vehicle plate number
 * @param {string} recordData.washer - Washer name
 * @param {Array} recordData.items - Array of selected items {name, price}
 * @param {string} recordData.paymentMethod - Payment method (cash/transfer)
 * @param {number} recordData.totalAmount - Total amount
 * @param {string} recordData.carModel - Car model (optional)
 * @param {string} recordData.customerName - Customer name (optional)
 * @param {string} recordData.customerPhone - Customer phone (optional)
 * @returns {Promise} API response
 */
export const createCarWashRecord = async (recordData) => {
  try {
    // Transform the data to match backend expectations
    const transformedData = {
      carNumber: recordData.plateNumber,
      carModel: recordData.carModel || undefined,
      customerName: recordData.customerName || undefined,
      customerPhone: recordData.customerPhone || undefined,
      paymentMethod: recordData.paymentMethod.toLowerCase(),
      items: recordData.items.map(item => ({
        washerName: recordData.washer,
        serviceItemName: item.name
      }))
    };

    // Remove undefined fields
    Object.keys(transformedData).forEach(key => 
      transformedData[key] === undefined && delete transformedData[key]
    );

    console.log('Sending to API:', transformedData);

    const response = await apiClient.post('/records/car-wash', transformedData);
    return response;
  } catch (error) {
    console.error('Error creating car wash record:', error);
    throw error;
  }
};

/**
 * Get car wash records with optional filters
 * @param {Object} filters - Query filters
 * @param {string} filters.date - Date to filter by (YYYY-MM-DD format)
 * @param {string} filters.washerId - Washer ID to filter by
 * @returns {Promise} API response
 */
export const getCarWashRecords = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.date) {
      params.append('date', filters.date);
    }
    if (filters.washerId) {
      params.append('washerId', filters.washerId);
    }

    const response = await apiClient.get(`/records/car-wash?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error fetching car wash records:', error);
    throw error;
  }
};

/**
 * Get daily payment summary
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} API response with daily summary including washer payments
 */
export const getDailySummary = async (date) => {
  try {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/payments/daily-summary${params}`);
    return response;
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    throw error;
  }
};

/**
 * Get a single car wash record by ID
 * @param {string} id - Record ID
 * @returns {Promise} API response
 */
export const getCarWashById = async (id) => {
  try {
    const response = await apiClient.get(`/records/car-wash/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching car wash record:', error);
    throw error;
  }
};

/**
 * Get daily summary for all washers
 * @param {string} date - Date to get summary for (optional)
 * @returns {Promise} API response
 */

/**
 * Get company daily summary
 * @param {string} date - Date to get summary for (optional)
 * @returns {Promise} API response
 */
// Get company daily summary with items washed breakdown
export const getCompanySummary = async (date = null) => {
  try {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/records/company-summary${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company summary:', error);
    throw error;
  }
};

export const getAllWashersDailySummary = async (date = null) => {
  try {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/records/washers/daily-summary${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching washers summary:', error);
    throw error;
  }
};

// Get single washer's daily summary with detailed items
export const getWasherDailySummary = async (washerId, date = null) => {
  try {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/records/washer/${washerId}/daily-summary${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching washer summary:', error);
    throw error;
  }
};