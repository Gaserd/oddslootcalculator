let fs = require('fs')

let json = JSON.parse(fs.readFileSync('./heroes_datdota.json', 'utf-8'))

function get_index_heroes(name, array_names) {
    let index = -1
    for (let i = 0; i < array_names.length; i++) {
        if (array_names[i] == name) {
            index = i
            break
        }
    }
    return index
}

function get_numbers_power(index_hero, index_enemy_hero) {
    return json.numbers[index_hero + 1][index_enemy_hero + 1]
}

function sum_numbers(sum, a) {
    if (typeof a !== 'undefined') {
        a = a.replace(',', '.')
        if (a.indexOf('+') !== -1) {
            a = a.replace('+', '')
            a = Number(a)
            sum = sum + a
        } else if (a.indexOf('-') !== -1) {
            a = a.replace('-', '')
            a = Number(a)
            sum = sum - a
        }
    }
    return sum
}

let dire_pick = ['Lich', 'Snapfire', 'Troll Warlord', 'Lifestealer', 'Clockwerk']
let radiant_pick = ['Nyx Assasin', 'Rubick', 'Void Spirit', 'Slardar', 'Puck']

let dire_pick_array = []
let radiant_pick_array = []

for (let i = 0; i < dire_pick.length; i++) {
    dire_pick_array.push({
        name: dire_pick[i],
        index: get_index_heroes(dire_pick[i], json.names),
    })

    radiant_pick_array.push({
        name: radiant_pick[i],
        index: get_index_heroes(radiant_pick[i], json.names),
    })
}

let sum_power_dire = 0
let sum_power_radiant = 0

for (let i = 0; i < dire_pick_array.length; i++) {
    let power = 0
    for (let j = 0; j < radiant_pick_array.length; j++) {
        power = sum_numbers(
            power,
            get_numbers_power(
                dire_pick_array[i].index,
                radiant_pick_array[j].index
            )
        )
    }
    dire_pick_array[i].power = power
    sum_power_dire = sum_power_dire + power
}

for (let i = 0; i < radiant_pick_array.length; i++) {
    let power = 0
    for (let j = 0; j < dire_pick_array.length; j++) {
        power = sum_numbers(
            power,
            get_numbers_power(
                radiant_pick_array[i].index,
                dire_pick_array[j].index
            )
        )
    }
    radiant_pick_array[i].power = power
    sum_power_radiant = sum_power_radiant + power
}

console.log(sum_power_dire, sum_power_radiant)



