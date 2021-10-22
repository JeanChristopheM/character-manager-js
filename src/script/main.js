import * as dbHandling from './modules/dbHandling.mjs';
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
    document.querySelector('#submitNewChar').addEventListener('click', () => {
        let newChar = {};
        newChar.name = document.querySelector('#nameInput').value;
        newChar.shortDescription = document.querySelector('#shortDescriptionInput').value;
        newChar.description = document.querySelector('#longDescriptionInput').value;
        //newChar.image = document.querySelector('#imageInput').files[0];
        console.log(newChar);
        dbHandling.manageChar(newChar, 'POST');
    });
    document.querySelector('#deleteCharBtn').addEventListener('click', () => {
        let id = moreDetailsModal.children[0].id;
        dbHandling.manageChar(id, 'DELETE');
    })
}    
app();