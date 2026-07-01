import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sweetcrumb-bakery.vercel.app';

const api = axios.create({
  baseURL: API_URL
});

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const originalGet = api.get.bind(api);

api.get = async (url, config = {}) => {
  if (config.noCache) {
    return originalGet(url, config);
  }

  const cacheKey = url + JSON.stringify(config.params || {});
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await originalGet(url, config);
  cache.set(cacheKey, { data: response, timestamp: Date.now() });
  return response;
};

api.invalidateCache = (pattern) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

export default api;
