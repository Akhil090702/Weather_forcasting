const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homefile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
    let temp = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temp = temp.replace("{%tempmin%}", orgVal.main.temp_min);
    temp = temp.replace("{%tempmax%}", orgVal.main.temp_max);
    temp = temp.replace("{%location%}", orgVal.name);
    temp = temp.replace("{%Country%}", orgVal.sys.country);
    temp = temp.replace("{%tempstatus%}", orgVal.weather[0].main);
    // console.log(temp);
    return temp;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${req.query.name}&appid=207b0a81b4ba76fd921bb4861b21c8f6`)

            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // Using map method
                const realtimeData = arrData.map((val) => replaceVal(homefile, val)).join(""); // join to convert into string
                // console.log(realtimeData);
                res.write(realtimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});

server.listen(9000, "127.0.0.1");
