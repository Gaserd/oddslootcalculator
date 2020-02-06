let win_array = [
    31.25,
    0,
    48,
    40,
    84,
    9.8,
    81,
    19,
    40,
    19,
    100,
    6,
    10,
    35,
    24,
    12,
    16,
    0.7,
    43,
    6,
    4.7,
    33,
    33,
    48,
    39,
    4,
    29,
    39,
    23
]

let lose_array = [
    14,
    11,
    2,
    72,
    54,
    48,
    50,
    21,
    10,
    66,
    103,
    2,
    20,
    80,
    81,
    153,
    40,
    9,
    129,
    32,
    12,
    7,
    0.49,
    19,
    38,
    74,
    80,
    14,
    18,
    92,
    18,
    72
]

function median(arr) {
    arr = arr.sort(function (a, b) { return a - b; });
    var i = arr.length / 2;
    return i % 1 == 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)];
}

console.log(median(lose_array))