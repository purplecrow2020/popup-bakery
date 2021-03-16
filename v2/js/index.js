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

generateEditElementsViewer();

function selectThisElementForEditView(key){
    let editElements = document.querySelectorAll('.edit-view-elements');
    let els = document.getElementById("popup-html-container").querySelector("[key='"+key+"']");
    let tag = els.tagName.toLowerCase();
    let id = els.getAttribute('id');
    for(let element of editElements){
        element.classList.remove('active-edit-element');
        if(element.getAttribute('key') == key){
            element.classList.add('active-edit-element');
        }
    }
    editThisTag(tag,id);
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
    const options = getSupportedEditableProperties(tag);
    const header_html =`
        <div id="popup-container-header"> 
            EDIT - PROPERTIES
        </div>
    `;
    let table_html =`
                <tr>
                    <th>
                      
                    </th>
                    <th>
                    
                    </th>
                </tr>
            `;
 
    for(let i=0;i<options.length;i++){
        let row_html;
        const colorRegex = new RegExp('color','i');
        if(colorRegex.test(options[i])){
            row_html =`<tr>
                    <td><strong>${optionsDisplayMapping[options[i]]} :</strong></td>
                    <td><input type="color" name=${featureJSPropertyDisplayMapping[options[i]]} value='`+ rgbToHex(getOriginalValue(featureJSPropertyDisplayMapping[options[i]],elemId)) +`'></td>
                </tr>
            `;
        }else{
            row_html =`<tr>
                        <td><strong>${optionsDisplayMapping[options[i]]} :</strong></td>
                        <td><input type="text" name=${featureJSPropertyDisplayMapping[options[i]]} value='`+ getOriginalValue(featureJSPropertyDisplayMapping[options[i]],elemId) +`'></td>
                    </tr>
            `;
        }
        table_html += row_html;
    }


    const table_button_html = `
    <tr>
        <td colspan="2">
            <a href="#" class="fancy-button pop-onhover bg-gradient3"  onClick="previewPrefrences('`+ elemId+`')"><span><i class="fa fa-eye"></i>PREVIEW</span></a>
        </td>
    </tr>
`;
    editFormContainer.innerHTML =header_html +  `<table id="preview">` + table_html + table_button_html + `</table>`;
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
    str = document.getElementById('script-data').innerHTML.replace( /&lt;/g, "<" )
    .replace( /&gt;/g, ">" )
    .replace( /&quot;/g, "\"" );
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Copied the text');

}

function updateScriptData(id){
    let x = `<script type="text/javascript" id="poptin-popup" popup-code="`+id+`" src="./js/library_new.js"></script>`;
    document.querySelector('#script-data').innerText=x;
}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
function rgbToHex(rgb) {
    rgb = rgb.substring(4, rgb.length-1)
         .replace(/ /g, '')
         .split(',');
    let r = parseInt(rgb[0]);
    let g = parseInt(rgb[1]);
    let b = parseInt(rgb[2]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}



const tagEditableFeaturesMapping = {
    p : ['textColor','text','fontSize'],
    input : ['placeholderText','width','height','borderRadius'],
    button : ['text','backgroundColor','textColor','fontSize','borderRadius','width','height'],
    img : ['width','height'],
    div : ['backgroundColor'],
    span : ['textColor','fontSize']
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

let optionsDisplayMapping = {
    textColor : 'TEXT - COLOR',
    text : 'DISPLAY - TEXT',
    fontSize : 'FONT - SIZE',
    placeholderText : 'PLACEHOLDER - TEXT',
    width : 'WIDTH',
    height : 'HEIGHT',
    borderRadius : 'BORDER - RADIUS',
    backgroundColor : 'BACKGROUND - COLOR',
}


function colourNameToHex(color)
{
    var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];

    return color;
}