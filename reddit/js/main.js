var $spinner = document.querySelector(".spinner-block");
var $images  = document.querySelector("#images");

var get = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        $spinner.style.visibility = "hidden";
        $images.style.opacity = 1;

        if (xhr.readyState != xhr.DONE) return;

        var status = xhr.status;
        var headers = xhr.getAllResponseHeaders();
        var text = xhr.responseText;

        callback(status, headers, text);
    }

    xhr.send();
}

var appendImage = function (url) {
    var imgEl = document.createElement('img');

    // <img />
    imgEl.src = url;
    // <img src="{url}" />

    imgEl.onerror = function () {
    // when image loading failed
    // hide image
        console.log('Error ::: image loading failed');
        this.style.display = "none";
    }
    document.getElementById('images').appendChild(imgEl);
}

var getImages = function (params) {
    $spinner.style.visibility = "visible";
    $images.style.opacity = 0.3;

    var limit    = params.limit;
    var category = params.category;

    if(limit == undefined)    { limit = 100; }
    if(category == undefined) { category = 'cats'; }

    // var url = 'https://www.reddit.com/r/pics.json';
    var url = 'https://www.reddit.com/r/pics/search.json?q=';
    url += category;
    url += '&limit=' + limit;

    get(url, function (status, headers, body) {
        var response = JSON.parse(body);

        _.each(response.data.children, function (child) {
            var url = child.data.url;

            appendImage(url);

            console.log('ITEM!', child.data.url);
        });

    });
}
var buttonClick = function () {

    var $limit   = document.querySelector("#limit").value;
    var $keyword = document.querySelector("#keyword").value;

    var obj = {
        limit: $limit,
        category: $keyword
    };

    if(isNaN($limit)) {
        alert("Error, try to input numbers");
    } else {
        getImages(obj);
    }

}

var button = document.querySelector(".button");
button.addEventListener("click", buttonClick);
