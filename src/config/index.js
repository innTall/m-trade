const PRIVATE_CONFIG = {
  exchange: {
    bybit: {
      isTest: import.meta.env.VITE_BYBIT_TEST === '1',
      api: {
        main: 'https://api.bybit.com/v5',
        test: 'https://api-testnet.bybit.com/v5',
      },
      ws: {
        main: 'wss://stream.bybit.com/v5',
        test: 'wss://stream-testnet.bybit.com/v5',
      },
      keys: {
        main: {
          apiKey: import.meta.env.VITE_BYBIT_API_KEY,
          secretKey: import.meta.env.VITE_BYBIT_SECRET_KEY,
        },
        test: {
          apiKey: import.meta.env.VITE_BYBIT_API_KEY_TEST,
          secretKey: import.meta.env.VITE_BYBIT_SECRET_KEY_TEST,
        },
      },
    },
  },
};

const APP_CONFIG = {
  exchange: {
    bybit: {
      api: PRIVATE_CONFIG.exchange.bybit.isTest
        ? PRIVATE_CONFIG.exchange.bybit.api.test
        : PRIVATE_CONFIG.exchange.bybit.api.main,
      ws: PRIVATE_CONFIG.exchange.bybit.isTest
        ? PRIVATE_CONFIG.exchange.bybit.ws.test
        : PRIVATE_CONFIG.exchange.bybit.ws.main,
      apiKey: PRIVATE_CONFIG.exchange.bybit.isTest
        ? PRIVATE_CONFIG.exchange.bybit.keys.test.apiKey
        : PRIVATE_CONFIG.exchange.bybit.keys.main.apiKey,
      secretKey: PRIVATE_CONFIG.exchange.bybit.isTest
        ? PRIVATE_CONFIG.exchange.bybit.keys.test.secretKey
        : PRIVATE_CONFIG.exchange.bybit.keys.main.secretKey,
    },
  },
};

export default APP_CONFIG;
