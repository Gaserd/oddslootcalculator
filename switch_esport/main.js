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
    let span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            localStorage.setItem('firstInit', 1)
        }
    }
}

main()