const nav_icon = document.querySelector('.nav_icon')
const sideNav = document.querySelector('.side_navigation')
const icon = document.querySelector('#icon')

var isClicked = true
nav_icon.addEventListener('click', revealIn)
function revealIn(){
    if (isClicked){
        sideNav.style.visibility = 'visible'
        sideNav.style.transition = 'opacity 150ms ease-in-out'
        icon.classList.replace('fa-navicon', 'fa-close')
        isClicked = false
    }else{
        sideNav.style.visibility = 'hidden'
        icon.classList.replace('fa-close', 'fa-navicon')
        isClicked = true
    }
}

