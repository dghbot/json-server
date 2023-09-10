const { EventEmitter } = require("events");
const fetch = require("node-fetch");
const express = require("express");
const fs = require("fs");
const app = express();
const dbPath = "./db.json";

class Stater extends EventEmitter {
  constructor(props) {
    super(props);
    this.state = true;
  }

  setState(newState) {
    this.state = newState || false;
    this.emit("set", newState);
  }

  waitForTrue(newState) {
    return new Promise((resolve) => {
      let check = () => {
        if (this.state) {
          this.off("set", check);
          resolve();
        }
      };
      this.on("set", check);
      check();
    });
  }
}

const isOpen = new Stater();

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await isOpen.waitForTrue();
  isOpen.setState(false);
  fs.createReadStream(dbPath).pipe(res);
  isOpen.setState(true);
});

app.post("/", async (req, res) => {
  if (req.headers["Content-Type"] === "application/json")
    return res.status(401).json({
      error: "Invalid Type",
      message: "Content-Type must be application/json",
    });
  await isOpen.waitForTrue();
  isOpen.setState(false);
  req.pipe(fs.createWriteStream(dbPath));
  isOpen.setState(true);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Starting App");
});
keepAlive();

function keepAlive() {
  let url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  if (/(\/\/|\.)undefined\./.test(url)) return;
  setInterval(() => {
    fetch(url).catch(console.log);
  }, 30 * 1000);
}


/**********************************************************
  * @INFO
  * Bot Coded by Sintya4 | https://dghbot.ddns.net/dc
  * @INFO
  * Work for DGH QO Development | https://dghbot.ddns.net
  * @INFO
  * Please mention him / DGH QO Development, when using this Code!
  * @INFO
*********************************************************/
    
