// Qlik Sense Dark Mode Extension - Content Script
(function () {
  'use strict';

  let isDarkModeEnabled = true;
  let toggleButton = null;
  let currentUrl = window.location.href;
  let urlCheckInterval = null;

  function isQlikSensePage() {
    return window.location.href.includes('dataloadeditor');
  }

  function injectStyles() {
    if (document.getElementById('qlik-dark-mode-styles')) return;
    const styleElement = document.createElement('link');
    styleElement.id = 'qlik-dark-mode-styles';
    styleElement.rel = 'stylesheet';
    styleElement.type = 'text/css';
    styleElement.href = chrome.runtime.getURL('dark-theme.css');
    document.head.appendChild(styleElement);
  }

  function applyDarkToIframe(doc) {
    if (!doc || doc.getElementById('qlik-dark-mode-styles')) return;
    const style = doc.createElement('link');
    style.id = 'qlik-dark-mode-styles';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.runtime.getURL('dark-theme.css');
    doc.head.appendChild(style);
    doc.documentElement.classList.add('qlik-dark-iframe');
  }

  function handleIframeStyling() {
    document.querySelectorAll('iframe').forEach((iframe) => {
      function tryInject(retries = 20) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc?.readyState === 'complete') {
            applyDarkToIframe(doc);
          } else if (retries > 0) {
            requestAnimationFrame(() => tryInject(retries - 1));
          }
        } catch (e) {
          // silently fail
        }
      }
      tryInject();

      iframe.addEventListener('load', () => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) applyDarkToIframe(doc);
        } catch (e) {}
      });
    });
  }

  function observeIframes() {
    const observer = new MutationObserver(() => {
      if (isDarkModeEnabled) handleIframeStyling();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function createToggleButton() {
    if (toggleButton || !isQlikSensePage()) return;

    const isCloud = window.location.hostname.includes('qlikcloud.com');

    toggleButton = document.createElement('button');
    toggleButton.id = 'qlik-dark-toggle';
    toggleButton.innerHTML = isDarkModeEnabled ? '☀️' : '🌙';
    toggleButton.title = isDarkModeEnabled ? 'Toggle Light Mode' : 'Toggle Dark Mode';

    Object.assign(toggleButton.style, {
      position: 'fixed',
      top: '10px',
      right: isCloud ? '140px' : '10px',
      zIndex: '9999',
      width: '30px',
      height: '30px',
      backgroundColor: '#2a2a2a',
      color: '#fff',
      border: '1px solid #555',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease'
    });

    toggleButton.addEventListener('mouseenter', () => {
      toggleButton.style.backgroundColor = '#404040';
      toggleButton.style.transform = 'scale(1.1)';
    });

    toggleButton.addEventListener('mouseleave', () => {
      toggleButton.style.backgroundColor = '#2a2a2a';
      toggleButton.style.transform = 'scale(1)';
    });

    toggleButton.addEventListener('click', toggleDarkMode);
    document.body.appendChild(toggleButton);
  }

  function removeToggleButton() {
    const existing = document.getElementById('qlik-dark-toggle');
    if (existing) existing.remove();
    toggleButton = null;
  }

  function enableDarkMode() {
    if (!isQlikSensePage()) return;

    injectStyles();
    document.documentElement.classList.add('qlik-dark-mode');
    document.body.classList.add('qlik-dark-mode');
    isDarkModeEnabled = true;

    if (toggleButton) {
      toggleButton.innerHTML = '☀️';
      toggleButton.title = 'Toggle Light Mode';
    }

    chrome.storage.local.set({ qlikDarkMode: true });

    handleIframeStyling();
    observeIframes();
  }

  function disableDarkMode() {
    document.documentElement.classList.remove('qlik-dark-mode');
    document.body.classList.remove('qlik-dark-mode');
    isDarkModeEnabled = false;

    const existingStyle = document.getElementById('qlik-dark-mode-styles');
    if (existingStyle) existingStyle.remove();

    if (toggleButton) {
      toggleButton.innerHTML = '🌙';
      toggleButton.title = 'Toggle Dark Mode';
    }

    chrome.storage.local.set({ qlikDarkMode: false });

    document.documentElement.style.background = '';
    document.body.style.background = '';

    document.querySelectorAll('iframe').forEach((iframe) => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const style = doc.getElementById('qlik-dark-mode-styles');
          if (style) style.remove();
          doc.documentElement.classList.remove('qlik-dark-iframe');
          doc.documentElement.style.background = '';
          doc.body.style.background = '';
        }
      } catch (e) {}
    });
  }

  function toggleDarkMode() {
    isDarkModeEnabled ? disableDarkMode() : enableDarkMode();
    chrome.runtime.sendMessage({ action: 'darkModeToggled', isDarkMode: isDarkModeEnabled });
  }

  function handleUrlChange() {
    const isDLE = isQlikSensePage();
    if (isDLE) {
      if (!document.getElementById('qlik-dark-toggle')) createToggleButton();
      enableDarkMode();
    } else {
      removeToggleButton();
      disableDarkMode();
    }
  }

  function initialize() {
    chrome.storage.local.get(['qlikDarkMode'], (result) => {
      isDarkModeEnabled = result.qlikDarkMode !== false;
      handleUrlChange();
    });

    let lastUrl = window.location.href;
    if (urlCheckInterval) clearInterval(urlCheckInterval);
    urlCheckInterval = setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        handleUrlChange();
      }
    }, 500);
  }

  chrome.runtime?.onMessage?.addListener((request, _, sendResponse) => {
    if (request.action === 'toggleDarkMode') {
      toggleDarkMode();
      sendResponse({ status: 'toggled', isDarkMode: isDarkModeEnabled });
    } else if (request.action === 'getDarkModeStatus') {
      sendResponse({ isDarkMode: isDarkModeEnabled });
    }
    return true;
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    setTimeout(initialize, 100);
  }

  window.addEventListener('load', () => {
    setTimeout(initialize, 500);
  });
})();
