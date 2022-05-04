import Discord from "discord.js";
import getIdOfTheDay from "./pokemon.js";
import fetch from "node-fetch";
import { createImage } from "./createImage.js";
import fs from "fs";
import path from "path";
import "dotenv/config";

// crea il client
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.content == "/pokemon") {
    const id = getIdOfTheDay();

    // http get api per prendere info
    // https://pokeapi.co/api/v2/pokemon/ +  id
    const req = "https://pokeapi.co/api/v2/pokemon/" + id;
    // embed nel messaggio
    // invio

    const res = await fetch(req)
      .then((response) => response.json())
      .then((data) => {
        // stessa cosa bot telegram
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
            msg.channel.send("daily pokemon", {
              files: [`./images/${data.id}.png`],
            });
          });
        } else {
          msg.channel.send({
            embeds: [
              {
                title: `A wild ${data.name} has appeard!`,
                image: {
                  url: `attachment://pokemon.jpg`,
                },
                url: `https://www.pokemon.com/us/pokedex/${data.name}`,
                /* descrizione e stat */
              },
            ],
            files: [
              {
                attachment: `./images/${data.id}.png`,
                name: "pokemon.jpg",
              },
            ],
          });
        }
      });
  }
});

client.login(process.env.DISCORD_TOKEN);
