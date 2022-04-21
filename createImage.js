/*
	abbiamo la stringa html
	dobbiamo ottenere una immagine
*/

// funzione che crea la stringa HTML rappresentante la card partendo dall'oggetto JSON preso dall'API
function generateParametrizedHTML(returnedJsonObj) {
  console.log(returnedJsonObj);
  /* returnedJsonObj = {
	  IMG_URL: string,
	  ID: number,
	  NAME: string,
	  TYPES: [{
	    slot: ??????
	    type: {
	      url: ???,
	      name: string
	    }
	  }]
	}*/
  var html_string = `
<html>
<head>
  <link rel="stylesheet" href="./style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
    rel="stylesheet"
  />
  <style>
 
body{
    margin: 0;
    font-family: 'Roboto', sans-serif;
}
.card-body {
    border-radius: 20px;
    background-color: #e8e8e8;
    width: fit-content;
}
.description{
    padding-left: 40px;
}
.id {
    color: #a6a6a6;
}
.name {
    text-transform: capitalize;
}
.type{
    display: inline-block;
    width: 20%;
    text-align: center;
    background-repeat:no-repeat; 
    border-radius: 3px;
    text-transform: capitalize;
    margin-right: 5px;
}
.Poison{
    background-color: purple;
    color: white;
}
.Flying{
    color: black;
    background-image:  
    linear-gradient(to right, RGB(110, 175, 233), RGB(110, 175, 233)),
    linear-gradient(to right, RGB(156, 156, 156), RGB(156, 156, 156));
    background-position: 0 0, 
                        0 10;
    background-size: 100% 50%;
}
.Normal {
    color: white;
    background-color: #A8A878
}
.Fire {
    background-color: #F08030
}
.Water {
    background-color: #6890F0
}
.Fighting{
   background-color: #C03028;
}
.Grass{
    background-color: #78C850; 
} 
.Electric {
    background-color: #F8D030
}
.Ground{ 
    background-image:  
    linear-gradient(to right, #F8D030 , #F8D030 ),
    linear-gradient(to right, #B8A038, #B8A038);
    background-position: 0 0, 
                        0 10;
    background-size: 100% 50%;
}
.Psychic{
    background-color: #F85888;
} 
.Rock { 
    background-color: #B8A038
}
.Ice {
    background-color: #98D8D8
}
.Bug{
    background-color:#A8B820
} 
.Dragon {
    background-color: #7038F8
}
.Ghost {
    background-color: #705898
}
.Dark {
    background-color:#705848 
}
.Steel {
    background-color: #B8B8D0
}
.Fairy{ 
    background-color: #EE99AC
}
  </style>
</head>
<body>
  <div class="card-body">
    <img src="${returnedJsonObj.IMG_URL}" alt="immagine del pokemon" />
    <div class="description">
      <p class="id">#${returnedJsonObj.ID}</p>
      <p class="name">${returnedJsonObj.NAME}</p>
`;
  returnedJsonObj.TYPES.forEach((element) => {
    html_string += `<div class="type ${element.type.name}">${element.type.name}</div>`;
  });

  var HTML_term = `
        </div>
        <br />
        <br />
      </div>
    </body>
    </html>
    `;
  html_string += HTML_term;
  return html_string;
}

import nodeHtmlToImage from "node-html-to-image";

export async function createImage(jsonObj) {
  // console.log(poke_json)
  // var jsonObj = JSON.parse(poke_json);

  const returnedJsonObj = {
    NAME: jsonObj.name,
    ID: jsonObj.id,
    IMG_URL: jsonObj.sprites.other["official-artwork"].front_default,
    TYPES: jsonObj.types,
  };

  var generatedHtml = generateParametrizedHTML(returnedJsonObj);
  await nodeHtmlToImage({
    output: `./images/${returnedJsonObj.ID}.png`,
    html: generatedHtml,
    puppeteerArgs: {
      defaultViewport: {
        width: 475,
        height: 457,
      },
    },
    transparent: true,
  }).then(() => console.log("The image was created successfully!"));
}
