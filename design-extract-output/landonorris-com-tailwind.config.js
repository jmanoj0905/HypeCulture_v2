/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(71, 100%, 97%)',
            '100': 'hsl(71, 100%, 94%)',
            '200': 'hsl(71, 100%, 86%)',
            '300': 'hsl(71, 100%, 76%)',
            '400': 'hsl(71, 100%, 64%)',
            '500': 'hsl(71, 100%, 50%)',
            '600': 'hsl(71, 100%, 40%)',
            '700': 'hsl(71, 100%, 32%)',
            '800': 'hsl(71, 100%, 24%)',
            '900': 'hsl(71, 100%, 16%)',
            '950': 'hsl(71, 100%, 10%)',
            DEFAULT: '#d2ff00'
        },
        secondary: {
            '50': 'hsl(69, 56%, 97%)',
            '100': 'hsl(69, 56%, 94%)',
            '200': 'hsl(69, 56%, 86%)',
            '300': 'hsl(69, 56%, 76%)',
            '400': 'hsl(69, 56%, 64%)',
            '500': 'hsl(69, 56%, 50%)',
            '600': 'hsl(69, 56%, 40%)',
            '700': 'hsl(69, 56%, 32%)',
            '800': 'hsl(69, 56%, 24%)',
            '900': 'hsl(69, 56%, 16%)',
            '950': 'hsl(69, 56%, 10%)',
            DEFAULT: '#b2c73a'
        },
        'neutral-50': '#f4f4ed',
        'neutral-100': '#282c20',
        'neutral-200': '#535450',
        'neutral-300': '#111112',
        'neutral-400': '#dde1d2',
        'neutral-500': '#b4b8a5',
        'neutral-600': '#000000',
        'neutral-700': '#3b3c38',
        'neutral-800': '#343a26',
        'neutral-900': '#ffffff',
        background: '#282c20',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Mona Sans Variable',
            'sans-serif'
        ],
        heading: [
            'Brier',
            'sans-serif'
        ],
        font2: [
            'sans-serif',
            'sans-serif'
        ]
    },
    fontSize: {
        '32': [
            '32px',
            {
                lineHeight: '36px'
            }
        ],
        '38': [
            '38px',
            {
                lineHeight: '44px'
            }
        ],
        '102.4': [
            '102.4px',
            {
                lineHeight: '20px'
            }
        ],
        '97.7778': [
            '97.7778px',
            {
                lineHeight: '81.1555px',
                letterSpacing: '-2.22222px'
            }
        ],
        '94.0741': [
            '94.0741px',
            {
                lineHeight: '84.6667px',
                letterSpacing: '-0.740741px'
            }
        ],
        '86.6667': [
            '86.6667px',
            {
                lineHeight: '70.2px',
                letterSpacing: '-2.59259px'
            }
        ],
        '82.963': [
            '82.963px',
            {
                lineHeight: '70.5185px',
                letterSpacing: '-2.96296px'
            }
        ],
        '64.4444': [
            '64.4444px',
            {
                lineHeight: '55.1644px',
                letterSpacing: '-1.48148px'
            }
        ],
        '62.2222': [
            '62.2222px',
            {
                lineHeight: '58.4889px'
            }
        ],
        '55.5556': [
            '55.5556px',
            {
                lineHeight: '49.2222px'
            }
        ],
        '53.3333': [
            '53.3333px',
            {
                lineHeight: '47.2533px',
                letterSpacing: '-1.48148px'
            }
        ],
        '32.5926': [
            '32.5926px',
            {
                lineHeight: '28.877px',
                letterSpacing: '-1.48148px'
            }
        ],
        '31.1111': [
            '31.1111px',
            {
                lineHeight: '27.5644px',
                letterSpacing: '-1.48148px'
            }
        ],
        '23.7037': [
            '23.7037px',
            {
                lineHeight: '24.6518px',
                letterSpacing: '0.592593px'
            }
        ],
        '22.2222': [
            '22.2222px',
            {
                lineHeight: '22.2222px'
            }
        ]
    },
    spacing: {
        '0': '3px',
        '1': '21px',
        '2': '44px',
        '3': '56px',
        '4': '64px',
        '5': '80px',
        '6': '95px',
        '7': '101px',
        '8': '116px',
        '9': '130px',
        '10': '142px',
        '11': '151px',
        '12': '157px',
        '13': '166px',
        '14': '342px',
        '15': '462px',
        '16': '471px'
    },
    borderRadius: {
        xs: '2px',
        md: '9px',
        lg: '14px',
        full: '39px'
    },
    screens: {
        md: '768px',
        lg: '992px',
        '1920px': '1920px'
    },
    transitionDuration: {
        '100': '0.1s',
        '200': '0.2s',
        '300': '0.3s',
        '600': '0.6s',
        '750': '0.75s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.19, 1, 0.22, 1)',
        default: 'ease'
    },
    container: {
        center: true,
        padding: '0px'
    },
    maxWidth: {
        container: '800px'
    }
},
  },
};
