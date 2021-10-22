const src = "https://character-database.becode.xyz/characters";

const getData = async () => {
    const data = await fetch(src);
    return await data.json();
}

const manageChar = async (charObj, method) => {
    let source;
    let deleteSource = src.concat('/', charObj);
    let options;
    
    if (method === "DELETE") {
        source = deleteSource;
        options = {method: method};
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
}

export { getData, manageChar };