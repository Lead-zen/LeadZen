// src/services/lead.js
import api from "./axiosInstance"; // ✅ use shared axios instance

const API_BASE_URL = "/leads"; // baseURL already set in axiosInstance

export const createLead = async (leadData) => {
  const response = await api.post(API_BASE_URL + "/", leadData);
  return response.data;
};

export const listLeads = async (filters = {}) => {
  const response = await api.get(API_BASE_URL + "/", { params: filters });
  return response.data;
};

export const getLeadsCount = async (filters = {}) => {
  const response = await api.get(API_BASE_URL + "/count", { params: filters });
  return response.data;
};

export const getLead = async (leadId) => {
  const response = await api.get(`${API_BASE_URL}/${leadId}`);
  return response.data;
};

export const updateLead = async (leadId, leadData) => {
  const response = await api.put(`${API_BASE_URL}/${leadId}`, leadData);
  return response.data;
};

export const deleteLead = async (leadId) => {
  const response = await api.delete(`${API_BASE_URL}/${leadId}`);
  return response.data;
};
