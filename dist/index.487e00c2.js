const app = async ()=>{
    const src = "https://character-database.becode.xyz/characters/";
    const getData = async ()=>{
        const data = await fetch(src);
        return await data.json();
    };
    const database = await getData();
    console.log(database);
    for (let item of database){
        let tpl = document.querySelector('#tpl');
        let clone = document.importNode(tpl.content, true);
        clone.querySelector('h2').textContent = item.name;
        clone.querySelector('p').textContent = item.shortDescription;
        clone.querySelector('img').src = `data:image;base64,${item.image}`;
        document.querySelector('#cardContainer').appendChild(clone);
    }
};
app();

//# sourceMappingURL=index.487e00c2.js.map
