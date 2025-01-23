import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalRemoveStore = defineStore('modalRemove', () => {
  const showModalRemove = ref(false);
  const confirmMessage = ref('');
  let confirmCallback = null;

  const openDialog = (message, callback) => {
    confirmMessage.value = message;
    confirmCallback = callback;
    showModalRemove.value = true;
  };

  const confirmAction = () => {
    if (confirmCallback) confirmCallback();
    closeDialog();
  };

  const cancelAction = () => {
    closeDialog();
  };

  const closeDialog = () => {
    showModalRemove.value = false;
    confirmMessage.value = '';
    confirmCallback = null;
  };

  return {
    showModalRemove,
    confirmMessage,
    openDialog,
    confirmAction,
    cancelAction,
  };
});
