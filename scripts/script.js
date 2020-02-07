let MONEY = 10
let ODDS = []
let PROVIDERS = []
let SPORTS = []

function get_providers() {
    return fetch('https://api.oddsloot.com/api/providers')
        .then(res => res.json())
}

function get_sports() {
    return fetch('https://api.oddsloot.com/api/sports')
        .then(res => res.json())
}

function get_odds() {
    return fetch('https://api.oddsloot.com/api/Esports')
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {

                let new_data = []
                for (let i = 0; i < data.length; i++) {
                    let match = data[i]
                    let array_best = []



                    for (let j = 0; j < match.Odds.length; j = j + 2) {
                        let object = [
                            {
                                name: match.HomeTeam,
                                odd: match.Odds[j].Value,
                                pid: match.Odds[j].ProviderId,
                                sid: match.SportId,
                                time: match.StartTime
                            },
                            {
                                name: match.AwayTeam,
                                odd: match.Odds[j + 1].Value,
                                pid: match.Odds[j + 1].ProviderId,
                                sid: match.SportId,
                                time: match.StartTime
                            }
                        ]
                        array_best.push(object.sort(function (a, b) { return a.odd - b.odd }))
                    }

                    for (let k = 0; k < array_best.length; k++) {

                        for (let m = 0; m < array_best.length; m++) {
                            if (array_best[k][0].name !== array_best[m][1].name) {
                                let pr = profit([
                                    array_best[k][0].odd,
                                    array_best[m][1].odd
                                ])
                                if (pr[0] > 0 && pr[1] > 0) {
                                    new_data.push([
                                        array_best[k][0], array_best[m][1]
                                    ])
                                }
                            }
                        }
                    }

                }
                return new_data
            } else {
                return data
            }
        })
        .catch(e => {
            return []
        })
}

function format_number(num) {
    return Math.round(num * 100) / 100
}

function get_reverse_money(odds) {
    return format_number(
        (MONEY * odds[0]) / odds[1]
    )
}

function profit(odds) {
    let p1 = odds[0]
    let p2 = odds[1]
    let money_1 = MONEY
    let money_2 = get_reverse_money(odds)

    let profit_1 = format_number((p1 * money_1) - (money_1 + money_2))
    let profit_2 = format_number((p2 * money_2) - (money_1 + money_2))

    return [profit_1, profit_2]
}

function serach_providers_by_id(id) {
    let provider = null
    for (let i = 0; i < PROVIDERS.length; i++) {
        if (PROVIDERS[i].ProviderId == id) {
            provider = PROVIDERS[i]
            break
        }
    }
    return provider
}

function serach_sports_by_id(id) {
    let sport = null
    for (let i = 0; i < SPORTS.length; i++) {
        if (SPORTS[i].Id == id) {
            sport = SPORTS[i]
            break
        }
    }
    return sport
}

function get_all_data() {
    return new Promise((resolve, reject) => {
        get_providers()
            .then(data => PROVIDERS = data)
            .then(data => {
                return get_sports()
            })
            .then(data => SPORTS = data)
            .then(data => {
                return get_odds()
            })
            .then(data => {
                ODDS = data
            })
            .then(data => {
                resolve()
            })
            .catch(e => reject())
    })
}

function render_table() {
    let data = ODDS
    let container = document.querySelector('.main-table')
    let table = '<table class="table"><tbody>'

    table += `<thead>
                <th scope="col">Game</th>
                <th scope="col">First Team</th>
                <th scope="col">First Bet</th>
                <th scope="col">Second Team</th>
                <th scope="col">Second Bet</th>
                <th scope="col">Profit</th>
            </thead>`

    for (let i = 0; i < data.length; i++) {

        let array_profit = profit([data[i][0].odd, data[i][1].odd])

        let time = new Date(data[i][0].time)
        let str_time = time.toLocaleString()

        table += `<tr>`
        table += `<td>${serach_sports_by_id(data[i][0].sid).Name}<br/><span class='time'>${str_time}</span></td>`
        table += `<td>${data[i][0].name}</td>`
        table += `<td><span class='coeff'>x${data[i][0].odd}</span>, $${MONEY}<br/>${serach_providers_by_id(data[i][0].pid).Name}</td>`
        table += `<td>${data[i][1].name}</td>`
        table += `<td><span class='coeff'>x${data[i][1].odd}</span>, $${get_reverse_money([data[i][0].odd, data[i][1].odd])}<br/>${serach_providers_by_id(data[i][1].pid).Name}</td>`
        table += `<td>$${array_profit[0]}/$${array_profit[1]}</td>`
        table += '</tr>'
    }

    table += '<tbody></table>'
    container.innerHTML = table
}

function delete_table() {
    let container = document.querySelector('.main-table')
    container.innerHTML = ''
}

function get_input_money() {
    let input = document.querySelector('#money')
    return Number(input.value)
}

function main() {
    MONEY = get_input_money()
    get_all_data()
        .then(data => {
            delete_table()
            render_table()
        })
    
    document.querySelector('#money').addEventListener('change', function(e) {
        MONEY = Number(e.target.value)
        delete_table()
        render_table()
    })
}

main()