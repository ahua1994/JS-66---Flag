// fetch("https://restcountries.com/v3.1/name/peru")
//     .then((x) => x.json())
//     .then((x) => console.log(x));
// fetch("https://restcountries.com/v2/alpha/{pe}")
//     .then((x) => x.json())
//     .then((x) => console.log(x));

//name,region,capital,population,languages,currencies,borders

const input = document.querySelector("#input");
const search = document.querySelector("#search");
const clear = document.querySelector("#clear");
const error = document.querySelector(".input-section");

const mainCountry = document.querySelector(".main-country");
const nCountries = document.querySelector(".neighbours");

search.addEventListener("click", () => {
    getCountry(input.value);
});

clear.addEventListener("click", () => {
    mainCountry.innerHTML = "";
    nCountries.innerHTML = "";
});

async function getCountry(name) {
    let apiFetch = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    // .then(function (response) {
    //     if (!response.ok) {
    //         let message = error.appendChild(document.createElement("div"));
    //         message.classList.add("alert", "alert-danger", "alert-container");
    //         message.innerHTML = `${response}`;
    //         setTimeout(() => {
    //             document.getElementsByClassName("alert").remove();
    //         }, 2000);
    //     }
    // });

    let country = await apiFetch.json();

    let key = Object.keys(country[0].currencies)[0];
    let currency = Object.values(country[0].currencies[key]);

    mainCountry.innerHTML = `<div class="row justify-content-center pt-5">
    <div class="card col col-6 col-lg-3 p-2">
        <img class="card-img-top" src=${country[0].flags.png} alt="flag">
        <div class="card-body">
            <h4 class="card-title">${country[0].name.common}</h5>
                <p class="card-text">${country[0].region}</p>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><i class="fas fa-2x fa-landmark"></i> ${
                country[0].capital
            }</li>
            <li class="list-group-item"><i class="fas fa-lg fa-users"></i> ${(
                country[0].population / 1000000
            ).toFixed(2)} M</li>
            <li class="list-group-item"><i class="fas fa-lg fa-comments"></i> ${Object.values(
                country[0].languages
            ).join(", ")}</li>
            <li class="list-group-item"><i class="fas fa-lg fa-money-bill-wave"></i> ${currency.join(
                " "
            )}</li>
        </ul>
    </div>
</div>`;

    let border = country[0].borders;
    if (!border) {
        return;
    }

    getNeighbours(border);
}

async function getNeighbours(border) {
    let apiFetch = await fetch(
        `https://restcountries.com/v2/alpha?codes=${border.join(",")}`
    );
    let neighbours = await apiFetch.json();
    let neighbourList = [];

    neighbours.forEach((n) => {
        neighbourList.push(`<div class="card col col-6 col-lg-3 p-2 neighbour">
        <img class="card-img-top" src="${n.flag}" alt="flag">
        <div class="card-body">
            <h4 class="card-title">${n.name}</h5>
                <p class="card-text">${n.region}</p>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><i class="fas fa-2x fa-landmark"></i> ${
                n.capital
            }</li>
            <li class="list-group-item"><i class="fas fa-lg fa-users"></i> ${(
                n.population / 1000000
            ).toFixed(2)} M</li>
            <li class="list-group-item"><i class="fas fa-lg fa-comments"></i> ${
                n.languages[0].name
            }</li>
            <li class="list-group-item"><i class="fas fa-lg fa-money-bill-wave"></i> ${
                n.currencies[0].name
            } ${n.currencies[0].symbol}</li>
        </ul>
    </div>`);
        nCountries.innerHTML = neighbourList.join("");
    });
}

getCountry("canada");
