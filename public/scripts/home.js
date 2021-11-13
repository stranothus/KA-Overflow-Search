const search = document.getElementById("search");
const results = document.getElementById("results");

search.onkeyup = async event => {
    if(event.keyCode !== 13) return;
    
    let q = search.value;

    let posts = await fetch("/api/search?q=" + q).then(response => response.json());

    results.innerHTML = "";

    posts.forEach(post => {
        let element = document.createElement("a");

        element.textContent = post.content;
        element.href = "/pages/question/" + post.key;

        results.appendChild(element);
    });
};