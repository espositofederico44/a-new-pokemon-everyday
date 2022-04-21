import TelegramBot from "node-telegram-bot-api";
import getIdOfTheDay from "./pokemon.js";
import fetch from "node-fetch";
import 'dotenv/config'

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
      // const message = JSON.stringify(data)
      // console.log(message)
      // invia il messaggio
      var message = `Today's pokemon is the number ${data.id} - ${data.name}`;
      const photoURL =
        data.sprites.other["official-artwork"].front_default;
      message += "\ntypes:";
      data.types.forEach((element) => {
        console.log(element);
        message += " " + element.type.name;
      });
      // bot.sendMessage(chatId, message);
      bot.sendPhoto(chatId, photoURL, { caption: message });
      // per i tipi mettiamo per ogni tipo un'emoji
    });
});

bot.on("polling_error", (error) => {
  console.log(error); // => 'EFATAL'
});
