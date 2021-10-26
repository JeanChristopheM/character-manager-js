import * as dbHandling from './modules/dbHandling.mjs';
const showdown = window.showdown;
const converter = new showdown.Converter();




const app = async () => {

    
    const moreDetailsModal = document.querySelector('#moreInfoModal');
    const database = await dbHandling.getData();

    for(let item of database) {
        let tpl = document.querySelector('#tpl');
        let clone = document.importNode(tpl.content, true);
        clone.querySelector('h2').textContent = item.name;
        clone.querySelector('p').textContent = item.shortDescription;
        clone.querySelector('img').src = `data:image;base64,${item.image}`;
        clone.querySelector('button').id = item.id;
        document.querySelector('#cardContainer').appendChild(clone);
    }
    const getSpecificPost = (id) => {
        let match;
        for(let item of database) {
            if (item.id === id) {
                match = item;
            }
        }
        return match;
    }
    for (let item of document.querySelectorAll('.viewMore')) {
        item.addEventListener('click', () => {
            let id = item.id;
            let dbEntry = getSpecificPost(id);
            moreDetailsModal.children[0].id = id;
            moreDetailsModal.querySelector('.titleName').textContent = dbEntry.name;
            moreDetailsModal.querySelector('#detailsName').textContent = dbEntry.name;
            moreDetailsModal.querySelector('#detailsShortDescription').textContent = dbEntry.shortDescription;
            moreDetailsModal.querySelector('#detailsLongDescription').innerHTML = dbEntry.description;
            moreDetailsModal.querySelector('#detailsPicture').src = `data:image;base64,${dbEntry.image}`;
        })
    }
    const easyMDE = new EasyMDE({element: document.getElementById('longDescriptionInput')});

    let imgInput = document.querySelector('#imageInput');
    imgInput.addEventListener('change', function (e) {
        if (e.target.files) {
            let imageFile = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement("img");
                img.onload = function (event) {
                    // Dynamically create a canvas element
                    var canvas = document.createElement("canvas");
                    canvas.width = 100;
                    canvas.height = 100;
                    // var canvas = document.getElementById("canvas");
                    var ctx = canvas.getContext("2d");
                    // Actual resizing
                    ctx.drawImage(img, 0, 0, 100, 100);
                    // Show resized image in preview element
                    var dataurl = canvas.toDataURL("image/jpg", 0.7);
                    document.getElementById("preview").src = dataurl;
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(imageFile);
            
        }
    });
    document.querySelector('#submitNewChar').addEventListener('click', () => {
        let newChar = {};
        newChar.name = document.querySelector('#nameInput').value;
        newChar.shortDescription = document.querySelector('#shortDescriptionInput').value;
        let mdText = easyMDE.value();
        let htmlText = converter.makeHtml(mdText)
        newChar.description = htmlText;

        let newSrc = document.querySelector('#preview').src;
        newChar.image = newSrc.slice(22, newSrc.length);
        dbHandling.manageChar(newChar, 'POST');
    });
    document.querySelector('#deleteCharBtn').addEventListener('click', () => {
        let id = moreDetailsModal.children[0].id;
        dbHandling.manageChar(id, 'DELETE');
    })
}    
app();

const searchBar = document.getElementById('searchBar');

searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    console.log(e);

    /* const filteredCharacters = hpCharacters.filter((character) => {
        return (
            character.name.toLowerCase().includes(searchString) ||
            character.house.toLowerCase().includes(searchString)
        );
    });
    displayCharacters(filteredCharacters); */
});


