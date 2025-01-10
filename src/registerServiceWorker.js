import { registerSW } from "virtual:pwa-register";
import { showSnackbar } from "./snackbar.js"; // Import a utility or component to show snackbar messages

export function setupServiceWorker() {
  if ("serviceWorker" in navigator) {
    registerSW({
      onRegistered(swRegistration) {
        console.log("Service Worker registered:", swRegistration);
      },
      onNeedRefresh() {
        // Show a snackbar with a refresh button
        showSnackbar({
          message: "New content is available.",
          actionText: "Refresh",
          action: () => window.location.reload(), // Reload the page when the user taps "Refresh"
        });
      },
      onOfflineReady() {
        // Notify that the app is ready to work offline
        showSnackbar({
          message: "App is ready to work offline.",
          duration: 5000, // Optional: auto-hide the snackbar after 5 seconds
        });
      },
      onRegisteredError(error) {
				console.error("Service Worker registration error:", error);
				showSnackbar({
          message: "Failed to register Service Worker.",
          duration: 5000, // Optional: auto-hide the snackbar after 5 seconds
        });
      },
    });
  }
}
