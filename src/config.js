const runtimeConfig = window.__APP_CONFIG__ || {};

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalizedValue = String(value).trim().toLowerCase();

  if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
    return false;
  }

  return fallback;
};

const parseNumber = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const pickValue = (runtimeValue, envValue, fallback) => {
  if (runtimeValue !== undefined && runtimeValue !== null && runtimeValue !== '') {
    return runtimeValue;
  }

  if (envValue !== undefined && envValue !== null && envValue !== '') {
    return envValue;
  }

  return fallback;
};

export const config = {
  USE_MOCKS: parseBoolean(
    pickValue(runtimeConfig.USE_MOCKS, import.meta.env.VITE_USE_MOCKS, true),
    true
  ),

  API_BASE_URL: pickValue(
    runtimeConfig.API_BASE_URL,
    import.meta.env.VITE_API_BASE_URL,
    'http://localhost:8000'
  ),

  MOCK_DELAY: parseNumber(
    pickValue(runtimeConfig.MOCK_DELAY, import.meta.env.VITE_MOCK_DELAY, 500),
    500
  ),

  AUTO_REFRESH: {
    PROCESSES: parseNumber(
      pickValue(
        runtimeConfig.AUTO_REFRESH?.PROCESSES,
        import.meta.env.VITE_AUTO_REFRESH_PROCESSES,
        10000
      ),
      10000
    ),
    METRICS: parseNumber(
      pickValue(
        runtimeConfig.AUTO_REFRESH?.METRICS,
        import.meta.env.VITE_AUTO_REFRESH_METRICS,
        3000
      ),
      3000
    ),
    ENABLED: parseBoolean(
      pickValue(
        runtimeConfig.AUTO_REFRESH?.ENABLED,
        import.meta.env.VITE_AUTO_REFRESH_ENABLED,
        true
      ),
      true
    )
  }
};

export default config;
