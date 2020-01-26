function getCoefficients() {
    return [
        Number(document.getElementById('k1').value),
        Number(document.getElementById('k2').value),
    ]
}

function getOurCoefficients() {
    //without margin
    let range = Number(document.getElementById('range').value)
    return [
        (1 / range * 100),
        (1 / (100 - range) * 100),
    ]
}

function calculatePah(our_coefficients) {
    let ph1 = 1 / 2
    let ph2 = 1 / 2
    let ph1a = our_coefficients[0]
    let ph2a = our_coefficients[1]

    let pa = (ph1 * ph1a) + (ph2 * ph2a)
    let pah1 = (ph1 * ph1a) / pa
    let pah2 = (ph2 * ph2a) / pa

    return [pah1, pah2]
}


function main() {

    let coefficients = getCoefficients()
    let our_coefficients = getOurCoefficients()
    let pah = calculatePah(our_coefficients)
    let s = 100
    let win1 = (s * coefficients[0]) - s
    let lose1 = -s
    let win2 = (s * coefficients[1]) - s
    let lose2 = -s

    let m = (win1 * pah[0]) + (lose1 * (1 - pah[0]))
    let m2 = (win2 * pah[1]) + (lose2 * (1 - pah[1]))

    document.getElementById('final').innerHTML = `
    Coefficinet bookmaker <br/>
    <b>${coefficients[0]}</b> vs <b>${coefficients[1]}</b><br/>
    Our calculate coefficients (without margin)<br/>
    <b>${our_coefficients[0]}</b> vs <b>${our_coefficients[1]}</b>
    Mathematical expectation</br>
    Team 1 / Player 1 <b>${m}</b></br>Team 2 / Player 2 <b>${m2}</b>
    `
}

document.getElementById('range').oninput = function(e) {
    let range = Number(e.target.value)
    document.getElementById('percent1').innerText = range + '%'
    document.getElementById('percent2').innerText = 100 - range + '%'
    main()
}

document.getElementById('k1').oninput = function(e) {
    main()
}

document.getElementById('k2').oninput = function(e) {
    main()
}

main()