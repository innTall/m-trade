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
      blocks.value.unshift({
        id: generateUniqueBlockId(),
        symbol: "",
        isSaved: false,
      });
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
