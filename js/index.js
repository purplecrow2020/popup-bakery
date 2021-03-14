const editSelectionContainer = document.getElementById('edit-selection-container');
const viewContainer = document.getElementById('view-container');
const editFormContainer = document.getElementById('edit-form-container');



const viewElements = document.querySelector('#popup-container').children;
for(let elem of viewElements){
    let tag = elem.tagName.toString().toLowerCase();
    let id = elem.getAttribute('id');
    const elementControllerHtml = `<div style="text-align:center;line-height:100px;background:#e4fbff;flex-grow: 1;border:1px solid black;--hover-color:white;border-radius:10px;margin:0px 3px;" onclick="editThisTag('`+ tag +`','`+ id +`');">${elem.getAttribute('key')}</div>`;
    editSelectionContainer.innerHTML += elementControllerHtml;
}

function editThisTag(tag,elemId){
    const options = getSupportedEditableProperties(tag);
    console.log(options);
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
        <td>
            <button onClick="previewPrefrences('`+ elemId+`')">preview</button>
        </td>
    </tr>
`;
    editFormContainer.innerHTML = `<table id="preview">` + table_html + table_button_html + `</table>`;
}

function getSupportedEditableProperties(tag){
    return tagEditableFeaturesMapping[tag];
}


function getOriginalValue(x,y){
    console.log(x,y);
    console.log(document.querySelector(`#${y}`).style[x]);
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

}


function getHtml(){
    // html = '';
    // let childs = document.querySelector('#popup-container').children;
    // for(childElem of childs){
    //     let elemId = childElem.getAttribute('id');
    //     let [leftOffset, topOffset] =  getPositions(elemId);
    //     let htmlElem = document.querySelector(`#${elemId}`);
    //     htmlElem.style.position = 'absolute';
    //     htmlElem.style.left = leftOffset;
    //     htmlElem.style.top = topOffset;
    // }
    console.log(document.querySelector('#view-container').innerHTML);
}

function getPositions(id){
    let pos = $(`#${id}`).position();
    return [pos.left, pos.top];
    // let pos2 = $("#popup-heading").position();
    // let pos3 = $("#popup-input").position();
    // let pos4 = $("#popup-submit").position();
    // let pos5 = $("#popup-info").position();
    // console.log(pos1.left,pos1.top);
    // console.log(pos2.left,pos2.top);
    // console.log(pos3.left,pos3.top);
    // console.log(pos4.left,pos4.top);
    // console.log(pos5.left,pos5.top);
}

const tagEditableFeaturesMapping = {
    p : ['textColor','text','fontSize'],
    input : ['size','placeholderText','width','height','borderRadius'],
    button : ['text','backgroundColor','textColor','fontSize','borderRadius','width','height'],
    img : ['width','height']
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


