const express = require("express");
const fs = require("fs");
const app = express();



app.use((req, res, next) => {
    //write your logging code here
    var head = req.headers['user-agent'].replace(",", "") + ",";
    var time = new Date().toISOString() + ",";
    var method = req.method + ",";
    var resource = req.path + ",";
    var version = "HTTP/" + req.httpVersion + ",";
    var status = res.statusCode + "\n";
    var logger = head + time + method + resource + version + status;

    console.log(logger);
    fs.appendFile("server/log.csv", logger, (err) => {
        if (err) throw err;
        next();
    });
});

app.get("/", (req, res) => {
    // write your code to respond "ok" here
    res.sendStatus("200")
});

app.get("/logs", (req, res) => {
    var result = [];
    // write your code to return a json object containing the log data here
    fs.readFile("./server/log.csv", "utf-8", function(err, data) {
        var lines = data.split("/n");
        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].split(",");
            var obj = {};
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = lines[j];
            }
            result.push(obj);
        }
        res.json(result);
    });

});

module.exports = app;