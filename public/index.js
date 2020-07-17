const defaultHeader = `https://lybit.herokuapp.com/`;

let localcache = [];


document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlinput');
    const button = document.getElementById('submitbutton');

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
                createCard(urlInput.value, defaultHeader + data.url);
            });
        });
    };
})


function addToLocalCache(original, shortened) {
    localcache.push({
        original: original,
        shortened: shortened
    })
}


function createCard(original, shortened) {
    const list = document.getElementById('list');
    list.insertAdjacentHTML('afterbegin', 
        `<div class="card">
            <div class="card-body">
                <h4 class="card-title" contenteditable="true">Click to edit title</h4>
                <p class="card-text">Original Link: ${original}</p>
                <p class="card-text">Shortened Link: ${shortened}</p>
                <button type="button" onclick="copyText(this.id)" id="${shortened}" class="btn btn-primary">Copy Link</button>
            </div>
        </div>`
    );
    addToLocalCache(original, shortened);
    console.log(localcache);
}


function copyText(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
