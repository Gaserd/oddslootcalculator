const nodeFetch = require('node-fetch')

function getClips() {
    return nodeFetch('https://api.twitch.tv/kraken/clips/top?game=League of Legends&limit=1', {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'ghotej777m8rk7kmsp5yp4oo9t3fjg'
        }
    })
        .then(res => res.json())
        .then(data => console.log(data))
}

//https://clips-media-assets2.twitch.tv/AT-cm%7C695006459.mp4

getClips()