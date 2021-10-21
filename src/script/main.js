const app = async () => {
    const src = "https://character-database.becode.xyz/characters/";
    const getData = async () => {
        const data = await fetch(src);
        return await data.json();
    }
    const database = await getData();
    console.log(database);
    for(let item of database) {
        let tpl = document.querySelector('#tpl');
        let clone = document.importNode(tpl.content, true);
        clone.querySelector('h2').textContent = item.name;
        clone.querySelector('p').textContent = item.shortDescription;
        clone.querySelector('img').src = `data:image;base64,${item.image}`;
        document.querySelector('#cardContainer').appendChild(clone);
    }
    const manageChar = (name, shortDescription, description, image, method) => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                name: name,
                shortDescription: shortDescription,
                description: description,
                image: image
            }
        }
        fetch(src, options);
    }
    function getDataUrl(img) {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Set width and height
        canvas.width = img.width;
        canvas.height = img.height;
        // Draw the image
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/jpeg');
    }
}    
app();