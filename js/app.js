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

let section = 0;

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
});

//! Add Event to element list
bodyEl.addEventListener("click", function (e) {
  if (e.target && e.target.id == "pokemon") {
    // console.log(e.target.getAttribute('data'));
    sendRequestPokemonData(e.target);
  }
});

//! Add Event Form
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
};
