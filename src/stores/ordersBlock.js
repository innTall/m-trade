import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrdersBlockStore = defineStore(
  "ordersBlock",
  () => {
    let nextBlockId = 1;
    const blocks = ref([
      // Default block
      {
        id: nextBlockId++,
        symbol: "",
        isSaved: false,
        nextOrderId: 2, // Separate order numbering for this block
        orders: [
          {
            id: 1, // First order starts at 1
            buyPrice: null,
            amount: null,
            slPrice: null,
            tpPrice: null,
            selectedSwitch: null,
          },
        ], // Array to hold orders for this block
      },
    ]);
    const generateUniqueBlockId = () => nextBlockId++;
    
    const addBlock = () => {
      // Check if an "empty" block already exists
      //const hasEmptyBlock = blocks.value.some((block) => block.symbol === "");
      //if (!hasEmptyBlock) {
      if (!blocks.value.some((block) => block.symbol === "")) {
        blocks.value.unshift({
          id: generateUniqueBlockId(),
          symbol: "",
          isSaved: false,
          nextOrderId: 2, // Reset order numbering for the new block
          orders: [
            {
              id: 1, // First order for this block
              buyPrice: null,
              amount: null,
              slPrice: null,
              tpPrice: null,
              selectedSwitch: null,
            },
          ],
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
        const newOrderId = block.nextOrderId++;
        block.orders.unshift({
          id: newOrderId, // Use block-specific numbering
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
        if (order && key in order) {
          order[key] = value;
        }
      }
    };

    const updateBlockSymbol = (blockId, newSymbol) => {
      const block = blocks.value.find((b) => b.id === blockId);
      if (block) {
        block.symbol = newSymbol;
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
      updateBlockSymbol,
      updateOrder,
    };
  },
  { persist: false }
);
