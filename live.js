
let MATCHES = []

function get_live(id) {
    return new Promise((resolve, reject) => {
        fetch('https://cors-anywhere.herokuapp.com/https://www.trackdota.com/data/game/' + id + '/live.json')
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

    for (let i = 0; i < data.length; i++) {

        table += '<table><tbody>'

        table += `<thead>
                <td>Start time</td>
                <td>First Team</td>
                <td>Second Team</td>
                <td>Scores</td>
            </thead>`
        let time = new Date(data[i].activate_time * 1000)
        let str_time = time.toLocaleString()

        table += `<tr>`
        table += `<td>${str_time}</td>`
        table += `<td>${data[i].team_name_radiant} <span class='radiant net_gold' data-id='${data[i].match_id}'></span></td>`
        table += `<td>${data[i].team_name_dire} <span class='dire net_gold' data-id='${data[i].match_id}'></span></td>`
        table += `<td>${data[i].radiant_score}:${data[i].dire_score}</td>`
        table += '</tr>'
        table += '<tbody></table>'
        table += `<div class='canvas-chart' style="position: relative; height:40vh; width:80vw">
            <canvas class='live' style="height:40vh; width:80vw" data-id='${data[i].match_id}'></canvas>
        </div>`
    }
    container.innerHTML = table
}

function delete_table() {
    let container = document.querySelector('.container')
    container.innerHTML = ''
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
                        let status = data.status
                        let gold_difference = []
                        let time = []
                        for (let i = 0; i < data.radiant.stats.net_gold.length; i++) {
                            time.push(i + ':00')
                            gold_difference.push(
                                sum_gold(data.radiant.stats.net_gold.slice(0, i + 1)) - sum_gold(data.dire.stats.net_gold.slice(0, i + 1))
                            )
                        }

                        document.querySelector('span.dire[data-id="'+match_id+'"]').innerHTML = ' | ' + data.dire.stats.net_gold[data.dire.stats.net_gold.length - 1]
                        document.querySelector('span.radiant[data-id="'+match_id+'"]').innerHTML = ' | ' + data.radiant.stats.net_gold[data.radiant.stats.net_gold.length - 1]

                        let chart_string = match_id + ' | GOLD DIFFERENCE | '
                        if (status == 1) {
                            chart_string += 'Wait game start'
                        } else if (status == 3) {
                            chart_string += 'Game start'
                        } else if (status == 4) {
                            chart_string += 'Game Over'
                        }

                        var ctx = document.querySelector('.live[data-id="' + MATCHES[i].match_id + '"').getContext('2d');
                        var chart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: time,
                                datasets: [{
                                    label: chart_string,
                                    backgroundColor: 'rgb(205, 220, 57)',
                                    borderColor: 'rrgb(205, 220, 57)',
                                    data: gold_difference
                                }]
                            },
                            options: {
                                responsive : true,
                                animation: false
                            }
                        });
                    })
            }
        })
}

main()

setInterval(function() {
    main()
}, 15000)