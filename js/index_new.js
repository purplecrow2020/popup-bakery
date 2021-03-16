const editFormContainer = document.getElementById('editor-panel');
const elementCategories = [];
const popupElements = document.getElementsByClassName('popup-element');
for (let popupElement of popupElements) {
    let elementCategory = popupElement.getAttribute('category');
    if(!elementCategories.includes(elementCategory)){
        elementCategories.push(popupElement.getAttribute('category')); 
    }
    popupElement.addEventListener('click',function(e){
        e.stopPropagation();
        console.log(e.target.getAttribute('key'));
        editThisTag(e.target.tagName.toLowerCase(),e.target.getAttribute('id'));
    })


    popupElement.addEventListener('dblclick',function(e){
        const editableTags = ['p'];
        e.stopPropagation();
        if(editableTags.includes(e.target.tagName.toLowerCase())){
            e.target.contentEditable = true;
        }
    })

    
}   

// console.log(elementCategories);
// &#8722;
// <p id="collapse-state-indicator">&#43;</p>
generateEditElementsViewer();

function selectThisElementForEditView(key){
    let editElements = document.querySelectorAll('.edit-view-elements');
    for(let element of editElements){
        console.log(key , element.getAttribute('key'));
        element.classList.remove('active-edit-element');
        if(element.getAttribute('key') == key){
            console.log('hhhhhhh');
            element.classList.add('active-edit-element');
        }
    }
}

function getElementsContent(category){
    let html= "";
    let els = document.querySelectorAll("[category='"+category+"']");
    for(let el of els){
        let el_html = `<div class="edit-view-elements" style='padding:10px;box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;text-align:center;margin:18px auto;border-radius:10px;' onclick="selectThisElementForEditView('${el.getAttribute('key')}')" key=${el.getAttribute('key')}>${el.getAttribute('key')}</div>`;
        html += el_html
    }
    return html;
}


function generateEditElementsViewer(){
    for (category of elementCategories){
        const content = getElementsContent(category);
        const html = `
                    <div class="collapsible">
                        <p style="padding-left:10px;padding-right:10px;"><strong>${category}</strong><span class="collapsible-content-indicator" style="float:right;">&#43;</span></p>
                    </div>
                    <div class="content">
                        ${content}
                    </div>
                `;

        document.getElementById('element-viewer').innerHTML += html;
    }
}
// box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;


const collapsibleElements = document.getElementsByClassName('collapsible');
for (let collapsibleElement of collapsibleElements) {
    collapsibleElement.addEventListener('click',function(){
        this.classList.toggle("active");
        console.log(this.querySelector('.collapsible-content-indicator'));   
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
            this.querySelector('.collapsible-content-indicator').innerHTML='&#43;';

        } else {
            content.style.display = "block";
            this.querySelector('.collapsible-content-indicator').innerHTML='&#8722;';
        }
    });
}





function editThisTag(tag,elemId){
    console.log(tag,elemId);
    const options = getSupportedEditableProperties(tag);
    let table_html =`
                <tr>
                    <th>
                        feature
                    </th>
                    <th>
                        value
                    </th>
                </tr>
            `;
 
    for(let i=0;i<options.length;i++){
        let row_html;
        const colorRegex = new RegExp('color','i');
        if(colorRegex.test(options[i])){
            row_html =`<tr>
                    <td>${options[i]}</td>
                    <td><input type="color" name=${featureJSPropertyDisplayMapping[options[i]]} value='`+ getOriginalValue(featureJSPropertyDisplayMapping[options[i]],elemId) +`'></td>
                </tr>
            `;
        }else{
            row_html =`<tr>
                        <td>${options[i]}</td>
                        <td><input type="text" name=${featureJSPropertyDisplayMapping[options[i]]} value='`+ getOriginalValue(featureJSPropertyDisplayMapping[options[i]],elemId) +`'></td>
                    </tr>
            `;
        }
        table_html += row_html;
    }


    // <a class="fancy-button pop-onhover bg-gradient3" onClick="previewPrefrences('`+ elemId+`')">preview</a>

    const table_button_html = `
    <tr>
        <td colspan="2">
            <a href="#" class="fancy-button pop-onhover bg-gradient3"  onClick="previewPrefrences('`+ elemId+`')"><span><i class="fa fa-eye"></i>PREVIEW</span></a>
        </td>
    </tr>
`;
    editFormContainer.innerHTML = `<table id="preview">` + table_html + table_button_html + `</table>`;
}



function previewPrefrences(elementId){
    console.log('no not workgng');
    const table = document.querySelectorAll("#preview tr input");
    const element = document.querySelector(`#${elementId}`);
    for(let i = 0; i < table.length;i++){
        let current_value = table[i].value;
        let default_value = table[i].getAttribute('value');
        if(current_value != default_value){
            let property = table[i].getAttribute('name');
            if(featureJSMethodMapping[property] == 'style'){
                element.style[property] = current_value;
            }else{
                let method = featureJSMethodMapping[property];
                element[method] = current_value;
            }
        }
    }
    fixBoxShadows();
}


function fixBoxShadows(){
    const shadow = `inset 0px 0px 0px 10px ${document.querySelector('#popup').style.backgroundColor} ,inset 0px 0px 0px 12px white`;
    document.querySelector('#popup').style.boxShadow = shadow;
}


function getSupportedEditableProperties(tag){
    return tagEditableFeaturesMapping[tag];
}


function getOriginalValue(x,y){
    if(document.querySelector(`#${y}`).style[x] != null) {
        return document.querySelector(`#${y}`).style[x];
    }
    return '';
}


function getHtml(){
    return document.querySelector('#popup-html-container').innerHTML;
}


function resetHtml(){
    let initHtml = localStorage.getItem('initHtml');
    document.querySelector('#popup-html-container').innerHTML = JSON.parse(initHtml);
}

function copyScriptData(){
    str = document.getElementById('script-data').innerHTML;
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Copied the text');
}


const tagEditableFeaturesMapping = {
    p : ['textColor','text','fontSize'],
    input : ['size','placeholderText','width','height','borderRadius'],
    button : ['text','backgroundColor','textColor','fontSize','borderRadius','width','height'],
    img : ['width','height'],
    div : ['backgroundColor']
}


const featureJSPropertyDisplayMapping = {
    placeholderText : 'placeholder',
    textColor : 'color',
    text  : 'text',
    backgroundColor : 'backgroundColor',
    textColor : 'color',
    fontSize : 'font-size',
    borderRadius : 'borderRadius',
    width : 'width',
    height : 'height',
    size : 'size',
    placeholderText : 'placeholder',
    borderRadius : 'borderRadius'
};

const featureJSMethodMapping = {
    'text' : 'innerText' ,
    'font-size': 'style',
    'color' : 'style',
    'backgroundColor': 'style',
    'background-color': 'style',
    'input-length' : 'size',
    'size' : 'size',
    'placeholder' : 'placeholder',
    'width' : 'style',
    'height' : 'style',
    'borderRadius' : 'style'
}
