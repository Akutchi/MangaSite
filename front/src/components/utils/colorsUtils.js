const LIGHT = 0;
const DARK = 1;

const BS_colors = {

    light: [
        {alias:"--color-BS1" , value:"#041d2d"},
        {alias:"--color-BS1-5" , value:"#9ad9ff"},
        {alias:"--color-BS2" , value:"#06283d"},
        {alias:"--color-BS3" , value:"#34b5e0"},
        {alias:"--color-BS4" , value:"#47b5ff"},
        {alias:"--color-BS4BIS" , value:"#76c8ff"},
        {alias:"--color-BS5" , value:"#dff6ff"},
        {alias:"--effet_logo" , value:  "brightness(1.5) drop-shadow(2px 4px 6px black) hue-rotate(201deg) invert(1)"},
        {alias:"--DerriereFlickity" , value:"#ceefff"},
    ],
    dark: [
        {alias:"--color-BS1" , value:'#dff6ff'},
        {alias:"--color-BS1-5" , value:'#06283d'},
        {alias:"--color-BS2" , value:'#47b5ff'},
        {alias:"--color-BS3" , value:'#256d85'},
        {alias:"--color-BS4" , value:'#06283d'},
        {alias:"--color-BS4BIS" , value:'#06283d'},
        {alias:"--color-BS5" , value:'#041d2d'},
        {alias:"--effet_logo" , value:"drop-shadow(2px 4px 6px black) brightness(1.2)"},
        {alias:"--DerriereFlickity" , value:"#061b2c"},
    ]
}


// 1000 is black - 000 is white
const shades = {

    light: [
        {alias: '--color-000', value: '#000'},
        {alias: '--color-100', value: '#1a1a1a'},
        {alias: '--color-200', value: '#212121'},
        {alias: '--color-300', value: '#333'},
        {alias: '--color-500', value: '#5a5a5a'},
        {alias: '--color-700', value: '#989898'},
        {alias: '--color-800', value: '#cacaca'},
        {alias: '--color-850', value: '#e1e1e1'},
        {alias: '--color-900', value: '#f4f4f4'},
        {alias: '--color-1000',value: '#fff'},
    ],
    dark: [
        {alias: '--color-1000', value: '#000'},
        {alias: '--color-900', value: '#1a1a1a'},
        {alias: '--color-850', value: '#212121'},
        {alias: '--color-800', value: '#333'},
        {alias: '--color-700', value: '#5a5a5a'},
        {alias: '--color-500', value: '#989898'},
        {alias: '--color-300', value: '#cacaca'},
        {alias: '--color-200', value: '#e1e1e1'},
        {alias: '--color-100', value: '#f4f4f4'},
        {alias: '--color-000',value: '#fff'},
    ],
}

export function setColorAliases(root, theme_id) {

    switch (theme_id) {
        
        case LIGHT:
            BS_colors.light.forEach(color => root.style.setProperty(color.alias, color.value));
            shades.light.forEach(color => root.style.setProperty(color.alias, color.value));
            return;

        case DARK:
            BS_colors.dark.forEach(color => root.style.setProperty(color.alias, color.value));
            shades.dark.forEach(color => root.style.setProperty(color.alias, color.value));
            return;

        default:
            BS_colors.dark.forEach(color => root.style.setProperty(color.alias, color.value));
            shades.dark.forEach(color => root.style.setProperty(color.alias, color.value));
            return;
    }
}