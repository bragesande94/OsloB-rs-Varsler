var refresh_interval = 4000;
var intervalId, oldVal, newVal, audio_file;

function getStoredAudio(){
  return new Promise(resolve =>{
    chrome.storage.local.get('audio_base64', function(res) {
      add_audio_el(res['audio_base64'])
      resolve(res['audio_base64']);
    });
  });
}

(async () => {
  var promise1 = getStoredAudio();
  var thenedPromise = promise1.then(function(value) {
    audio_file = value;
  });
  await thenedPromise;
})();

async function check_updates() {
  oldVal = await readLocalStorage();
  newVal = $('table')[0].rows[1].cells[0].innerHTML

  if (oldVal != newVal){
    play();
    var data = {}
    data['latest_timestamp'] = newVal
    chrome.storage.local.set(data, function() {
    });
  }
}

setTimeout(() => {
  check_updates()
}, 5000);


function startInterval(id){
  intervalId  = setInterval(function(){
    location.reload();
  }, id)
};

chrome.storage.local.get('refresh_interval', function(res) {
  if (res['refresh_interval']){
    refresh_interval = res['refresh_interval'] * 1000
    audio_file = res['audio_base64']
    clearInterval(intervalId)
    startInterval(refresh_interval);
  }
});

chrome.storage.onChanged.addListener(function (changes){
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if(oldValue != newVal){
      if(key != 'latest_timestamp' && key != 'audio_base64'){
        refresh_interval = newValue * 1000
        console.log('refresh_interval: ', key)
        clearInterval(intervalId)
        startInterval(refresh_interval);
      }
    }else{
      console.log("returning")
    }
  }
});

chrome.runtime.onMessage.addListener(
  function(response) {
    audio_file = response.audio;
    $('#audio').attr('src', audio_file);
  });

function add_audio_el(audio){
  el = document.createElement("audio")
  attr = document.createAttribute("id");
  attr.value = "audio";
  el.setAttributeNode(attr)
  attr = document.createAttribute("style");
  attr.value = "display: none";
  el.setAttributeNode(attr)
  attr = document.createAttribute("src");
  attr.value = audio;
  el.setAttributeNode(attr)
  $('body').append(el)
}

function play(){
  var audio_el = document.getElementById("audio");
  audio_el.play();
}

function readLocalStorage(){
  return new Promise(resolve =>{
    chrome.storage.local.get('latest_timestamp', function(res) {
      resolve(res['latest_timestamp']);
    });
  });
}