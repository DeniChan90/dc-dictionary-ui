const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 4400;

app.use(express.static(__dirname + "/dist/dc-dictionary-ui"));

app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname + "/dist/dc-dictionary-ui/index.html"));
});

app.listen(port, (err) => {
    if (err) {
        return console.log("something bad happened", err);
    }

    console.log(`server is listening on ${port}`);
});
