import { setColorAliases }      from "./colorsUtils";
import {lightTheme, darkTheme } from "./colorThemes";

const addOn = {
  "home": homepageAddon,
  "manga": mangaAddon,
}
export var leTheme;


function base(root, theme) {
  document.querySelectorAll(".logo").forEach((function(element) {
    element.style.filter = theme.logo_inversion_filter;
    console.log(theme)
  }))
  setColorAliases(root, theme.id);
  document.body.style.background = theme.website_background_color;
  document.querySelectorAll('.discord').forEach(discord_logo => { discord_logo.style.filter = `brightness(${theme.discord_brightness})`;});
  document.querySelectorAll('.twitter').forEach(twitter_logo => { twitter_logo.style.filter = `brightness(${theme.twitter_brightness})`;});
 // document.querySelectorAll('.text').forEach(textBasedElement => {textBasedElement.style.color = theme.text_color});

  //document.querySelector(".logo").style.filter = theme.logo_inversion_filter;

  document.querySelector('.navBar').style.background = theme.menu_color;
  document.querySelector('.search input').style.background = theme.search_color;
  document.querySelector('.credit').style.backgroundColor = theme.credit_color;
  const icont = document.querySelectorAll('.icons').forEach(icon => { icon.style.filter = theme.icons_color})

}

function homepageAddon(theme) {

  const dots = document.querySelectorAll('.flickity-page-dot');
  const infoB = document.querySelectorAll('.info-b');

  dots.forEach(dot => {
    dot.style.background = theme.dots_color;
  });

  infoB.forEach(button => {
    button.style.background = theme.button_color;
  });

  document.querySelector('.latestChapter').style.color = theme.dernier_color;
  document.querySelector('.carousel').style.background = theme.carousel_background_color;
  document.querySelector('.info button').style.background = "#256d85"

}

function mangaAddon(theme) {

  document.querySelector('.latestChapter').style.color = theme.dernier_color;

}

export function switchTheme(root, theme, addOn) {

  base(root, theme);
  leTheme = theme;
  Object.values(addOn).forEach(element => addOn[element]);

}

export function stylePageTheme (root, light, addOn) {

    
    if (light) {
      switchTheme(root, lightTheme, addOn);
      document.querySelector("#dn").checked = false;
      return
    };
  switchTheme(root, darkTheme, addOn);
  document.querySelector("#dn").checked = true;
}
