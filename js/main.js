const key = "91a361375a95b077366d8085860f86b0";
const baseUrlDarksky = 'https://api.darksky.net/forecast/';
const baseUrlMaps = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';

let latitude = null;
let longitude = null;

let defLang = "uk"

let currentData = moment().format('X') // get the unix timestamp format


/*
    for cross-domain requests
    https://github.com/Rob--W/cors-anywhere/#documentation
*/

const cors_api_host = "https://cors-anywhere.herokuapp.com/";



let nextDay = () => {
    let $nextDay = document.querySelector('#nextDay');
    let $btnPrimary = document.querySelector('.btn-primary');

    if (moment.unix(currentData).format("LL") == moment().format("LL")) {
        $nextDay.setAttribute("disabled", "");
        $btnPrimary.style.cursor = "default";
    }

    $nextDay.addEventListener('click', function() {
        currentData = moment.unix(currentData).add(1, 'days').format('X');
        loadCity(latitude, longitude, currentData);
    });
}

let beforeDay = () => {
    let $beforeDay = document.querySelector('#beforeDay');
    $beforeDay.addEventListener('click', function() {
        currentData = moment.unix(currentData).subtract(1, 'days').format('X');
        loadCity(latitude, longitude, currentData);
    });
}


let renderDOM = (summary, temperature, windSpeed, humidity, icon, cityName) => {

    let $renderDOM = document.querySelector('.renderDOM');

    let skycons = new Skycons({"color": "balck"});
    icon = icon.toUpperCase().replace(/-/g, "_");;

    let textData =
    `<div class="card-body ">
        <h4 class="card-title">${cityName}</h4>
        <h6 class="card-subtitle mb-2 text-muted">${moment.unix(currentData).format("LL")}</h6>
        <div class="card-text">
            <div class="details">
                <h2 id="temperature">${parseInt(temperature) + '\u2103'}</h2>
                <div class="main-info">
                    <canvas id="icon1" width="75" height="75"></canvas>
                    <div id="summary">${summary}</div>
                </div>
            </div>
            <div class="other-info">
                <div id="windSpeed">Вітер: ${windSpeed}м/c</div>
                <div id="humidity">Вологість: ${humidity*100}%</div>
            </div>
        </div>
        <div class="buttons">
            <button id="beforeDay" type="button" class="btn btn-secondary">Назад</button>
            <button id="nextDay" type="button" class="btn btn-primary">Вперед</button>
        </div>
    </div>`;

    $renderDOM.innerHTML = textData;

    skycons.add("icon1", Skycons[icon]);
    skycons.play();

    beforeDay();
    nextDay();
}

let startLoaderAnim = () => {
    let $loader = document.querySelector('.spinner-block');
    let $box    = document.querySelector('.box');
    $loader.classList.remove("visible");
    $box.style.opacity = 0.3;
}

let endLoaderAnim = () => {
    let $loader = document.querySelector('.spinner-block');
    let $box    = document.querySelector('.box');
    $loader.classList.add("visible");
    $box.style.opacity = 1;
}


let loadData = (latitude, longitude, currentData, cityName) => {

    const url = `${cors_api_host}${baseUrlDarksky}${key}/${latitude},${longitude},${currentData}?lang=${defLang}&units=auto`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            const summary     = data.currently.summary;
            const temperature = data.currently.temperature
            const windSpeed   = data.currently.windSpeed;
            const humidity    = data.currently.humidity;
            const icon        = data.currently.icon;

            console.log(data);

            renderDOM(summary, temperature, windSpeed, humidity, icon, cityName);

            endLoaderAnim();
        })
        .catch(e => console.log("Oops, error ::: " + e))

}

let loadCity = (latitude, longitude, currentData) => {

    const url = `${baseUrlMaps}${latitude},${longitude}&sensor=true&language=uk`

    fetch(url)
        .then(response => response.json())
        .then(city => {

            startLoaderAnim();

            const cityName = city.results[1].address_components[2].short_name;

            loadData(latitude, longitude, currentData, cityName)
        })
        .catch(e => console.log("Oops, error ::: " + e))
}

(() => {

    const options = {
        enableHighAccuracy: true,
        timeout: 100000,
        maximumAge: 0
    };

    let success = pos => {
        let crd = pos.coords;

        latitude  = crd.latitude
        longitude = crd.longitude

        loadCity(latitude, longitude, currentData);
    };

    let error = err => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

})();
