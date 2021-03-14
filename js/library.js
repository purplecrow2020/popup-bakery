const popup = document.getElementById('poptin-popup');
const popupContainer = document.getElementById('poptin-popup');
const popupId = popup.getAttribute('popup-code');

let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let popup_html = JSON.parse(this.responseText)['popup_html'];
    setTimeout(function(){
        document.getElementById("popup-view").innerHTML = popup_html;
    },1000);
  }
};
xhttp.open("GET", `http://localhost:8000/api/get-html/${popupId}`, true);
xhttp.send();



