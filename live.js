
let MATCHES = []

function get_live(id) {
    return new Promise((resolve, reject) => {
        fetch('https://cors-anywhere.herokuapp.com/https://www.trackdota.com/data/game/' + id + '/core.json')
            .then(res => res.json())
            .then(data => {
                resolve(data)
            })
            .catch(e => reject([]))
    })
}

function get_matches_live_open_dota() {
    return new Promise((resolve, reject) => {
        fetch(`https://api.opendota.com/api/live`)
            .then(res => res.json())
            .then(data => {
                let result = []
                result = data.filter(game =>
                    typeof game.team_name_dire !== 'undefined' &&
                    typeof game.team_name_radiant !== 'undefined' &&
                    game.deactivate_time == 0
                )
                MATCHES = result
                resolve()
            })
            .catch(e => reject())
    })

}

function sum_gold(gold) {
    let sum = 0;
    gold.map(g => sum = sum + g)
    return sum
}

function render_table() {

    let data = MATCHES
    let container = document.querySelector('.container')
    let table = ''

    table += '<table><tbody>'

        table += `<thead>
                <td>ID</td>
                <td>Tier</td>
                <td>First Team</td>
                <td>Second Team</td>
                <td>Scores</td>
                <td>Dota Picker</td>
            </thead>`

    for (let i = 0; i < data.length; i++) {

        table += `<tr>`
        table += `<td>${data[i].match_id}</td>`
        table += `<td class='tier' data-id='${data[i].match_id}'></td>`
        table += `<td>${data[i].team_name_dire} <span class='dire net_gold' data-id='${data[i].match_id}'></span></td>`
        table += `<td>${data[i].team_name_radiant} <span class='radiant net_gold' data-id='${data[i].match_id}'></span></td>`
        table += `<td>${data[i].dire_score}:${data[i].radiant_score}</td>`
        table += `<td class='url_dota_picker' data-id='${data[i].match_id}'></td>`
        table += '</tr>'
    }
    table += '<tbody></table>'
    container.innerHTML = table
}

function delete_table() {
    let container = document.querySelector('.container')
    container.innerHTML = ''
}


function get_url_dotapicker(data) {
    const url_dota_picker = 'https://dotapicker.com/herocounter?language=ru-ru#!/'
    let dire_picks = []
    let radiant_picks = []

    let getHeroesName = (id) => {
        let name = null
        for (let i = 0; i < HEROES.length; i++) {
            if (HEROES[i].id == id) {
                name = HEROES[i].localized_name.replace(' ', '_')
            }
        }
        return name
    }

    if (data.dire_picks.length == 5 && data.radiant_picks.length == 5) {
        dire_picks = data.dire_picks
        radiant_picks = data.radiant_picks

        let string_url_dire_picks = ''
        let string_url_radiant_picks = ''
        if (dire_picks.length == 5 && radiant_picks.length == 5) {
            for (let i = 0; i < dire_picks.length; i++) {
                if (i == 0) {
                    string_url_dire_picks += `T_${getHeroesName(dire_picks[i].hero_id)}`
                    string_url_radiant_picks += `/E_${getHeroesName(radiant_picks[i].hero_id)}`
                } else {
                    string_url_radiant_picks += `/E_${getHeroesName(radiant_picks[i].hero_id)}`
                    string_url_dire_picks += `/T_${getHeroesName(dire_picks[i].hero_id)}`
                }
            }
        }

        return `${url_dota_picker}${string_url_dire_picks}${string_url_radiant_picks}`

    } else {
        return null
    }
}

function main() {
    delete_table()
    get_matches_live_open_dota()
        .then(data => {
            render_table()

            for (let i = 0; i < MATCHES.length; i++) {
                get_live(MATCHES[i].match_id)
                    .then(data => {
                        let match_id = MATCHES[i].match_id
                        let url_dota_picker = get_url_dotapicker(data)

                        document.querySelector('.url_dota_picker[data-id="' + match_id + '"').innerHTML = '<a href='+ url_dota_picker +' target="blank">CLICK</a>'
                        document.querySelector('.tier[data-id="'+match_id+'"').innerHTML = data.league.tier
                    })
            }
        })
}

main()

setInterval(function () {
    main()
}, 15000)