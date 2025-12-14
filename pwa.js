// SIMPLE PWA INSTALLATION SCRIPT
console.log('🎵 Music Library PWA loading...');

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// Check PWA installability
function checkPWAStatus() {
    console.log('=== PWA STATUS CHECK ===');
    console.log('Manifest loaded:', !!document.querySelector('link[rel="manifest"]'));
    console.log('Service Worker:', 'serviceWorker' in navigator);
    console.log('Standalone mode:', window.matchMedia('(display-mode: standalone)').matches);
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations()
            .then(regs => console.log('Active SWs:', regs.length));
    }
}

// Run check on load
window.addEventListener('load', checkPWAStatus);