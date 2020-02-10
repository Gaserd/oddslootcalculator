function getData() {
    let team1 = document.getElementById('team1').value
    let team2 = document.getElementById('team2').value
    let coefficient = document.getElementById('coefficient').value
    let money = document.getElementById('money').value

    return {
        team1, team2, coefficient, money
    }
}

function setCoupon() {
    let object = getData()
    let date = new Date()
    let options = { year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute:'numeric' };
    date = date.toLocaleDateString('ru', options)
    date = date.replace(',','')
    date = date + '(GMT +03:00)'
    document.getElementById('date').innerHTML = date
    document.getElementById('teams').innerHTML = object['team1'] + ' vs ' + object['team2']
    document.getElementById('winner').innerHTML = '<b>' + object['team1'] + '</b>'
    document.getElementById('coefficient_value').innerHTML = object['coefficient']
    document.getElementById('money_value').innerHTML = Number(object['money']).toFixed(2)
    document.getElementById('money_win').innerHTML = '+' + (object['money'] * object['coefficient']).toFixed(2)
    document.getElementById('hash').innerHTML = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

document.getElementById('generate').addEventListener('click', function() {
    setCoupon()
})