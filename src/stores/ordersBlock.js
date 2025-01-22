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
      },
    ]);
    const generateUniqueBlockId = () => nextBlockId++;
    
    const addBlock = () => {
      // Check if there is already an empty block
      const hasEmptyBlock = blocks.value.some((block) => block.symbol === "");
      if (!hasEmptyBlock) {
        blocks.value.unshift({
          id: generateUniqueBlockId(),
          symbol: "",
          isSaved: false,
        });
      }
    };
    
    const removeBlock = (blockId) => {
      // Prevent removing the last block
      if (blocks.value.length > 1) {
        blocks.value = blocks.value.filter((block) => block.id !== blockId);
      }
    };
    return {
      blocks,
      addBlock,
      removeBlock,
    };
  },
  { persist: false }
);
