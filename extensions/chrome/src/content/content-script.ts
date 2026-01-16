/**
 * DevTools Hub Chrome Extension - Content Script
 * Handles text selection and result display
 */

// Toast notification styles
const TOAST_STYLES = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  z-index: 2147483647;
  max-width: 400px;
  word-wrap: break-word;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: devtools-hub-slide-in 0.3s ease-out;
`;

const SUCCESS_STYLES = `
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
`;

const ERROR_STYLES = `
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
`;

// Inject animation styles
function injectStyles() {
  if (document.getElementById('devtools-hub-styles')) return;

  const style = document.createElement('style');
  style.id = 'devtools-hub-styles';
  style.textContent = `
    @keyframes devtools-hub-slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes devtools-hub-slide-out {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Show toast notification
function showToast(message: string, isError: boolean = false) {
  injectStyles();

  // Remove existing toasts
  document.querySelectorAll('.devtools-hub-toast').forEach(el => el.remove());

  const toast = document.createElement('div');
  toast.className = 'devtools-hub-toast';
  toast.style.cssText = TOAST_STYLES + (isError ? ERROR_STYLES : SUCCESS_STYLES);

  const icon = isError ? '⚠️' : '✓';
  toast.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;

  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'devtools-hub-slide-out 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Copy text to clipboard
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position: fixed; left: -9999px; top: -9999px;';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// Get selected text
function getSelectedText(): string {
  const selection = window.getSelection();
  return selection?.toString() || '';
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_SELECTION') {
    sendResponse({ text: getSelectedText() });
    return;
  }

  if (message.type === 'DEVTOOLS_HUB_RESULT') {
    const { result, toolId } = message;

    // Copy result to clipboard
    copyToClipboard(result).then((success) => {
      if (success) {
        const toolName = toolId.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
        showToast(`${toolName}: Copied to clipboard!`);
      } else {
        showToast('Failed to copy to clipboard', true);
      }
    });
    return;
  }

  if (message.type === 'DEVTOOLS_HUB_ERROR') {
    showToast(`Error: ${message.error}`, true);
    return;
  }
});

// Notify that content script is ready
console.log('[DevTools Hub] Content script loaded');
