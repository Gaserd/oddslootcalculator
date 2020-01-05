let length_doors = 3
let win_door = -1
let choose_username_door = -1
let number_win = 0

function local_storage_sync() {
    let win = localStorage.getItem('win')

    if (win == null) {
        localStorage.setItem('win', 0)
    } else {
        number_win = win
    }
}

function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function generate_win_door() {
    win_door = getRandomInt(0, length_doors - 1)
}

function choose_door(index) {
    let array = document.querySelectorAll('.door')
    for (let i = 0; i < array.length; i++) {
        array[i].className = 'door'
    }
    document.querySelector('.door[data-index="' + index + '"]').classList.add('choose_door')
}

function render_doors() {
    for (let i = 0; i < length_doors; i++) {
        let door_html = document.createElement('div')
        door_html.setAttribute('class', 'door')
        door_html.setAttribute('data-index', i)
        door_html.innerHTML = i
        door_html.onclick = function () {
            choose_door(i)
            setTimeout(function () {

                let question = [true, false]

                let flag = question[getRandomInt(0, 1)]

                if (flag) {
                    let confirm = window.confirm('Are you sure?')
                    if (confirm) {
                        if (i == win_door) {
                            alert('YOU WIN!')
                            number_win++
                            localStorage.setItem('win', number_win)
                        } else {
                            alert('YOU LOSE!')
                        }
                    } else {
                        alert('Okay, choose door again')
                    }
                } else {
                    if (i == win_door) {
                        alert('YOU WIN!')
                        number_win++
                        localStorage.setItem('win', number_win)
                    } else {
                        alert('YOU lose!')
                    }
                }

                restart_game()

            }, 1000)
        }
        let doors = document.querySelector('.doors')
        doors.appendChild(door_html)
    }
}

function render_win_lose() {
    document.querySelector('.win_lose').innerHTML = `Win - ${number_win}`
}

function restart_game() {
    document.querySelector('.doors').innerHTML = ''
    main()
}

function main() {
    local_storage_sync()
    generate_win_door()
    render_doors()
    render_win_lose()
}

main()