let color = require('cli-color')

let player1 = 'Mouse'
let player2 = 'Navi'

let k1 = 1.6
let k2 = 2.27
let marg = (1 - (1 / k1 + 1 / k2)) * -1
/*
k - коэффициент выигрыша у букмекера
marg - рассчитываем маржинальность букмекера
*/


let sum_matches = 10

let win_matches_player_1 = 9
let win_matches_player_2 = 7
let ph1 = 1 / 2
let ph2 = 1 / 2
let ph1a = win_matches_player_1 / sum_matches
let ph2a = win_matches_player_2 / sum_matches

let pa = (ph1 * ph1a) + (ph2 * ph2a)
let pah1 = (ph1 * ph1a) / pa
let pah2 = (ph2 * ph2a) / pa

/*

sum_matches - кол-во матчей сыгранных против друг друга у команд
win_matches - кол-во выигранных
ph1 - говорим что вероятнсоть победы команды 50%
ph1a - статистическая вероятность, то есть отношение количества
выигранных матчей команды к общему количеству матчей
pa - полная вероятность наступления события
pah1 - формула Байеса

*/

let kk = (1 / pah1 + marg)
let kk2 = (1 / pah2 + marg)

/*
h1 - гипотеза что выиграет команда/игрок 1
h2 - гипотеза что выиграет команда/игрок 2
*/

let s = 100
/*
s - сумма ставки
*/

let win1 = (s * k1) - s
let lose1 = -s

let win2 = (s * k2) - s
let lose2 = -s

/*
 Тогда размер выигрыша – (S*k-S), а размер проигрыша (-S).
*/

let m = (win1 * pah1) + (lose1 * (1-pah1))
let m2 = (win2 * pah2) + (lose2 * (1-pah2))

/*
S – сумма ставки;
k – коэффициент;
W – вероятность победы;
(1-W) - вероятность поражения;
Тогда размер выигрыша – (S*k-S), а размер проигрыша (-S).
Формула для расчета математического ожидания выглядит следующим
образом: [2]
M(X)=(S*k-S)*W+ (-S)*(1-W)
*/


console.log(color.black.bgWhite(`
    коэффициенты букмекера
    ${color.bold(player1)} ${color.red(k1)} vs ${color.red(k2)} ${color.bold(player2)}
    маржа букмекера в этом матче ${color.red.bold(marg * 100)} %
    рассчитанные коэффициенты
    ${color.bold(player1)} ${color.red(kk)} vs ${color.red(kk2)} ${color.bold(player2)}
    математическое ожидание в - ${color.blue.bold(m)}, если ставим на ${color.bold(player1)} при ставке в ${s}
    математическое ожидание в - ${color.blue.bold(m2)}, если ставим на ${color.bold(player2)} при ставке в ${s}
`))


/*
скриптик для открытия всех счетов https://game-tournaments.com/
var a = document.querySelectorAll('.mbutton.tresult')
for (let i = 0; i < 10; i++) { a[i].click() }
*/




