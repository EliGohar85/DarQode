// Background script for Qlik Sense Dark Mode Extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default preference on first install
    chrome.storage.local.set({ 'qlikDarkMode': true });
    
    // Open welcome page or show notification
    console.log('Qlik Sense Dark Mode extension installed');
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Send message to content script to toggle dark mode
  chrome.tabs.sendMessage(tab.id, { action: 'toggleDarkMode' }, (response) => {
    if (chrome.runtime.lastError) {
      console.log('Content script not available, opening popup instead');
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'darkModeToggled') {
    // Handle the dark mode toggle notification
    console.log('Dark mode toggled:', request.isDarkMode);
    // You can add additional logic here if needed
    sendResponse({ received: true });
  }
  return true; // Keep the message channel open for async response
});