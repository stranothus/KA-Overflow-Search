const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const bodyParser = express.json();
const route = express.static(__dirname + "/public");

const pages = express.Router();
const api = express.Router();

app.use(bodyParser);
app.use("/pages", pages);
app.use("/api", api);
app.use(route);

var client = new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.verow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if(err) reject(err);

        resolve(client);
    });
});

client.then(db => {
    let DB_Questions = db.db("KA").collection("Questions");

    app.get("/", (req, res) => res.redirect("/pages/home"));

    api.get("/search", (req, res) => {
        let queries = req.query;
        let q = queries.q;

        let searchFor = q.split(/(?:"([^"]*)")|\s+/).filter(e => !/^(?:(a)|(the))$/i.test(e)).filter(e => e);

        DB_Questions.find({ content: { $in: searchFor.map(e => new RegExp(e, "i"))}}).toArray((err, results) => {
            if(err) console.error(err);

            results = results.sort((a, b) => {
                let aMatches = searchFor.map(e => a.content.toLowerCase().split(e.toLowerCase()).length - 1).reduce((a, b) => a + b);
                let bMatches = searchFor.map(e => b.content.toLowerCase().split(e.toLowerCase()).length - 1).reduce((a, b) => a + b);
                return  bMatches - aMatches;
            });

            res.json(results);
        });
    });

    api.get("/post", (req, res) => {
        let queries = req.query;
        let key = queries.key;

        DB_Questions.findOne({ key: key }, (err, results) => {
            if(err) console.error(err);

            res.json(results);
        });
    });

    pages.get("/home", (req, res) => {
        res.sendFile(__dirname + "/public/views/home.html");
    });

    pages.get("/question/*", (req, res) => {
        res.sendFile(__dirname + "/public/views/question.html");
    });

    app.listen(3030, () => {
        console.log("Listening on PORT 3030");
    });
});