import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sweetcrumb-bakery.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000
});

const CACHE_KEY = 'sc_cache';
const CACHE_TTL = 10 * 60 * 1000;

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch { return {}; }
}

function setCache(key, data) {
  try {
    const cache = getCache();
    cache[key] = { data, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function getCached(key) {
  const cache = getCache();
  const entry = cache[key];
  if (entry && Date.now() - entry.ts < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

const originalGet = api.get.bind(api);

api.get = async (url, config = {}) => {
  const cacheKey = url + JSON.stringify(config.params || {});

  const cached = getCached(cacheKey);
  if (cached) {
    originalGet(url, config).then(res => {
      setCache(cacheKey, res.data);
    }).catch(() => {});
    return { data: cached, fromCache: true };
  }

  const response = await originalGet(url, config);
  setCache(cacheKey, response.data);
  return response;
};

api.invalidateCache = (pattern) => {
  try {
    const cache = getCache();
    for (const key of Object.keys(cache)) {
      if (key.includes(pattern)) delete cache[key];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
};

export default api;
