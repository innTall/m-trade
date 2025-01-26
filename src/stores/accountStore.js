import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import ByBit from '@/api/bybit'; // Adjust the import path to your `getSymbols` function

export const useAccountStore = defineStore('accountStore', () => {
  const account = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  const fetchAccount = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await ByBit.getAccountInfo();
      if (result) {
        account.value = result;
      } else {
        account.value = [];
        error.value = 'No account found.';
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch account.';
    } finally {
      loading.value = false;
    }
  };

  const usdtBalance = computed(() => {
    if (account.value) {
      return (
        account.value[0].coin.find(({ coin }) => coin === 'USDT')
          .walletBalance || '0'
      );
    }
    return '0';
  });

  return {
    account,
    usdtBalance,
    fetchAccount,
  };
});
