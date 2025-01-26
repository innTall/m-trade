export default {
  main: 'https://api.bybit.com',
  test: 'https://api-testnet.bybit.com',
  wsMain: 'wss://stream.bybit.com',
  wsTest: 'wss://stream-testnet.bybit.com',
  apiVersion: 'v5',
  getURL: function (isTest) {
    const baseURL = isTest ? this.test : this.main;
    return `${baseURL}/${this.apiVersion}`;
  },
};
