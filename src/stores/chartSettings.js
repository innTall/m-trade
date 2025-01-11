import { defineStore } from "pinia";
import { ref } from "vue";

export const useChartSettingsStore = defineStore("chartSettings", () => {
  const quoteAsset = ref("USDT"); // Default value
  const interval = ref("15"); // Default interval in minutes
  const limit = ref("200"); // Default limit of records

  // Modal state
  const isModalOpen = ref(false);

  // Interval options
  const intervals = [
    { key: "5", label: "5m" },
    { key: "15", label: "15m" },
    { key: "60", label: "1h" },
    { key: "240", label: "4h" },
    { key: "D", label: "D" },
  ];

  // Handle interval change
  const setInterval = (newInterval) => {
    interval.value = newInterval;
  };

  // Toggle modal
  const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value;
  };

  return {
    quoteAsset,
    interval,
    limit,
    isModalOpen,
    intervals,
    toggleModal,
    setInterval,
  };
});
