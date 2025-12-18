// PWA INSTALLATION HANDLER
console.log('🎵 Music Library PWA script loaded');

let deferredPrompt = null;
let isInstalled = false;

// Check if already installed
function checkIfInstalled() {
  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isInstalled = true;
    console.log('✅ App is installed (standalone mode)');
    return true;
  }
  
  // Check if running as iOS PWA
  if (window.navigator.standalone === true) {
    isInstalled = true;
    console.log('✅ App is installed (iOS standalone)');
    return true;
  }
  
  return false;
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker update found');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('✅ New Service Worker installed, refresh to update');
            }
          });
        });
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
} else {
  console.warn('⚠️ Service Workers not supported in this browser');
}

// Capture the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🎯 beforeinstallprompt event fired');
  
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Store the event so it can be triggered later
  deferredPrompt = e;
  
  // Update UI to show install button
  showInstallPromotion();
});

// Show install promotion
function showInstallPromotion() {
  console.log('📱 Showing install promotion');
  
  // Show main install button on homepage
  const mainInstallBtn = document.getElementById('mainInstallBtn');
  if (mainInstallBtn) {
    mainInstallBtn.style.display = 'block';
  }
  
  // Create floating install button
  createFloatingInstallButton();
  
  // Update status message
  const installStatus = document.getElementById('installStatus');
  if (installStatus) {
    installStatus.innerHTML = '<p style="color:#00fff7;">✅ Ready to install! Click the button above.</p>';
  }
}

// Create floating install button
function createFloatingInstallButton() {
  // Check if button already exists
  if (document.getElementById('floatingInstallBtn')) return;
  
  const floatingBtn = document.createElement('button');
  floatingBtn.id = 'floatingInstallBtn';
  floatingBtn.innerHTML = '📱 INSTALL APP';
  floatingBtn.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: linear-gradient(145deg, #00fff7, #0088ff);
    color: black;
    border: none;
    padding: 12px 20px;
    border-radius: 50px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 5px 20px rgba(0, 255, 247, 0.5);
    animation: pulse 2s infinite;
  `;
  
  floatingBtn.onclick = () => installApp();
  document.body.appendChild(floatingBtn);
}

// Install the app
window.installApp = async function() {
  console.log('📱 Install button clicked');
  
  // Check if already installed
  if (isInstalled) {
    alert('✅ App is already installed! Open it from your home screen.');
    return;
  }
  
  // Check if we have the deferred prompt
  if (!deferredPrompt) {
    console.log('⚠️ No install prompt available');
    showManualInstallInstructions();
    return;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response: ${outcome}`);
  
  if (outcome === 'accepted') {
    console.log('✅ User accepted the install prompt');
    isInstalled = true;
    
    // Hide install buttons
    const mainBtn = document.getElementById('mainInstallBtn');
    if (mainBtn) mainBtn.style.display = 'none';
    
    const floatingBtn = document.getElementById('floatingInstallBtn');
    if (floatingBtn) floatingBtn.remove();
    
    // Update status
    const installStatus = document.getElementById('installStatus');
    if (installStatus) {
      installStatus.innerHTML = '<p style="color:#00ff88;">✅ App installed successfully!</p>';
    }
    
  } else {
    console.log('❌ User dismissed the install prompt');
  }
  
  // Clear the deferred prompt
  deferredPrompt = null;
};

// Show manual install instructions
function showManualInstallInstructions() {
  const instructions = `
📱 To install this app:

CHROME/EDGE (Desktop):
• Look for the install icon (⊕) in the address bar
• Or click the menu (⋮) → "Install Music Library"

CHROME (Android):
• Tap menu (⋮) → "Add to Home screen"

SAFARI (iPhone/iPad):
• Tap Share button (□↑)
• Scroll down and tap "Add to Home Screen"
• Tap "Add"

SAMSUNG INTERNET:
• Tap menu (≡) → "Add page to" → "Home screen"
  `;
  
  alert(instructions);
}

// Listen for successful installation
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA was installed successfully');
  isInstalled = true;
  
  // Hide install UI
  const floatingBtn = document.getElementById('floatingInstallBtn');
  if (floatingBtn) floatingBtn.remove();
  
  deferredPrompt = null;
});

// Check install status on load
window.addEventListener('load', () => {
  checkIfInstalled();
  
  console.log('=== PWA STATUS ===');
  console.log('Installed:', isInstalled);
  console.log('Manifest:', document.querySelector('link[rel="manifest"]')?.href);
  console.log('Service Worker support:', 'serviceWorker' in navigator);
  
  // If already installed, hide install buttons
  if (isInstalled) {
    const mainBtn = document.getElementById('mainInstallBtn');
    if (mainBtn) mainBtn.style.display = 'none';
    
    const installStatus = document.getElementById('installStatus');
    if (installStatus) {
      installStatus.innerHTML = '<p style="color:#00ff88;">✅ App is installed!</p>';
    }
  }
});

// Monitor online/offline status
window.addEventListener('online', () => {
  console.log('🌐 Back online');
});

window.addEventListener('offline', () => {
  console.log('📴 Offline - app will continue to work');
});