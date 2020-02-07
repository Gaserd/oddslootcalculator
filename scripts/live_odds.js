function get_odds() {
    let date = new Date()
    date = date.toISOString()

    let url = `https://betscalc.me/get?date=${date}`
    return fetch(url)
        .then(res => res.json())
}

function render_table(data) {
    let container = document.querySelector('.main-table')
    let table = '<table class="table"><tbody>'

    table += `<thead>
                <th scope="col">Date</th>
                <th scope="col">First Team</th>
                <th scope="col">Second Team</th>
                <th>Buffbet</th>
                <th>Lootbet</th>
                <th>Unikrn</th>
            </thead>`

    data = data.sort((a, b) => new Date(a.date) - new Date(b.date))

    for (let i = 0; i < data.length; i++) {
        let date = new Date(data[i].date)
        date = date.toLocaleString()
        table += `<tr>
            <td>${date}</td>
            <td>${data[i].team_1}</td>
            <td>${data[i].team_2}</td>
            <td>${(typeof data[i].odds.buffbet !== 'undefined') ? `<button data-toggle="modal" data-target="#modalCont" type="button" data-odds="buffbet" data-id=${i} class="btn btn-light odds">${data[i].odds.buffbet[data[i].odds.buffbet.length - 1].odd_1} / ${data[i].odds.buffbet[data[i].odds.buffbet.length - 1].odd_2}</button>` : ''}</th>
            <td>${(typeof data[i].odds.lootbet !== 'undefined') ? `<button data-toggle="modal" data-target="#modalCont" type="button" data-odds="lootbet" data-id=${i} class="btn btn-light odds">${data[i].odds.lootbet[data[i].odds.lootbet.length - 1].odd_1} / ${data[i].odds.lootbet[data[i].odds.lootbet.length - 1].odd_2}</button>` : ''}</th>
            <td>${(typeof data[i].odds.unikrn !== 'undefined') ? `<button data-toggle="modal" data-target="#modalCont" type="button" data-odds="unikrn" data-id=${i} class="btn btn-light odds">${data[i].odds.unikrn[data[i].odds.unikrn.length - 1].odd_1} / ${data[i].odds.unikrn[data[i].odds.unikrn.length - 1].odd_2}</button>` : ''}</th>
        </tr>`
    }

    table += '<tbody></table>'
    container.innerHTML = table

    let odds_buttons = document.querySelectorAll('.odds')
    for (let i = 0; i < odds_buttons.length; i++) {
        odds_buttons[i].onclick = function (e) {
            let id = e.target.getAttribute('data-id')
            let type = e.target.getAttribute('data-odds')

            let second_container = document.querySelector('.modal-body')
            let second_table = '<table class="table"><tbody>'

            let second_data = data[id]

            second_table += `<thead>
                <th scope="col">Date</th>
                <th scope="col">First Bet</th>
                <th scope="col">Second Bet</th>
            </thead>`

            second_data.odds[type] = second_data.odds[type].sort((a,b) => new Date(a.date_add) - new Date(b.date_add))

            for (let j = 0; j < second_data.odds[type].length; j++) {
                let date = new Date(second_data.odds[type][j].date_add)
                date = date.toLocaleString()
                second_table += `<tr>
                    <td>${date}</td>
                    <td>${second_data.odds[type][j].odd_1}</td>
                    <td>${second_data.odds[type][j].odd_2}</td>
                </tr>`
            }

            second_table += '<tbody></table>'
            second_container.innerHTML = second_table
        }
    }
}

function main() {
    get_odds()
        .then(data => {
            render_table(data.data)
        })
}

document.getElementById('refresh').onclick = function () {
    document.querySelector('.main-table').innerHTML = ''
    main()
}

main()