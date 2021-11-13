let app = document.getElementById("app");
let question = document.getElementById("question");
let comments = document.getElementById("comments");
let answers = document.getElementById("answers");

let key = window.location.href.split("/").reverse()[0];

fetch("/api/post?key=" + key)
.then(response => response.json())
.then(data => {
    question.textContent = data.content;

    for(let i = 0; i < data.comments.length; i++) {
        let index = data.comments[i];

        let comment = $create(`<div class = "comment">${index.content}</div>`)

        comments.appendChild(comment);
    }

    for(let i = 0; i < data.answers.length; i++) {
        let index = data.answers[i];

        let answer = $create(`
            <div class = "answer">
                <div id = "content">${index.content}</div>
            </div>
        `);

        for(let e = 0; e < index.comments.length; e++) {
            let endex = index.comments[i];

            let comment = $create(`<div class = "comment">${endex.content}<div>`);

            answer.appendChild(comment);
        }

        answers.appendChild(answer);
    }
});