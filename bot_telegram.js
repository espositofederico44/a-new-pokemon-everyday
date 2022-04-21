import TelegramBot from "node-telegram-bot-api";
import getIdOfTheDay from "./pokemon.js";
import fetch from "node-fetch";
import "dotenv/config";
import { createImage } from "./createImage.js";
import fs from "fs";
import path from "path";

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/pokemon/, async (msg, match) => {
  const chatId = msg.chat.id;
  const id = getIdOfTheDay();

  // http get api per prendere info
  // https://pokeapi.co/api/v2/pokemon/ +  id
  const req = "https://pokeapi.co/api/v2/pokemon/" + id;
  // embed nel messaggio
  // invio

  const res = await fetch(req)
    .then((response) => response.json())
    .then((data) => {
      if (!fs.existsSync(`./images/${data.id}.png`)) {
        // elimina immagini vecchie

        if (!fs.existsSync("images")) {
          // crea la cartella images in caso non esista
          fs.mkdirSync("images");
        } else {
          // cancella tutti i file nella cartella
          var directory = "images";
          fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
              fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err;
              });
            }
          });
        }
        // scarica immagine
        createImage(data).then(() => {
          bot.sendPhoto(chatId, `./images/${data.id}.png`);
        });
      } else {
        bot.sendPhoto(chatId, `./images/${data.id}.png`);
      }
      // per i tipi mettiamo per ogni tipo un'emoji
    });
});

bot.on("polling_error", (error) => {
  console.log(error); // => 'EFATAL'
});
