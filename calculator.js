let RANGE_VALUE = 50

function get_value_range() {
    return document.getElementById('range').value | 0
}

function set_teams_coeff() {
    let marg_bk = Number(document.getElementById('margin').value)
    let ver_1 = RANGE_VALUE
    let ver_2 = 100 - RANGE_VALUE

    let coeff_1 = ((1/ver_1) * 100) - marg_bk
    let coeff_2 = ((1/ver_2) * 100) - marg_bk

    document.getElementById('team_1').innerHTML = `${ver_1}% , coefficient -> ${coeff_1}`
    document.getElementById('team_2').innerHTML = `${ver_2}% , coefficient -> ${coeff_2}`
}

document.getElementById('range').oninput = function(e) {
    RANGE_VALUE = e.target.value
    set_teams_coeff()
}

document.getElementById('margin').oninput = function(e) {
    set_teams_coeff()
}

set_teams_coeff()

