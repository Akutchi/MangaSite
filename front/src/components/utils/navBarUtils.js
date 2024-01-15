export function OnMainLogoClick(isMobile) {
    console.log(isMobile)
    if (!isMobile) {
        window.location.href = "/";
        return;
    }
    let menuElement = document.getElementById('liste')

    if (menuElement.style.transform === `translateY(0%)`) {

        menuElement.style.transform = `translateY(-103%)`;
        document.querySelector(".search input").blur();
    } else {
        menuElement.style.transform = `translateY(0%)`
    }
};

export function OnMouseEnterNavBar(light, isMobile) {
    if(isMobile) return;
    let menuElement = document.getElementById('liste')

    /* if (light) {
        let logo = document.getElementById('logo');
        logo.style.filter = `brightness(1.5) drop-shadow(2px 4px 6px black) hue-rotate(201deg) invert(1)`;
    } */
    variable = true;
    countdownAction();
    menuElement.style.transform = `translateY(0%)`;

};

let variable = true;
let countdown = null;

function countdownAction() {
    try {
        if (!variable) {
            const timer = setTimeout(() => {
                let menuElement = document.getElementById('liste');
                if(menuElement){
                    menuElement.style.transform = 'translateY(-103%)';
                    document.querySelector(".search input").blur();
                    document.querySelector(".search input").value = "";
                } else{
                    console.log("Le menu n'était pas encore chargé")
                }

            }, 600);
            countdown = timer;
        } else {
            if (countdown) {
                clearTimeout(countdown);
                countdown = null;
            }
        }
    } catch (error) {
        console.error("Une erreur s'est produite :", error);

    }
}

export function OnMouseLeaveNavBar(light) {
    /* if (light) {
        let logo = document.getElementById('logo');
        logo.style.filter = `drop-shadow(2px 4px 6px black) hue-rotate(201deg) invert(1)`;
    } */
    variable = false;
    countdownAction();

};

