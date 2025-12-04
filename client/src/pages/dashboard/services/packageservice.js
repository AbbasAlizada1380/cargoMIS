import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Package-related API calls
export const packageService = {
  // Fetch all packages
  getAllPackages: async () => {
    const res = await axios.get(`${BASE_URL}/packages`);
    return res.data;
  },

  // Create new package
  createPackage: async (packageData) => {
    const res = await axios.post(`${BASE_URL}/packages`, packageData);
    return res.data;
  },

  // Update package
  updatePackage: async (id, packageData) => {
    const res = await axios.put(`${BASE_URL}/packages/${id}`, packageData);
    return res.data;
  },

  // Delete package
  deletePackage: async (id) => {
    const res = await axios.delete(`${BASE_URL}/packages/${id}`);
    return res.data;
  },
 
};
// Zone/country-related API calls
export const zoneService = {
  // Fetch all zones/countries with pricing
  getAllZones: async () => {
    const res = await axios.get(`${BASE_URL}/zone/countries`);
    return res.data;
  },

  // Get price list by country and weight
  getPriceListByCountryAndWeight: async (weight, country) => {
    const res = await axios.get(
      `${BASE_URL}/priceList/lists?country=${country}&weight=${weight}`
    );
    console.log(res.data);
    
    return res.data;
  },

};

