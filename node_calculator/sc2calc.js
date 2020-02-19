/*

how create sc2.json ?

- open gg22bet.ru
- open SC2
- open developer page
- paste in console this code

let object = []
let j = 0
let names = document.querySelectorAll('.__app-LogoTitle-name.LogoTitle__name___2LTlu')
let odds = document.querySelectorAll('.odd__ellipsis___3b4Yk')
let date_time = document.querySelectorAll('.dateTime__date___147AU')

function get_day(text) {
    if (text.indexOf('TODAY') !== -1) {
        let day = new Date()
        day = day.toLocaleDateString('en-EN', { month : 'short', day : 'numeric' })
        day = day.toUpperCase()
        return text.replace('TODAY', day)
    } else {
        return text
    }
}

for (let i = 0; i < names.length; i++) {
    if (i == 0) 
        object[j] = []
    if (i % 2 == 0 && i != 0 ) {
        j++
        object[j] = []
        object[j].push({ time : get_day(date_time[j].innerText),  name : names[i].innerText, odds : odds[i].innerText })
    } else {
        object[j].push({ time : get_day(date_time[j].innerText), name : names[i].innerText, odds : odds[i].innerText })
    }
}
console.log(JSON.stringify(object))

- copy string in sc2.json

*/

const fs = require('fs')
const sc2line = JSON.parse(fs.readFileSync('./sc2.json', 'utf-8'))
const aligulac_api_key = '996TfcqdZrgcVpNJg0gK'
const node_fetch = require('node-fetch')

async function search_players(name) {
    return node_fetch(`http://aligulac.com/search/json/?q=${name}&search_for=players`)
        .then(res => res.json())
}

async function get_info_player(id) {
    return node_fetch(`http://aligulac.com/api/v1/player/?id=${id}&apikey=${aligulac_api_key}`)
        .then(res => res.json())
}

async function get_predictmatch(id1, id2) {
    return node_fetch(`http://aligulac.com/api/v1/predictmatch/${id1},${id2}/?apikey=${aligulac_api_key}&bo=3`)
        .then(res => res.json())
}

function format_number(num) {
    return Math.round(num * 100) / 100
}

async function main() {

    let table = '<table>'
    table += '<thead>'
    table += '<th>Time</th>'
    table += '<th>Player 1</th>'
    table += '<th>Player 2</th>'
    table += '<th>Player 1 ggbet odds</th>'
    table += '<th>Player 1 my odds</th>'
    table += '<th>Player 2 ggbet odds</th>'
    table += '<th>Player 2 my odds</th>'
    table += '</thead>'
    table += '<tbody>'

    for (let i = 0; i < sc2line.length; i++) {
        let player_1 = await search_players(sc2line[i][0].name)
        player_1 = player_1.players[0]
        let player_2 = await search_players(sc2line[i][1].name)
        player_2 = player_2.players[0]
        let player_form_1 = await get_info_player(player_1.id)
        let player_form_2 = await get_info_player(player_2.id)
        let custom_odds = await get_predictmatch(player_1.id, player_2.id)
        custom_odds = [
            custom_odds.proba,
            custom_odds.probb
        ]

        sc2line[i][0].id = player_1.id
        sc2line[i][0].race = player_1.race
        sc2line[i][1].id = player_2.id
        sc2line[i][1].race = player_2.race

        sc2line[i][0].form = player_form_1.objects[0].form
        sc2line[i][1].form = player_form_2.objects[0].form

        let margin = 0.06

        sc2line[i][0].percent_win_opponent = sc2line[i][0].form[sc2line[i][1].race][0] / (sc2line[i][0].form[sc2line[i][1].race][1] + sc2line[i][0].form[sc2line[i][1].race][0])
        sc2line[i][0].custom_odds = format_number((1 / custom_odds[0]) - margin)
        sc2line[i][0].value = format_number(sc2line[i][0].odds * (1 / sc2line[i][0].custom_odds))

        sc2line[i][1].percent_win_opponent = sc2line[i][1].form[sc2line[i][0].race][0] / (sc2line[i][1].form[sc2line[i][0].race][1] + sc2line[i][1].form[sc2line[i][0].race][0])
        sc2line[i][1].custom_odds = format_number((1 / custom_odds[1]) - margin)
        sc2line[i][1].value = format_number(sc2line[i][1].odds * (1 / sc2line[i][1].custom_odds))

        table += '<tr>'
        table += `<td>${sc2line[i][0].time}</td>`
        table += `<td>${sc2line[i][0].name}</td>`
        table += `<td>${sc2line[i][1].name}</td>`
        table += `<td>${sc2line[i][0].odds}</td>`
        table += `<td><p>my odd ->${sc2line[i][0].custom_odds}</p>
                    <p class='${sc2line[i][0].value > 1 ? 'active' : ''}'>value -> ${sc2line[i][0].value * 100}%</p>
                </td>`
        table += `<td>${sc2line[i][1].odds}</td>`
        table += `<td>
                    <p>my odd ->${sc2line[i][1].custom_odds}</p>
                    <p class='${sc2line[i][1].value > 1 ? 'active' : ''}'>value -> ${sc2line[i][1].value * 100}%</p>
                </td>`
        table += '</tr>'

    }

    table += '</tbody>'
    table += '</table>'
    table += `<style>
            body {
                margin: 0;
                font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }

            td, th {
                border: 1px solid #ddd;
                padding: 8px;
              }
              
              tr:nth-child(even){background-color: #f2f2f2;}
              
              tr:hover {background-color: #ddd;}
              
              th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: left;
                background-color: #4CAF50;
                color: white;
              }

              .active {
                  background-color: green;
                  color: #fff;
                  padding : 5px;
              }

            </style>`

    fs.writeFileSync('./sc2odds.html', table)
}

main()




