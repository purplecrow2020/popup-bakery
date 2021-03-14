const editSelectionContainer = document.getElementById('edit-selection-container');
const viewContainer = document.getElementById('view-container');
const editFormContainer = document.getElementById('edit-form-container');



const viewElements = document.querySelector('#popup-container').children;
const parentContainerElement = `<div style="text-align:center;line-height:100px;background:#e4fbff;flex-grow: 1;border:1px solid black;--hover-color:white;border-radius:10px;margin:0px 3px;" onclick="editThisTag('div','popup-container');">popup</div>`;
editSelectionContainer.innerHTML += parentContainerElement;
for(let elem of viewElements){
    let tag = elem.tagName.toString().toLowerCase();
    let id = elem.getAttribute('id');
    const elementControllerHtml = `<div style="text-align:center;line-height:100px;background:#e4fbff;flex-grow: 1;border:1px solid black;--hover-color:white;border-radius:10px;margin:0px 3px;" onclick="editThisTag('`+ tag +`','`+ id +`');">${elem.getAttribute('key')}</div>`;
    editSelectionContainer.innerHTML += elementControllerHtml;
}

function editThisTag(tag,elemId){
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

    const table_button_html = `
    <tr>
        <td colspan="2">
            <button class="btn" onClick="previewPrefrences('`+ elemId+`')">preview</button>
        </td>
    </tr>
`;
    editFormContainer.innerHTML = `<table id="preview">` + table_html + table_button_html + `</table>`;
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

function previewPrefrences(elementId){
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
    const shadow = `inset 0px 0px 0px 10px ${document.querySelector('#popup-container').style.backgroundColor} ,inset 0px 0px 0px 12px white`;
    document.querySelector('#popup-container').style.boxShadow = shadow;
}

function getHtml(){
    return document.querySelector('#view-container').innerHTML;
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


