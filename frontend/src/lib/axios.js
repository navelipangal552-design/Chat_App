/*
Axios is a popular JavaScript library used to make HTTP requests from:
Browser (frontend React, Vue, Angular)
Node.js (backend)
React Native apps

It is basically a tool that lets your JavaScript talk to APIs/servers easily. */

import axios from "axios";

export const axiosInstance = axios.create({ //creates a custom axios object with default settings.
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
  withCredentials: true,
});