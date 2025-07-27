import axios from 'axios';
import { loadingRef } from '@/lib/loadingStore';

let requestCount = 0;

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  requestCount++;
  loadingRef.set(true);
  return config;
});

instance.interceptors.response.use(
  (res) => {
    requestCount--;
    if (requestCount === 0) loadingRef.set(false);
    return res;
  },
  (err) => {
    requestCount--;
    if (requestCount === 0) loadingRef.set(false);
    return Promise.reject(err);
  }
);

export default instance;
