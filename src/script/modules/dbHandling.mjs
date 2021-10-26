const src = "https://character-database.becode.xyz/characters";

const getData = async () => {
    const data = await fetch(src);
    return await data.json();
}

const manageChar = async (charObj, method, id) => {
    let source;
    let deleteSource = src.concat('/', charObj);
    let options;
    let putSource = src.concat('/', id);

    if (method === "DELETE") {
        source = deleteSource;
        options = {method: method};
    } else if (method === "PUT"){
        source = putSource;
        options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(charObj)
        }
    } else {
        source = src;
        options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(charObj)
        }
    }
    let response = await fetch(source, options);
    let data = await response;
    console.log(data);
    window.location.reload();
}

export { getData, manageChar };