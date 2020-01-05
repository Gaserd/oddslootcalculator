function get_betts_today() {
    let date = new Date()
    date = date.toISOString()

    return fetch('https://betscalc.me/get?date=' + date)
        .then(res => res.json())
}

function render_table(data_json) {

    let data = data_json
        data = data.sort(function(a, b) {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      });

    let container = document.querySelector('.container')

    let table = '<div>'

    for (let i = 0; i < data.length; i++) {
        table += `<h2>${data[i].team_1} – ${data[i].team_2}</h2>`
        table += `<p>${new Date(data[i].date).toLocaleString()}</p>`
        for (let j in data[i].odds) {
            table += `<p>${j}</p>`
            table += `<div style="position: relative; height:40vh; width:80vw">
                <canvas class='canvas-chart ${j}' style="height:40vh; width:80vw" data-id='${i}'></canvas>
            </div>`
        }
    }

    table += '</div>'

    container.innerHTML = table
}

function main() {
    get_betts_today()
        .then(data => {
            let matches = data.data
            render_table(data.data)
            return matches
        })
        .then(matches => {
            for (let i = 0; i < matches.length; i++) {
                for (let j in matches[i].odds) {

                    let time = []
                    let datasets = [
                        {
                            label: matches[i].team_1,
                            borderColor: "#3e95cd",
                            fill: false,
                            data: []
                        },
                        {
                            label: matches[i].team_2,
                            borderColor: "#8e5ea2",
                            fill: false,
                            data: []
                        }
                    ]

                    for (let m = 0; m < matches[i].odds[j].length; m++) {
                        let ctx = document.querySelector('.canvas-chart.' + j + '[data-id="' + i + '"]').getContext('2d');


                        time.push(new Date(matches[i].odds[j][m].date_add).toLocaleString())
                        datasets[0].data.push(matches[i].odds[j][m].odd_1)
                        datasets[1].data.push(matches[i].odds[j][m].odd_2)


                        var chart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: time,
                                datasets: datasets
                            },
                            options: {
                                responsive: true,
                                animation: false
                            }
                        })
                    }
                }
            }
        })
}

main()