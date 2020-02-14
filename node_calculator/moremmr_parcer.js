let node_fecth = require('node-fetch')
let heroes = require('./heroes').heroes
let fs = require('fs')

async function get_mmoremmr_matchups(hero) {
    let name = hero.localized_name.toLowerCase().replace(' ','-')

    return node_fecth(`https://moremmr.com/ru/api/heroes/${name}/matchups`)
    .then(res => res.json())
}


async function main() {

    let json = []

    for (let i = 0; i < heroes.length; i++) {
        let matchups = await get_mmoremmr_matchups(heroes[i])
        heroes[i].matchups = matchups
        json.push(heroes[i])
    }

    fs.writeFileSync('./heroes_matchups.json', JSON.stringify(json))
}

main()