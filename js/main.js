const key = "91a361375a95b077366d8085860f86b0";
const baseUrlDarksky = 'https://api.darksky.net/forecast/';
const baseUrlMaps = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=';

let defLang = "uk"

let currentData = moment().format('LL');


/*
    for cross-domain requests
    https://github.com/Rob--W/cors-anywhere/#documentation
*/

const cors_api_host = "https://cors-anywhere.herokuapp.com/";


let renderDOM = (summary, temperature, windSpeed, humidity, icon, cityName) => {

    let skycons = new Skycons({"color": "balck"});
    icon = icon.toUpperCase();

    skycons.add("icon1", Skycons[icon]);
    skycons.play();

    let $cardTitle   = document.querySelector('.card-title');
    let $cardSubtitle  = document.querySelector('.card-subtitle');
    let $temperature = document.querySelector('#temperature');
    let $summary     = document.querySelector('#summary');
    let $windSpeed   = document.querySelector('#windSpeed');
    let $humidity    = document.querySelector('#humidity');

    cityName    = document.createTextNode(cityName);
    currentData = document.createTextNode(currentData);
    temperature = document.createTextNode(parseInt(temperature) + '\u2103');
    summary     = document.createTextNode(summary);
    windSpeed   = document.createTextNode(`Вітер: ${windSpeed}м/c`);
    humidity    = document.createTextNode(`Вологість: ${humidity*100}%`);

    $cardTitle.appendChild(cityName);
    $cardSubtitle.appendChild(currentData);
    $temperature.appendChild(temperature);
    $summary.appendChild(summary);
    $windSpeed.appendChild(windSpeed);
    $humidity.appendChild(humidity);
}


let loadData = (latitude, longitude, cityName) => {

    const url = `${cors_api_host}${baseUrlDarksky}${key}/${latitude},${longitude}?lang=${defLang}&units=auto`;

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

let loadCity = (latitude, longitude) => {

    const url = `${baseUrlMaps}${latitude},${longitude}&sensor=true`

    fetch(url)
        .then(response => response.json())
        .then(city => {
            const cityName = city.results[1].address_components[2].short_name;
            loadData(latitude, longitude, cityName)
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

        loadCity(crd.latitude, crd.longitude);

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

/*

let $showLocationBytton = document.querySelector('#showLocation');

$showLocationBytton.addEventListener('click', function() {
    userLocation();
});
*/
    /*
    (function() {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', newUrl, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
        };
        xhr.send();
})();*/
