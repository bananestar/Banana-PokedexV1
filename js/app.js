/*
 * Created on Fri Jun 24 2022 15:12:10
 *
 * Copyright (c) 2022 Simon Vander Linden
 */

const URL_BASE = "https://pokeapi.co/api/v2/pokemon?offset=_offset_&limit=20";
const URL_BASE_DATA = "https://pokeapi.co/api/v2/pokemon/_name_";

const btnStartEl = document.getElementById("ShowEvents");
const btnNextEl = document.getElementById("NextEvents");
const btnPreviousEl = document.getElementById("PreviousEvents");
const bodyEl = document.getElementById("events");

const displayResult = document.getElementById("displayResult");
const formQuery = document.forms["formQuery"];

const pokedexEl = document.getElementById("pokedex");
const statsEl = document.getElementById("stats");

const typePK = []

let section = 0;

let nbTypePK = 0;
let nbPK = 0;

btnNextEl.style.display = "none";
btnPreviousEl.style.display = "none";

// ! Add Event btn
document.addEventListener("DOMContentLoaded", function () {
  //! Start
  btnStartEl.addEventListener("click", function () {
    sendRequestPokemon(section);
  });
  //! Next
  btnNextEl.addEventListener("click", function () {
    section += 20;
    sendRequestPokemon(section);
  });
  //! Previous
  btnPreviousEl.addEventListener("click", function () {
    section -= 20;
    sendRequestPokemon(section);
  });

  //! Display type and total PK
  if (nbTypePK === 0 && nbPK === 0) {
    const titleTypeEl = document.createElement("h6");
    const titleTotalEl = document.createElement("h6");

    titleTypeEl.textContent = "Nombre de type de pokemon: " + nbTypePK;
    titleTotalEl.textContent = "Nombre total de pokemon: " + nbPK;

    statsEl.appendChild(titleTypeEl);
    statsEl.appendChild(titleTotalEl);
  }
});

//! Add Event to element list
bodyEl.addEventListener("click", function (e) {
  if (e.target && e.target.id == "pokemon") {
    // console.log(e.target.getAttribute('data'));
    sendRequestPokemonData(e.target);
  }
});

//! Add Event to *****************************************
displayResult.addEventListener("click", function (e) {
  // console.log(e.target);
  if (e.target && e.target.id == "pokemonData") {
    // console.log(e.target.getAttribute('data'));
    printDesc(e.target.getAttribute("data"));
  }
  if (e.target && e.target.id == "descrp") {
    sendProcesse();
  }
});

//! Add Event Form Search
formQuery.addEventListener("submit", (event) => {
  const InputnamePK = formQuery["namePK"];
  const namePK = InputnamePK.value;

  event.preventDefault();

  // console.log(namePK);
  sendRequestData(namePK);

  formQuery.reset();
  InputnamePK.focus();
});

//! Request AJAX
const sendGetRequest = (url) => {
  // console.log(url);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", (event) => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            // console.warn(data);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(`Request error ${xhr.status}`);
        }
      }
    });
    xhr.open("GET", url, true);
    xhr.send();
  });
};

//! Request List
const sendRequestPokemon = async (nb) => {
  const url = URL_BASE.replace("_offset_", nb);
  try {
    const data = await sendGetRequest(url);
    displayPK(data);
  } catch (error) {
    console.log(error);
    events.textContent = "error";
  }
};

//! Request IMG LIST
const sendRequestPokemonData = async (pokemon) => {
  const url = URL_BASE_DATA.replace("_name_", pokemon.getAttribute("data"));
  try {
    const data = await sendGetRequest(url);
    // console.log(data);
    displayPKIMG(data, pokemon);
  } catch (error) {
    console.log(error);
    events.textContent = "error";
  }
};

//! Request Search
const sendRequestData = async (pokemon) => {
  const url = URL_BASE_DATA.replace("_name_", pokemon);
  try {
    const data = await sendGetRequest(url);
    // console.log(data);
    printPokemon(data);
  } catch (error) {
    console.log(error);
    displayResult.textContent = "Not Found";
  }
};

//! Request Pokedex
const sendProcesse = async () => {
  const divForm = document.getElementById("displayFormDesc");
  const pokemon = document.getElementById("descPK");

  // console.log(pokemon);
  // console.log(pokemon.getAttribute('data'));
  // console.log(pokemon.value);

  const url = URL_BASE_DATA.replace("_name_", pokemon.getAttribute("data"));
  try {
    const data = await sendGetRequest(url);
    // console.log(data);
    printPokedex(data, pokemon.value);
    divForm.textContent = "";
  } catch (error) {
    console.log(error);
    divForm.textContent = "ERROR";
  }
};

//! Display List
const displayPK = (pokemon) => {
  bodyEl.textContent = "";
  const divEl = document.createElement("div");
  divEl.classList.add("list-group");

  for (let i = 0; i < 20; i++) {
    const btnEl = document.createElement("button");
    btnEl.classList.add("list-group-item", "list-group-item-action");
    btnEl.textContent = pokemon.results[i].name;
    btnEl.setAttribute("id", "pokemon");
    btnEl.setAttribute("data", pokemon.results[i].name);
    divEl.appendChild(btnEl);
  }
  bodyEl.appendChild(divEl);
  if (pokemon.previous != null) {
    btnPreviousEl.style.display = "block";
  } else btnPreviousEl.style.display = "none";
  btnNextEl.style.display = "block";
};

//! Display List IMG
const displayPKIMG = (data, pokemon) => {
  // console.log(data.sprites.front_default);
  // console.log(data.name);
  // console.log(pokemon);

  const imgRemove = document.getElementById("imgPK");
  const div = document.createElement("div");
  const img = document.createElement("img");

  if (imgRemove != null) {
    imgRemove.remove();
  }

  img.src = data.sprites.front_default;
  img.setAttribute("id", "imgPK");
  img.classList.add("img-thumbnail");

  div.appendChild(img);
  pokemon.appendChild(div);
};

//! Display Search
const printPokemon = (pokemon) => {
  // console.log(pokemon);

  const titleEl = document.createElement("h4");
  const imgEl = document.createElement("img");
  const btnAdd = document.createElement("button");
  const divEl = document.createElement("div");

  displayResult.textContent = "";

  titleEl.textContent = pokemon.name;

  imgEl.src = pokemon.sprites.front_default;
  imgEl.classList.add("img-thumbnail");

  displayResult.appendChild(titleEl);
  displayResult.appendChild(imgEl);

  for (let i = 0; i < pokemon.types.length; i++) {
    const h6El = document.createElement("h6");
    h6El.textContent = "type " + (i + 1) + " : " + pokemon.types[i].type.name;
    displayResult.appendChild(h6El);
  }

  for (let i = 0; i < pokemon.abilities.length; i++) {
    const pEl = document.createElement("p");
    pEl.textContent =
      "Ability " + (i + 1) + ": " + pokemon.abilities[i].ability.name;

    displayResult.appendChild(pEl);
  }

  btnAdd.classList.add("btn", "btn-success");
  btnAdd.setAttribute("id", "pokemonData");
  btnAdd.setAttribute("data", pokemon.name);
  btnAdd.textContent = "add";

  displayResult.appendChild(btnAdd);

  divEl.setAttribute("id", "displayFormDesc");

  displayResult.appendChild(divEl);
};

//! Display TextArea for Disc
const printDesc = (pokemon) => {
  // console.log(pokemon);

  const divForm = document.getElementById("displayFormDesc");
  divForm.textContent = "";

  const formEl = document.createElement("div");
  const divEl = document.createElement("div");
  const labelEl = document.createElement("label");
  const textAreaEl = document.createElement("textarea");
  const btnConfirmEl = document.createElement("button");

  formEl.classList.add("mt-4");

  divEl.classList.add("form-group");

  labelEl.setAttribute("for", "descPK");
  labelEl.textContent = "Description";

  textAreaEl.classList.add("form-control");
  textAreaEl.setAttribute("id", "descPK");
  textAreaEl.setAttribute("data", pokemon);
  textAreaEl.placeholder = "description for pokemon";
  textAreaEl.required = true;

  btnConfirmEl.classList.add("btn", "btn-danger");
  btnConfirmEl.setAttribute("id", "descrp");
  btnConfirmEl.textContent = "confirm Add";

  labelEl.appendChild(textAreaEl);
  divEl.appendChild(labelEl);
  formEl.appendChild(divEl);
  formEl.appendChild(btnConfirmEl);
  divForm.appendChild(formEl);
};

//! Display Pokedex
const printPokedex = (pokemon, desc) => {
  console.log(pokemon);
  console.log(desc);

  for (let i = 0; i < pokemon.types.length; i++) {
    // console.log(pokemon.types.length);
    let type = pokemon.types[i].type.name
    
    if (typePK.includes(type)) {
      console.log('le type est deja include '+type);
      console.table(typePK);
    }else{
      typePK.push(type)
      nbTypePK++
      console.log('le type n\'est pas include '+type);
    }
  }
  console.table(typePK);
  nbPK++


  const articleEl = document.createElement('article')
  articleEl.classList.add('ml-4')
  articleEl.id = pokemon.name + nbPK

  const divEl = document.createElement('div')
  
  const titleEl = document.createElement('h5')
  titleEl.textContent = 'n°: '+nbPK+' '+pokemon.name

  const imgEl = document.createElement('img')
  imgEl.src = pokemon.sprites.front_default;
  imgEl.classList.add("img-thumbnail");

  const descTitleEl = document.createElement('h6')
  const descEl = document.createElement('p')
  descEl.textContent = desc

  divEl.appendChild(titleEl)
  divEl.appendChild(imgEl)
  divEl.appendChild(descTitleEl)
  divEl.appendChild(descEl)
  articleEl.appendChild(divEl)
  pokedexEl.appendChild(articleEl)

  statsEl.textContent = ''

  const titleTypeEl = document.createElement("h6");
  const titleTotalEl = document.createElement("h6");

  titleTypeEl.textContent = "Nombre de type de pokemon: " + nbTypePK;
  titleTotalEl.textContent = "Nombre total de pokemon: " + nbPK;

  statsEl.appendChild(titleTypeEl);
  statsEl.appendChild(titleTotalEl);
};
