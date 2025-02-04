const APP_CONFIG = {
  exchange: {
    bybit: {
      apiKey: import.meta.env.VITE_BYBIT_API_KEY,
      secretKey: import.meta.env.VITE_BYBIT_SECRET_KEY,
      main: 'https://api.bybit.com',
      test: 'https://api-testnet.bybit.com',
      wsMain: 'wss://stream.bybit.com',
      wsTest: 'wss://stream-testnet.bybit.com',
      apiVersion: 'v5',
      getURL: function (isTest) {
        const baseURL = isTest ? this.test : this.main;
        return `${baseURL}/${this.apiVersion}`;
      },
    },
  },
};

export default APP_CONFIG;
