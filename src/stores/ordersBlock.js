import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOrdersBlockStore = defineStore(
  'ordersBlock',
  () => {
    let nextBlockId = 1;
    const blocks = ref([
      // Default block
      {
        id: nextBlockId++,
        symbol: '',
        isSaved: false,
      },
    ]);
    const generateUniqueBlockId = () => nextBlockId++;

    const addBlock = () => {
      // Check if there is already an empty block
      const hasEmptyBlock = blocks.value.some((block) => block.symbol === '');
      if (!hasEmptyBlock) {
        blocks.value.unshift({
          id: generateUniqueBlockId(),
          symbol: '',
          isSaved: false,
        });
      }
    };

    const ensureDefaultBlock = () => {
      if (blocks.value.length === 0) {
        createNewBlock();
      }
    };

    const removeBlock = (blockId) => {
      // Prevent removing the last block
      //if (blocks.value.length > 1) {
      blocks.value = blocks.value.filter((block) => block.id !== blockId);
      ensureDefaultBlock();
      //}
    };

    // Method to scroll to the corresponding block
    const scrollToBlock = (blockId, symbolName = null) => {
      if (symbolName) {
        console.log(`Scrolling to block with symbol: ${symbolName}`);
      } else {
        console.log(`Scrolling to block with ID: ${blockId}`);
      }
      const blockElement = document.getElementById(`block-${blockId}`);
      if (blockElement) {
        blockElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        blockElement.classList.add('highlight');
        setTimeout(() => blockElement.classList.remove('highlight'), 1000);
      }
    };
    ensureDefaultBlock();
    return {
      blocks,
      addBlock,
      removeBlock,
      scrollToBlock,
    };
  },
  { persist: false }
);
