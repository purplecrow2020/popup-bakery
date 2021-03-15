const collapsibleElements = document.getElementsByClassName('collapsible');
for (let collapsibleElement of collapsibleElements) {
    collapsibleElement.addEventListener('click',function(){
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
          } else {
            content.style.display = "block";
          }
    });
}