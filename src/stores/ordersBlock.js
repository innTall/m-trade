import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrdersBlockStore = defineStore(
  "ordersBlock",
  () => {
    let nextBlockId = 1;
    let nextOrderId = 1;
    const blocks = ref([
      // Default block
      {
        id: nextBlockId++,
        symbol: "",
        isSaved: false,
        orders: [], // Array to hold orders for this block
      },
    ]);
    const generateUniqueBlockId = () => nextBlockId++;
    const generateUniqueOrderId = () => nextOrderId++;

    const addBlock = () => {
      // Check if an "empty" block already exists
      const hasEmptyBlock = blocks.value.some((block) => block.symbol === "");
      if (!hasEmptyBlock) {
        blocks.value.unshift({
          id: generateUniqueBlockId(),
          symbol: "",
          isSaved: false,
          orders: [],
        });
      }
    };

    const removeBlock = (blockId) => {
      // Prevent removing the last block
      if (blocks.value.length > 1) {
        blocks.value = blocks.value.filter((block) => block.id !== blockId);
      }
    };

    const addOrderToBlock = (blockId) => {
      const block = blocks.value.find((block) => block.id === blockId);
      if (block) {
        block.orders.unshift({
          id: generateUniqueOrderId(),
          buyPrice: null,
          amount: null,
          slPrice: null,
          tpPrice: null,
          selectedSwitch: null,
        });
      }
    };

    const removeOrderFromBlock = (blockId, orderId) => {
      const block = blocks.value.find((block) => block.id === blockId);
      if (block) {
        block.orders = block.orders.filter((order) => order.id !== orderId);
      }
    };

    // Update an order's properties
    const updateOrder = (blockId, orderId, key, value) => {
      const block = blocks.value.find((block) => block.id === blockId);
      if (block) {
        const order = block.orders.find((order) => order.id === orderId);
        if (order) {
          order[key] = value;
        }
      }
    };

    // Method to scroll to the corresponding block
    const scrollToBlock = (blockId) => {
      const blockElement = document.getElementById(`block-${blockId}`);
      if (blockElement) {
        blockElement.scrollIntoView({ behavior: "smooth", block: "center" });
        blockElement.classList.add("highlight");
        setTimeout(() => blockElement.classList.remove("highlight"), 1000);
      }
    };

    return {
      blocks,
      addBlock,
      removeBlock,
      scrollToBlock,
      addOrderToBlock,
      removeOrderFromBlock,
      updateOrder,
    };
  },
  { persist: false }
);
