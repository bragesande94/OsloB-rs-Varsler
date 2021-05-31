var base64_audio;

chrome.storage.local.get('refresh_interval', function(res) {
  $('#refresh_interval').val(res['refresh_interval']);
});

$("#refresh_interval").keyup(function() {
  if($("#refresh_interval").val().length > 4){
    $("#refresh_interval").val('10000')
  }
});

$("#refresh_interval").focusout(function() {
  if($("#refresh_interval").val() < 6){
    $("#refresh_interval").val('6')
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('submit').addEventListener('click', function(){
    input = document.getElementById('file_upload');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
      }
      else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
      }
      else if (!input.files[0]) {
        document.getElementById('alert').style.color = 'red';
        document.getElementById('alert').style.display = '';
      }
      else {
        insertBgAudio(input)
      }
    });

    document.getElementById('set_refresh').addEventListener('click', function(){
      chrome.runtime.sendMessage({'refresh_interval': $('#refresh_interval').val()})
    });
});

function audioToBase64(audioFile, callback) {

  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function(event) {
        resolve(event.target.result);
    };
    reader.onerror = function(event) {
        reject(event);
    };
    reader.readAsDataURL(audioFile[0]);
  });

}

function insertBgAudio(input) {
  audio = input.files;
  audioToBase64(audio).then(function(data){
    var json = {}
    json['audio_base64'] = data
    chrome.storage.local.set(json, function() {});
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, {"audio": data});
    // });
  })

  document.getElementById('alert').style.display = 'none';
  document.getElementById('submit').style.background = 'rgb(20 20 46)';
  document.getElementById('submit').style.color = 'white';
  document.getElementById('submit').value = 'Submitted ✓';
  document.getElementById('submit').disabled = true;
  document.getElementById('submit').style.cursor = 'no-drop';
  $('.hover').removeClass('hover');
};