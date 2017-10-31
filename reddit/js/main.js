var get = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
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
    // @todo hide image
    alert(1);
    }

    document.getElementById('images').appendChild(imgEl);
}

// getImages({limit: 5})
// getImages({})
// getImages() -- by default should take 100 images

// getImages({limit: 5, category: "cats"})
// getImages({category: "cats"})
// getImages()

// "S"OLID, S -> Single Responsibility
var getImages = function (params) {

    // var url = 'https://www.reddit.com/r/pics.json';
    var url = 'https://www.reddit.com/r/pics/search.json?q=cats';
    url += '&limit=5';
    // @todo: use here params.limit
    // @todo: category == "pics"

    get(url, function (status, headers, body) {
        var response = JSON.parse(body);

        _.each(response.data.children, function (child) {
            var url = child.data.url;

            appendImage(url);

            console.log('ITEM!', child.data.url);
        });

    });
}
