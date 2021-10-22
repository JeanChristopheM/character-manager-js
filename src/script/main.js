import * as dbHandling from './modules/dbHandling.mjs';
const showdown = window.showdown;
const converter = new showdown.Converter();
const app = async () => {

    const moreDetailsModal = document.querySelector('#moreInfoModal');
    const database = await dbHandling.getData();
    const modifyingModal = document.querySelector('#editingModal');

    // DISPLAYING DATABASE WITH TEMPLATES ONTO DOM
    for(let item of database) {
        let tpl = document.querySelector('#tpl');
        let clone = document.importNode(tpl.content, true);
        clone.querySelector('h2').textContent = item.name;
        clone.querySelector('p').textContent = item.shortDescription;
        clone.querySelector('img').src = `data:image;base64,${item.image}`;
        clone.querySelector('button').id = item.id;
        document.querySelector('#cardContainer').appendChild(clone);
    }
    // FUNCTION TO GET THE SPECIFIC ITEM FROM THE DATABASE
    const getSpecificPost = (id) => {
        let match;
        for(let item of database) {
            if (item.id === id) {
                match = item;
            }
        }
        return match;
    }
    // ADDING THE EVENT LISTENERS ON THE VIEW MORE BUTTONS
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
    // INITIALIZING THE MARKDOWN EDITOR
    const easyMDE = new EasyMDE({
        toolbar: [
            {
                name: "bold",
                action: EasyMDE.toggleBold,
                className: "fa fa-bold",
                title: "Bold",
            },
            {
                name: "italics",
                action: EasyMDE.toggleItalic,
                className: "fa fa-italic",
                title: "Italic"
            },
            {
                name: "heading",
                action: EasyMDE.toggleHeadingSmaller,
                className: "fa fa-header",
                title: "Heading"
            },
            "|", // Separator
            {
                name: "quote",
                action: EasyMDE.toggleBlockquote,
                className: "fa fa-quote-left",
                title: "Quote"
            },
            {
                name: "unordered-list",
                action: EasyMDE.toggleUnorderedList,
                className: "fa fa-list-ul",
                title: "Unordered List"
            },
            {
                name: "ordered-list",
                action: EasyMDE.toggleOrderedList,
                className: "fa fa-list-ol",
                title: "Ordered List"
            },
            {
                name: "table",
                action: EasyMDE.drawTable,
                className: "fa fa-table",
                title: "Table"
            },
            "|",
            {
                name: "guide",
                action: "https://www.markdownguide.org/basic-syntax/",
                className: "fa fa-question-circle",
                title: "Guide"
            }
            // [, ...]
        ],
        element: document.getElementById('longDescriptionInput')
    });
    const modifyingMDE = new EasyMDE({
        toolbar: [
            {
                name: "bold",
                action: EasyMDE.toggleBold,
                className: "fa fa-bold",
                title: "Bold",
            },
            {
                name: "italics",
                action: EasyMDE.toggleItalic,
                className: "fa fa-italic",
                title: "Italic"
            },
            {
                name: "heading",
                action: EasyMDE.toggleHeadingSmaller,
                className: "fa fa-header",
                title: "Heading"
            },
            "|", // Separator
            {
                name: "quote",
                action: EasyMDE.toggleBlockquote,
                className: "fa fa-quote-left",
                title: "Quote"
            },
            {
                name: "unordered-list",
                action: EasyMDE.toggleUnorderedList,
                className: "fa fa-list-ul",
                title: "Unordered List"
            },
            {
                name: "ordered-list",
                action: EasyMDE.toggleOrderedList,
                className: "fa fa-list-ol",
                title: "Ordered List"
            },
            {
                name: "table",
                action: EasyMDE.drawTable,
                className: "fa fa-table",
                title: "Table"
            },
            "|",
            {
                name: "guide",
                action: "https://www.markdownguide.org/basic-syntax/",
                className: "fa fa-question-circle",
                title: "Guide"
            }
            // [, ...]
        ],
        element: document.getElementById('modifyingLongDescription')
    });
    // EVENT LISTENER TO CHECK IF USER ADDS IMAGE TO NEW CHARACTER MENU
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

    // HANDLING THE CLICK ON SUBMIT NEW CHAR
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
    // HANDLING THE DELETE BUTTON ON CHAR DELETION
    document.querySelector('#deleteCharBtn').addEventListener('click', () => {
        let id = moreDetailsModal.children[0].id;
        dbHandling.manageChar(id, 'DELETE');
    })

    document.querySelector('#editBtn').addEventListener('click', () => {
        console.log("sending modified");
        let id = moreDetailsModal.children[0].id;
        let dbEntry = getSpecificPost(id);
        modifyingModal.querySelector('#modifyingNameTitle').textContent = dbEntry.name;
        modifyingModal.querySelector('#modifyingName').value = dbEntry.name;
        modifyingModal.querySelector('#modifyingShortDescription').value = dbEntry.shortDescription;
        modifyingMDE.value(converter.makeMarkdown(dbEntry.description));
        //modifyingMDE.cm.refresh();
        modifyingModal.querySelector('#modifyingPreview').src = `data:image;base64,${dbEntry.image}`;
    });
}    
app();