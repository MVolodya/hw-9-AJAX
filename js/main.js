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



let button = () => {
    let $beforeDay = document.querySelector('#beforeDay');
    $beforeDay.addEventListener('click', function() {
        currentData = moment.unix(currentData).subtract(1, 'days').format('X');
        loadCity(latitude, longitude, currentData);
    });

    let $nextDay = document.querySelector('#nextDay');
    $nextDay.addEventListener('click', function() {
        currentData = moment.unix(currentData).add(1, 'days').format('X');
        loadCity(latitude, longitude, currentData);
    });
}



let renderDOM = (summary, temperature, windSpeed, humidity, icon, cityName) => {


    let $renderDOM    = document.querySelector('.renderDOM');
    let skycons = new Skycons({"color": "balck"});
    icon = icon.toUpperCase().replace(/-/g, "_");;

/*
    /*let $cardTitle    = document.querySelector('.card-title');
    let $cardSubtitle = document.querySelector('.card-subtitle');
    let $temperature  = document.querySelector('#temperature');
    let $summary      = document.querySelector('#summary');
    let $windSpeed    = document.querySelector('#windSpeed');
    let $humidity     = document.querySelector('#humidity');

    let setCityName    = document.createTextNode(cityName);
    let setCurrentData = document.createTextNode((moment.unix(currentData).format("LL")));
    let setTemperature = document.createTextNode(parseInt(temperature) + '\u2103');
    let setSummary     = document.createTextNode(summary);
    let setWindSpeed   = document.createTextNode(`Вітер: ${windSpeed}м/c`);
    let setHumidity    = document.createTextNode(`Вологість: ${humidity*100}%`);

    $cardTitle.appendChild(setCityName);
    $cardSubtitle.appendChild(setCurrentData);
    $temperature.appendChild(setTemperature);
    $summary.appendChild(setSummary);
    $windSpeed.appendChild(setWindSpeed);
    $humidity.appendChild(setHumidity);*/


    let text =
    `
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
            <div id="beforeDay" class="button">Назад</div>
            <div id="nextDay" class="button">Вперед</div>
        </div>
    `;

    $renderDOM.innerHTML = text;

    skycons.add("icon1", Skycons[icon]);
    skycons.play();

    button();
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

            renderDOM(summary, temperature, windSpeed, humidity, icon, cityName)
        })
        .catch(e => console.log("Oops, error ::: " + e))

}

let loadCity = (latitude, longitude, currentData) => {

    const url = `${baseUrlMaps}${latitude},${longitude}&sensor=true&language=uk`

    fetch(url)
        .then(response => response.json())
        .then(city => {
            const cityName = city.results[1].address_components[2].short_name;
            loadData(latitude, longitude, currentData, cityName)
            //console.log(cityName);
        })
        .catch(e => console.log("Oops, error ::: " + e))
}

(() => {

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    let success = pos => {
        let crd = pos.coords;

        latitude  = crd.latitude
        longitude = crd.longitude

        loadCity(latitude, longitude, currentData);

        /*
            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
        */
    };

    let error = err => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

})();
