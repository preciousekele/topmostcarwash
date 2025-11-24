import apiClient from './client';

// Service items that require custom pricing (variable pricing)
const VARIABLE_PRICING_ITEMS = ['rug'];

/**
 * Create a car wash record
 * @param {Object} recordData - The car wash record data
 * @param {string} recordData.plateNumber - Vehicle plate number (optional, can be in items)
 * @param {string} recordData.washer - Washer name (optional, can be in items)
 * @param {Array} recordData.items - Array of selected items {name, price} OR {washerName, serviceItemName, customPrice}
 * @param {string} recordData.paymentMethod - Payment method (cash/transfer)
 * @param {number} recordData.totalAmount - Total amount (optional)
 * @param {string} recordData.carModel - Car model (optional)
 * @param {string} recordData.customerName - Customer name (optional)
 * @param {string} recordData.customerPhone - Customer phone (optional)
 * @param {string} recordData.carNumber - Car number (optional, alternative to plateNumber)
 * @returns {Promise} API response
 */
export const createCarWashRecord = async (recordData) => {
  try {
    // Check if items are already in the correct format (from Rug component)
    const isAlreadyFormatted = recordData.items?.[0]?.serviceItemName !== undefined;

    let transformedData;

    if (isAlreadyFormatted) {
      // Items are already properly formatted (e.g., from Rug component)
      transformedData = {
        carNumber: recordData.carNumber || recordData.plateNumber || 'N/A',
        carModel: recordData.carModel || undefined,
        customerName: recordData.customerName || undefined,
        customerPhone: recordData.customerPhone || undefined,
        paymentMethod: recordData.paymentMethod.toLowerCase(),
        items: recordData.items // Use as-is
      };
    } else {
      // Transform from old format (e.g., from regular CarWash component)
      transformedData = {
        carNumber: recordData.plateNumber || recordData.carNumber,
        carModel: recordData.carModel || undefined,
        customerName: recordData.customerName || undefined,
        customerPhone: recordData.customerPhone || undefined,
        paymentMethod: recordData.paymentMethod.toLowerCase(),
        items: recordData.items.map(item => {
          const itemName = item.name;
          const isVariablePricing = VARIABLE_PRICING_ITEMS.some(
            vp => itemName.toLowerCase().includes(vp)
          );

          const itemData = {
            washerName: recordData.washer,
            serviceItemName: itemName
          };

          // Add customPrice for variable pricing items (like Rug)
          if (isVariablePricing && item.price) {
            itemData.customPrice = item.price;
          }

          return itemData;
        })
      };
    }

    // Remove undefined fields
    Object.keys(transformedData).forEach(key => 
      transformedData[key] === undefined && delete transformedData[key]
    );

    console.log('=== SENDING TO BACKEND ===');
    console.log(JSON.stringify(transformedData, null, 2));
    console.log('========================');

    const response = await apiClient.post('/records/car-wash', transformedData);
    
    console.log('=== BACKEND RESPONSE ===');
    console.log(JSON.stringify(response, null, 2));
    console.log('=======================');
    
    return response;
  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('Error creating car wash record:', error);
    console.error('Error details:', error.response?.data);
    console.error('================');
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

export const getCompanySummaryAllBranches = async (date) => {
  try {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/records/company-summary-all${params}`);
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