//const defaultHeader = `https://lybit.herokuapp.com/`;
const defaultHeader = `http://localhost:3000/`;
let localcache = [];

window.onbeforeunload = closingCode;

document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlinput');
    const button = document.getElementById('submitbutton');
    const clearButton = document.getElementById('clearbutton');

    const json = JSON.parse(localStorage.getItem('LocalUrlCache'));

    for(let i = json.length - 1; i >= 0; i--) {
        let element = json[i];
        console.log(element.title);
        createCard(element.title, element.original, element.shortened);
    }
   
    button.onclick = () => {
        fetch(defaultHeader, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: urlInput.value
            })
        })
        .then(response => {
            response.json().then( (data) => {
                createCard('Click to Edit Title', urlInput.value, defaultHeader + data.url);
            });
        });
    };

    clearButton.onclick = () => {
        localcache = [];
        document.getElementById('list').innerHTML = '';
    }
})


// function addToLocalCache(original, shortened) {
//     localcache.push({
//         original: original,
//         shortened: shortened
//     })
//     console.log(localcache);
//     closingCode();
// }


function createCard(title, original, shortened) {
    const list = document.getElementById('list');
    list.insertAdjacentHTML('afterbegin', 
        `<div class="card">
            <div class="card-body" id="info">
                <h4 class="card-title" id="title" contenteditable="true">${title}</h4>
                <p class="card-text" id="original">Original Link: ${original}</p>
                <p class="card-text" id="shortened">Shortened Link: ${shortened}</p>
                <button type="button" onclick="copyText(this.id)" id="${shortened}" class="btn btn-primary">Copy Link</button>
            </div>
        </div>`
    );
}


function copyText(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}


function closingCode() {
    localcache = [];
    const elements = document.getElementById('list').children;
    for (let element of elements) {
        const info = element.querySelector('#info');
        localcache.push({
            title: info.querySelector('#title').innerHTML,
            original: info.querySelector('#original').innerHTML.replace("Original Link: ", ""),
            shortened: info.querySelector('#shortened').innerHTML.replace("Shortened Link: ", "")
        })
    }
    localStorage.setItem('LocalUrlCache', JSON.stringify(localcache));
}