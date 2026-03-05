export const config = {
  USE_MOCKS: true,
  
  API_BASE_URL: 'http://localhost:8000',

  MOCK_DELAY: 500,
  
  AUTO_REFRESH: {
    PROCESSES: 10000,
    METRICS: 30000,
    ENABLED: true
  }
};

export default config;