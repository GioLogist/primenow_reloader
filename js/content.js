const prefix = 'primereloader'
const minutes_retry = 1

checkForAvailability();

function sentNotification(){
  chrome.runtime.sendMessage({action: `${prefix}:notification:send`}, function(response) {
    if(response === 'notification sent'){
      console.log('notification sent successfully')
    } else {
      console.error('notification not sent')
    }
  });
}

function checkForAvailability(){
  if(!(window.location.host === 'primenow.amazon.com' && window.location.pathname === '/checkout/enter-checkout')){
    return false;
  }

  // Do we have any avialable times?
  let availableTimes = document.querySelectorAll('input[name=delivery-window-radio]:not([disabled])')

  // Nothing available, let's try again later
  if(!availableTimes.length){

    console.log(`No avaiable times, will try again in ${minutes_retry} minutes`)
    setTimeout(() => {
      window.location.reload();
    }, 1000 * 60 * minutes_retry);

    return false
  }

  console.log('availableTimes', availableTimes.length, 'available')
  sentNotification()
}