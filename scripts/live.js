
let MATCHES = []

function get_live(id) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.trackdota.com/data/game/${id}/core.json`)}`)
            .then(res => res.json())
            .then(data => {
                resolve(JSON.parse(data.contents))
            })
            .catch(e => reject([]))
    })
}

function get_heroes_matchups(data) {
    let matchups = null
    for (let i = 0; i < HEROES_MATCHUPS.length; i++) {
        if (HEROES_MATCHUPS[i].id == data.id) {
            matchups = HEROES_MATCHUPS[i]
        }
    }
    return matchups
}

function get_median_percent_winrate_teammates(teammates_stats, teammates) {
    let percent_win = []
    if (teammates.length > 0) {
        for (let i = 0; i < teammates_stats.length; i++) {
            for (let j = 0; j < teammates.length; j++) {
                if (teammates_stats[i].name == teammates[j].localized_name) {
                    percent_win.push(teammates_stats[i].win_rate)
                }
            }
        }
        return median(percent_win)
    } else {
        return 0
    }
}

function get_hero_stats(data) {
    let get_hero = (id) => {
        let data = null
        for (let i = 0; i < HERO_STATS.length; i++) {
            if (HERO_STATS[i].id == id) {
                data = HERO_STATS[i]
            }
        }
        return data
    }

    let dire_stats = []
    let radiant_stats = []

    if (data.dire_picks.length == 5 && data.radiant_picks.length == 5) {
        dire_picks = data.dire_picks
        radiant_picks = data.radiant_picks

        for (let i = 0; i < dire_picks.length; i++) {
            dire_stats.push(get_hero(dire_picks[i].hero_id))
            radiant_stats.push(get_hero(radiant_picks[i].hero_id))
        }

        return {
            dire_stats: dire_stats,
            radiant_stats: radiant_stats
        }

    } else {
        return null
    }

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

function median(arr) {
    arr = arr.sort(function (a, b) { return a - b; });
    var i = arr.length / 2;
    return i % 1 == 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)];
}

function render_table() {

    let data = MATCHES
    let container = document.querySelector('.main-table')
    let table = ''

    table += '<table id="table" class="table"><tbody>'

    table += `<thead>
                <th>ID</th>
                <th>Tier</th>
                <th>First Team</th>
                <th>Second Team</th>
                <th>Scores</th>
                <th>First Team Pick</th>
                <th>Second Team Pick</th>
                <th>Dota Picker</th>
            </thead>`

    for (let i = 0; i < data.length; i++) {
        table += `<tr>`
        table += `<td>${data[i].match_id}</td>`
        table += `<td class='tier' data-id='${data[i].match_id}'></td>`
        table += `<td>${data[i].team_name_dire} <span class='dire net_gold' data-id='${data[i].match_id}'></span></td>`
        table += `<td>${data[i].team_name_radiant} <span class='radiant net_gold' data-id='${data[i].match_id}'></span></td>`
        table += `<td>${data[i].dire_score}:${data[i].radiant_score} <br/>
                    <b class='diff_time' data-id='${data[i].match_id}'></b>
                    </td>`
        table += `<td class='first_team_pick' data-id='${data[i].match_id}'></td>`
        table += `<td class='second_team_pick' data-id='${data[i].match_id}'></td>`
        table += `<td class='url_dota_picker' data-id='${data[i].match_id}'></td>`
        table += '</tr>'
    }
    table += '<tbody></table>'
    container.innerHTML = table
}

function delete_table() {
    let container = document.querySelector('.main-table')
    container.innerHTML = ''
}


function get_url_dotapicker(data) {
    const url_dota_picker = 'https://dotapicker.com/herocounter?language=en-en#!/'
    let dire_picks = []
    let radiant_picks = []

    let getHeroesName = (id) => {
        let name = null
        for (let i = 0; i < HEROES.length; i++) {
            if (HEROES[i].id == id) {
                name = HEROES[i].localized_name.replace(' ', '_').replace('\'', '')
            }
        }
        return name
    }

    document.querySelector(`.diff_time[data-id="${data.id}"`).innerHTML = Math.round(data.duration / 60) + ' min'

    if (data.dire_picks.length == 5 && data.radiant_picks.length == 5) {
        dire_picks = data.dire_picks
        radiant_picks = data.radiant_picks

        let string_url_dire_picks = ''
        let string_url_radiant_picks = ''
        if (dire_picks.length == 5 && radiant_picks.length == 5) {
            for (let i = 0; i < dire_picks.length; i++) {
                if (i == 0) {
                    string_url_dire_picks += `E_${getHeroesName(dire_picks[i].hero_id)}`
                    string_url_radiant_picks += `/T_${getHeroesName(radiant_picks[i].hero_id)}`
                } else {
                    string_url_radiant_picks += `/T_${getHeroesName(radiant_picks[i].hero_id)}`
                    string_url_dire_picks += `/E_${getHeroesName(dire_picks[i].hero_id)}`
                }
            }
        }

        return `${url_dota_picker}${string_url_dire_picks}${string_url_radiant_picks}`

    } else {
        return null
    }
}

function search_win_rate_dotabuff(name) {
    let data = null
    for (let i = 0; i < DOTABUFF_WIN_RATES_HEROES.length; i++) {
        if (DOTABUFF_WIN_RATES_HEROES[i].name == name) {
            data = DOTABUFF_WIN_RATES_HEROES[i]
        }
    }
    return data
}

function main() {
    get_matches_live_open_dota()
        .then(data => {
            render_table()

            for (let i = 0; i < MATCHES.length; i++) {
                get_live(MATCHES[i].match_id)
                    .then(data => {
                        let match_id = MATCHES[i].match_id
                        let url_dota_picker = get_url_dotapicker(data)
                        let hero_stats = get_hero_stats(data)



                        document.querySelector('.url_dota_picker[data-id="' + match_id + '"').innerHTML = (url_dota_picker == null) ? null : '<a href=' + url_dota_picker + ' target="blank">CLICK</a>'
                        document.querySelector('.tier[data-id="' + match_id + '"').innerHTML = data.league.tier

                        if (
                            hero_stats !== null
                        ) {
                            let first_team_pick = document.querySelector('.first_team_pick[data-id="' + match_id + '"')
                            let second_team_pick = document.querySelector('.second_team_pick[data-id="' + match_id + '"')

                            let first_team_pick_html = '<ul>'
                            let second_team_pick_html = '<ul>'


                            let average_win_rate_dire = []
                            let average_win_rate_radiant = []
                            let average_matchups_win_rate_dire = []
                            let average_matchups_win_rate_radiant = []

                            let flag_on_winrate_heroes = document.getElementById('on_winrate').checked
                            let flag_on_matchups_heroes = document.getElementById('on_matchups').checked

                            for (let i = 0; i < 5; i++) {

                                let dotabuff_dire_hero = (flag_on_winrate_heroes) ? search_win_rate_dotabuff(hero_stats['dire_stats'][i]['localized_name']) : 0
                                let dotabuff_radiant_hero = (flag_on_winrate_heroes) ? search_win_rate_dotabuff(hero_stats['radiant_stats'][i]['localized_name']) : 0

                                if (flag_on_winrate_heroes) {
                                    average_win_rate_dire.push(dotabuff_dire_hero.win)
                                    average_win_rate_radiant.push(dotabuff_radiant_hero.win)
                                }

                                let teammates_dire = (flag_on_matchups_heroes) ? get_heroes_matchups(hero_stats['dire_stats'][i]) : 0
                                let teammates_radiant = (flag_on_matchups_heroes) ? get_heroes_matchups(hero_stats['radiant_stats'][i]) : 0

                                let hero_matchups_dire = (flag_on_matchups_heroes) ? get_median_percent_winrate_teammates(
                                    teammates_dire.matchups.teammates,
                                    hero_stats['radiant_stats']
                                ) : 0

                                let hero_matchups_radiant = (flag_on_matchups_heroes) ? get_median_percent_winrate_teammates(
                                    teammates_radiant.matchups.teammates,
                                    hero_stats['dire_stats']
                                ) : 0

                                if (flag_on_matchups_heroes) {
                                    average_matchups_win_rate_dire.push(hero_matchups_dire)
                                    average_matchups_win_rate_radiant.push(hero_matchups_radiant)
                                }

                                first_team_pick_html += `
                                    <li>
                                        <img class='icon_hero' src="${'https://api.opendota.com' + hero_stats['dire_stats'][i].icon}"> ${hero_stats['dire_stats'][i]['localized_name']}</br>
                                    `
                                first_team_pick_html += (flag_on_winrate_heroes) ? `<b>Winrate - ${(dotabuff_dire_hero !== null) ? dotabuff_dire_hero.win : '???'}%</b></br>` : ''
                                first_team_pick_html += (flag_on_matchups_heroes) ? `<b>Matchups - ${hero_matchups_radiant}%</b>` : ''
                                first_team_pick_html += '</li>'


                                second_team_pick_html += `
                                    <li>
                                        <img class='icon_hero' src="${'https://api.opendota.com' + hero_stats['radiant_stats'][i].icon}"> ${hero_stats['radiant_stats'][i]['localized_name']}<br/>
                                `
                                second_team_pick_html += (flag_on_winrate_heroes) ? `<b>Winrate - ${(dotabuff_radiant_hero !== null) ? dotabuff_radiant_hero.win : '???'}%</b></br>` : ''
                                second_team_pick_html += (flag_on_matchups_heroes) ? `<b>Matchups - ${hero_matchups_radiant}%</b>` : ''
                                second_team_pick_html += `</li>`

                            }

                            average_win_rate_dire = median(average_win_rate_dire)
                            average_win_rate_radiant = median(average_win_rate_radiant)
                            average_matchups_win_rate_dire = median(average_matchups_win_rate_dire)
                            average_matchups_win_rate_radiant = median(average_matchups_win_rate_radiant)

                            first_team_pick_html += `
                                <li class='median_percent'>
                                    Median</br>
                                    <b>${(flag_on_winrate_heroes) ? average_win_rate_dire : 0}%</b></br>
                                    <b>${(flag_on_matchups_heroes) ? average_matchups_win_rate_dire : 0}%</b>
                                </li>`
                            second_team_pick_html += `
                                <li class='median_percent'>
                                    Median</br>
                                    <b>${(flag_on_winrate_heroes) ? average_win_rate_radiant : 0}%</b></br>
                                    <b>${(flag_on_matchups_heroes) ? average_matchups_win_rate_radiant : 0}%</b>
                                </li>`

                            first_team_pick_html += '</ul>'
                            second_team_pick_html += '</ul>'

                            first_team_pick.innerHTML = first_team_pick_html
                            second_team_pick.innerHTML = second_team_pick_html
                        }
                    })
            }
        })
}



main()

setInterval(function () {
    main()
}, 30000)

document.getElementById('on_winrate').onchange = function() {
    main()
}

document.getElementById('on_matchups').onchange = function() {
    main()
}

/*

script get meta heroes dotabuff.com

let table = document.querySelectorAll('.sortable.no-arrows.r-tab-enabled td')
//12 td, we neeed 2 - name, 11 - %pick, 12 - %winrate
let length = table.length / 12
let heroes_array = []
for (let i = 0; i < length; i++) {
    let j = i * 12
    heroes_array.push({
        name: table[j].getAttribute('data-value'),
        pick: table[j + 9].getAttribute('data-value'),
        win: table[j + 10].getAttribute('data-value')
    })
}

console.log(JSON.stringify(heroes_array))

*/