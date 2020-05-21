let clips = []
let targetGame = 'Counter-Strike: Global Offensive'
let targetClipsIndex = 0

function getGames() {
    return fetch(`https://api.twitch.tv/kraken/search/games?query=Minecraft`, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'ghotej777m8rk7kmsp5yp4oo9t3fjg'
        }
    })
        .then(res => res.json())
        .then(data => data)
        .catch(e => [])
}

function getClips() {
    return fetch(`https://api.twitch.tv/kraken/clips/top?game=${targetGame}&period=day&trending=true&limit=100&language=ru`, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'ghotej777m8rk7kmsp5yp4oo9t3fjg'
        }
    })
        .then(res => res.json())
        .then(data => data)
        .catch(e => [])
}

function drawClip() {
    const container = document.querySelector('.mainBlockClips')
    const videoContainer = document.querySelector('.video_container')
    if (videoContainer !== null) {
        videoContainer.classList.add('animation')
        setTimeout(function () {
            container.innerHTML = ''
        }, 1000)
    } else {
        container.innerHTML = ''
    }
    const clip = clips[targetClipsIndex]
    const height = window.innerHeight

    setTimeout(function () {
        container.innerHTML = `
            <div class='video_container'>
                <video 
                    width='100%' 
                    height='${height}'
                    loop
                    playsinline
                    allowfullscreen=false
                >
                    <source src='https://clips-media-assets2.twitch.tv/AT-cm%7C${clip.tracking_id}.mp4' type="video/mp4">
                </video>
                <div id="time"></div>
                <div class='broadcaster'>
                    <img src='${clip.broadcaster.logo}'>
                    <a target='_blank' class='link_broadcaster' href='${clip.broadcaster.channel_url}'>${clip.broadcaster.display_name}</a>
                </div>
                <button class='share'>
                    зашарить
                </button>
            </div>
            `

        const time = document.getElementById('time')
        const video = document.querySelector('video')
        let playFlag = 0

        video.addEventListener('timeupdate', function(event) {
            updateTime(this.currentTime, this.duration)
        })

        function updateTime(currentTime, duration) {
            currentTime = currentTime | 0
            duration = duration | 0
            time.style.width = currentTime / duration * 100 + '%'
        }

        video.addEventListener('loadstart', function() {
            video.classList.add('loading')
        })

        video.addEventListener('canplay', function() {
            video.classList.remove('loading')
        })

        video.addEventListener('click', function () {
            if (playFlag == 0) {
                video.play()
                playFlag = 1
            } else {
                video.pause()
                playFlag = 0
            }
        })

        const like = document.querySelector('.share')
        like.addEventListener('click', function () {
            vkBridge.send("VKWebAppShowStoryBox",
                {
                    "background_type": "video",
                    "url": `https://clips-media-assets2.twitch.tv/AT-cm%7C${clip.tracking_id}.mp4`,
                    "attachment": {
                        "text": "open", // см. значения link_text в https://vk.com/dev/stories.getVideoUploadServer
                        "type": "url",
                        "url": "https://vk.com/app7375876"
                    }

                });
        })

    }, 1000)

}

function clearGameClass() {
    targetClipsIndex = 0
    const game = document.querySelectorAll('.game')
    for (let i = 0; i < game.length; i++) {
        game[i].classList.remove('active')
    }
}

function initClips() {

    getClips()
        .then(data => {
            clips = data.clips
            console.log(clips)
            drawClip()
        })

    const element = document.querySelector('.mainBlockClips')
    const mc = new Hammer(element)
    mc.get('swipe').set({
        direction: Hammer.DIRECTION_ALL,
        threshold: 1,
        velocity: 0.1
    });

    mc.on("swipeup", function (ev) {
        targetClipsIndex++
        if (targetClipsIndex > clips.length) {
            targetClipsIndex = clips.length - 1
        } else {
            drawClip()
        }
    });

    mc.on("swipeleft", function (ev) {
        targetClipsIndex++
        if (targetClipsIndex > clips.length) {
            targetClipsIndex = clips.length - 1
        } else {
            drawClip()
        }
    });

    mc.on("swiperight", function (ev) {
        targetClipsIndex--
        if (targetClipsIndex == -1) {
            targetClipsIndex = 0
        } else {
            drawClip()
        }
    })

    mc.on("swipedown", function (ev) {
        targetClipsIndex--
        if (targetClipsIndex == -1) {
            targetClipsIndex = 0
        } else {
            drawClip()
        }
    });

    const game = document.querySelectorAll('.game')
    for (let i = 0; i < game.length; i++) {
        game[i].addEventListener('click', function () {
            clearGameClass()
            targetGame = game[i].getAttribute('data-game')
            game[i].classList.add('active')
            getClips()
                .then(data => {
                    clips = data.clips
                    console.log(clips)
                    drawClip()
                })
        })
    }

}


