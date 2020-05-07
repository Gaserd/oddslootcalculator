// var https = require('https');
// var fs = require('fs');

// var download = function (url, dest, cb) {
//     var file = fs.createWriteStream(dest);
//     var request = https.get(url, function (response) {
//         console.log(response)
//         response.pipe(file);
//         file.on('finish', function () {
//             file.close(cb);
//         });
//     });
// }

// download('https://www.twitch.tv/lol_keria1/clip/BoredSoftNightingaleUncleNox', '../video', function () {
//     console.log('finish')
// })

const nodeFetch = require('node-fetch')

//32399
function getClips() {
    return nodeFetch(`https://api.twitch.tv/helix/clips?game_id=32399`, {
        headers: {
            'Client-ID': 'ghotej777m8rk7kmsp5yp4oo9t3fjg'
        }
    })
        .then(res => res.json())
        .then(data => data)
        .catch(e => [])
}

getClips()
.then(data => console.log(data))