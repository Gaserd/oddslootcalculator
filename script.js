let MONEY = 10
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

                    if (
                        (match.BestOdds[0].OddTypeId - match.BestOdds[1].OddTypeId) == 1
                        ||
                        (match.BestOdds[0].OddTypeId - match.BestOdds[1].OddTypeId) == -1
                    ) {
                        match.BestOdds.sort(function (a, b) { return a.OddTypeId - b.OddTypeId })
                    }

                    let object = [
                        {
                            name: match.HomeTeam,
                            odd: match.BestOdds[0].Value,
                            pid: match.BestOdds[0].ProviderId,
                            sid : match.SportId
                        },
                        {
                            name: match.AwayTeam,
                            odd: match.BestOdds[1].Value,
                            pid: match.BestOdds[1].ProviderId,
                            sid : match.SportId
                        }
                    ]
                    new_data.push(object.sort(function (a, b) { return a.odd - b.odd }))
                }
                return new_data

            } else {
                return data
            }
        })
        .catch(e => {
            console.log(e)
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
        let container = document.querySelector('.container')
        let table = '<table><tbody>'

        table += `<thead>
                <td>Game</td>
                <td>First Team</td>
                <td>First Bet</td>
                <td>Second Team</td>
                <td>Second Bet</td>
                <td>Profit</td>
            </thead>`

        for (let i = 0; i < data.length; i++) {

            let array_profit = profit([data[i][0].odd, data[i][1].odd])
            let color = (array_profit[0] > 0 && array_profit[1]) ? 'positive' : 'negative'

            table += `<tr class=${color}>`
            table += `<td>${serach_sports_by_id(data[i][0].sid).Name}</td>`
            table += `<td>${data[i][0].name}</td>`
            table += `<td><span class='coeff'>x${data[i][0].odd}</span>, $${MONEY}<br/>${serach_providers_by_id(data[i][0].pid).Name}</td>`
            table += `<td>${data[i][1].name}</td>`
            table += `<td><span class='coeff'>x${data[i][1].odd}</span>, $${get_reverse_money([data[i][0].odd, data[i][1].odd])}<br/>${serach_providers_by_id(data[i][1].pid).Name}</td>`
            table += `<td>$${array_profit[0]}/$${array_profit[1]}</td>`
            table += '</tr>'
        }

        table += '<tbody></table>'
        container.innerHTML = table

    })