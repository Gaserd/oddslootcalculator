function main() {

    let flagFirstInit = localStorage.getItem('firstInit')
    if (flagFirstInit == null) {
        localStorage.setItem('firstInit', 1)
        drawFirstInitPopup()
    }

    initClips()
}

function drawFirstInitPopup() {
    let modal = document.getElementById("myModal");
    let close = document.querySelector(".close");
    modal.style.display = "block";

    close.addEventListener('click', function() {
        modal.style.display = "none";
        localStorage.setItem('firstInit', 1)
    })

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            localStorage.setItem('firstInit', 1)
        }
    }
}

main()