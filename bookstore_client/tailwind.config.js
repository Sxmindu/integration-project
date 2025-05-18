/** @type {(tailwindConfig: object) => object} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: ["./src/**/*.{html,js}"],
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        colors: {
            'main-purple': '#008000',
            // 'main-purple': '#8458B3',
            'light-purple': '#D0BDF4',
            'main-gray': '#494D5F',
            'white': '#FFFFFF',
            'black': '#000000',
            'success-green': '#29CC97',
            'label-green-dark': '#03543f',
            'label-green-light': '#def7ec',
            'label-purple-dark': '#5521b5',
            'label-purple-light': '#edebfe',
            'error-red': '#CC4545',
        },
        fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
            serif: ['Montserrat', 'serif'],
        },
        extend: {
            colors: {
                'main-purple': '#008000',
                'light-purple': '#D0BDF4',
                'main-gray': '#494D5F',
                'white': '#FFFFFF',
                'black': '#000000',
                'success-green': '#29CC97',
                'error-red': '#CC4545',
            },
            transitionProperty: {
                'height': 'height',
                'rotate': 'rotate',
            }
        }
    },
    plugins: [

    ],
});

