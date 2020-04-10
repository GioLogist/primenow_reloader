const prefix = 'primereloader'

let notificationIds = []
let primewNowTab

updatePrimeNowTab();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Receive notification request from other scripts
  if(request.action === `${prefix}:notification:send`){
    chrome.notifications.create('', {
      title: 'PrimeNow has available delivery slots available!',
      message: 'Click here to finalize your order!',
      iconUrl: '../images/icon128.png',
      type: 'basic'
    }, (notificationId) => {
      notificationIds.push(notificationId)
    });
    sendResponse('notification sent')
  }
});

chrome.notifications.onClicked.addListener((notificationId) => {
  // Check notifications we're listening to
  if(notificationIds.includes(notificationId)){
    console.log('background:notifications:onClicked:', notificationId)

    // Switch to prime now
    chrome.tabs.update(primewNowTab, { active: true });

    // Clear notification from tray
    chrome.notifications.clear(notificationId, (wasCleared) => console.log(`background:notifications:wasCleared:${notificationId}`, wasCleared));

    // Remove notificationId from the ones we're listening to
    notificationIds.splice(notificationIds.indexOf(notificationId), 1);

    console.log('background:notifications:notificationIds:', notificationIds)
  }
});

// This isn't "super" optimized, it's triggered on a # of events. Can add some more conditionals @ some point
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(changeInfo.status !== 'complete') return

  updatePrimeNowTab();
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  updatePrimeNowTab();
});

function updatePrimeNowTab(){
  chrome.tabs.query({url: 'https://primenow.amazon.com/checkout*'}, function(tabs) {
    if(!tabs.length)
      return 
    
    console.log('updatePrimeNowTab:', tabs.length, 'matching tabs')
    primewNowTab = tabs[0].id
  })
}