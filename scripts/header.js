let array_header = [
    { name: 'Home', active: true, page: './index.html' },
    { name: 'Coefficient', active: false, page: './calculator.html' },
    { name: 'Mathematical expectation', active: false, page: './mathex.html' },
    { name: 'Live Dota 2', active: false, page: './live.html' },
    { name: 'Live Odds', active: false, page: './live_odds.html' }
]

function generate_html_header(active_header) {
    let html_header = `<ul class="navbar-nav mr-auto">`
    for (let i = 0; i < array_header.length; i++) {
            html_header += `
            <li class="nav-item ${(array_header[i].name == active_header) ? 'active' : ''}">
                <a class="nav-link" href="${array_header[i].page}">${array_header[i].name}</a>
            </li>
            `
    }
    html_header += `</ul>`
    document.getElementById('navbarSupportedContent').innerHTML = html_header
}