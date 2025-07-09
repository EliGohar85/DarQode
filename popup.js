// Popup script for Qlik Sense Dark Mode Extension
document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');
  const buttonText = document.getElementById('buttonText');
  const loading = document.getElementById('loading');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const errorMessage = document.getElementById('errorMessage');
  
  let isDarkMode = false;
  let isQlikPage = false;
  
  // Check if current tab is a Qlik Sense page
  function checkQlikPage(url) {
    return url && (
      url.includes('dataloadeditor'));
  }
  
  // Update UI based on current state
  function updateUI() {
    // Hide loading
    loading.style.display = 'none';
    
    if (!isQlikPage) {
      buttonText.textContent = 'Not a Qlik Sense Data Load Editor page';
      toggleButton.classList.add('disabled');
      toggleButton.disabled = true;
      statusDot.classList.remove('active');
      statusText.textContent = 'Navigate to Qlik Sense Data Load Editor page to use dark mode';
      return;
    }
    
    // Enable button for Qlik pages
    toggleButton.classList.remove('disabled');
    toggleButton.disabled = false;
    
    if (isDarkMode) {
      buttonText.innerHTML = '☀️ Disable Dark Mode';
      statusDot.classList.add('active');
      statusText.textContent = 'Dark mode is active';
    } else {
      buttonText.innerHTML = '🌙 Enable Dark Mode';
      statusDot.classList.remove('active');
      statusText.textContent = 'Dark mode is inactive';
    }
  }
  
  // Show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    loading.style.display = 'none';
    
    buttonText.textContent = 'Error occurred';
    toggleButton.classList.add('disabled');
    toggleButton.disabled = true;
  }
  
  // Initialize popup
  function initialize() {
    // Get current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (!tabs[0]) {
        showError('Cannot access current tab');
        return;
      }
      
      const currentTab = tabs[0];
      isQlikPage = checkQlikPage(currentTab.url);
      
      if (!isQlikPage) {
        updateUI();
        return;
      }
      
      // Send message to content script to get dark mode status
      chrome.tabs.sendMessage(currentTab.id, { action: 'getDarkModeStatus' }, function(response) {
        if (chrome.runtime.lastError) {
          // Content script might not be loaded yet, check storage instead
          chrome.storage.local.get(['qlikDarkMode'], function(result) {
            isDarkMode = result.qlikDarkMode !== false; // Default to true
            updateUI();
          });
        } else if (response) {
          isDarkMode = response.isDarkMode;
          updateUI();
        } else {
          showError('Failed to communicate with page');
        }
      });
    });
  }
  
  // Handle toggle button click
  toggleButton.addEventListener('click', function() {
    if (toggleButton.disabled) return;
    
    // Show loading
    loading.style.display = 'inline-block';
    buttonText.textContent = 'Toggling...';
    toggleButton.disabled = true;
    
    // Get current tab and send toggle message
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (!tabs[0]) {
        showError('Cannot access current tab');
        return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleDarkMode' }, function(response) {
        if (chrome.runtime.lastError) {
          showError('Please refresh the page and try again');
        } else if (response) {
          isDarkMode = response.isDarkMode;
          toggleButton.disabled = false;
          updateUI();                
        } else {
          showError('Failed to toggle dark mode');
        }
      });
    });
  });
  
  // Initialize when popup opens
  initialize();
});