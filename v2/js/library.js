
function hidePopup(){
    document.querySelector('#modal').style.display ='none';
}


function loadScript()
{    
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
    head.appendChild(link);
}

window.addEventListener('load',function(){
    console.log('sdsdsdsd');
    const popup = document.getElementById('poptin-popup');
    const popupContainer = document.getElementById('poptin-popup');
    const popupId = popup.getAttribute('popup-code');
    const body = document.querySelector('body');


   
   
    loadScript();
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let popup_template_html = JSON.parse(this.responseText)['popup_html'];
        let popup_html = `
            <div id="modal" onclick="hidePopup()" style="background :rgba(15, 15, 15, 0);width :100%;height :100%;position: absolute;top: 0;left: 0;z-index:1000; onclick="hidePopup()">
                <div id="modal-content" style=" opacity: 1;
                position:absolute;
                top :50%;
                left :50%;
                transform : translate(-50%, -50%);
                z-index:100000;">
                ${popup_template_html}
                </div>
            </div>
        `;

        setTimeout(function(){
            body.innerHTML += popup_html;
        },1000);
    }
    };
    xhttp.open("GET", `http://128.199.19.190:8001/api/get-html/${popupId}`, true);
    xhttp.send();
});

