export function showSnackbar({ message, actionText, action, duration = 3000 }) {
  // Create snackbar container
  const snackbar = document.createElement('div');
  snackbar.className =
    'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg shadow-lg px-4 py-3 flex items-center space-x-4 z-50';

  // Add the message
  const messageElement = document.createElement('span');
  messageElement.textContent = message;
  snackbar.appendChild(messageElement);

  // Create action button if actionText and action are provided
  if (actionText && action) {
    const button = document.createElement('button');
    button.className =
      'bg-transparent text-yellow-400 font-semibold hover:underline focus:outline-none';
    button.textContent = actionText;
    button.addEventListener('click', () => {
      action();
      snackbar.remove(); // Remove snackbar after action is triggered
    });
    snackbar.appendChild(button);
  }

  // Append snackbar to the body
  document.body.appendChild(snackbar);

  // Auto-remove the snackbar after the specified duration
  setTimeout(() => {
    snackbar.remove();
  }, duration);
}
