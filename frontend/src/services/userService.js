// src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Your backend URL

export const getUserById = async (userId, token) => {
  const response = await axios.get(`${API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
