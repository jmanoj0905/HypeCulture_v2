// React Theme — extracted from https://landonorris.com/
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
    neutral700: string;
    neutral800: string;
    neutral900: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '32': string;
    '38': string;
    '102.4': string;
    '97.7778': string;
    '94.0741': string;
    '86.6667': string;
    '82.963': string;
    '64.4444': string;
    '62.2222': string;
    '55.5556': string;
    '53.3333': string;
    '32.5926': string;
 *   };
 *   space: {
    '3': string;
    '21': string;
    '44': string;
    '56': string;
    '64': string;
    '80': string;
    '95': string;
    '101': string;
    '116': string;
    '130': string;
    '142': string;
    '151': string;
    '157': string;
    '166': string;
    '342': string;
    '462': string;
 *   };
 *   radii: {
    xs: string;
    md: string;
    lg: string;
    full: string;
 *   };
 *   shadows: {

 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#d2ff00",
    "secondary": "#b2c73a",
    "background": "#282c20",
    "foreground": "#000000",
    "neutral50": "#f4f4ed",
    "neutral100": "#282c20",
    "neutral200": "#535450",
    "neutral300": "#111112",
    "neutral400": "#dde1d2",
    "neutral500": "#b4b8a5",
    "neutral600": "#000000",
    "neutral700": "#3b3c38",
    "neutral800": "#343a26",
    "neutral900": "#ffffff"
  },
  "fonts": {
    "body": "'sans-serif', sans-serif"
  },
  "fontSizes": {
    "32": "32px",
    "38": "38px",
    "102.4": "102.4px",
    "97.7778": "97.7778px",
    "94.0741": "94.0741px",
    "86.6667": "86.6667px",
    "82.963": "82.963px",
    "64.4444": "64.4444px",
    "62.2222": "62.2222px",
    "55.5556": "55.5556px",
    "53.3333": "53.3333px",
    "32.5926": "32.5926px"
  },
  "space": {
    "3": "3px",
    "21": "21px",
    "44": "44px",
    "56": "56px",
    "64": "64px",
    "80": "80px",
    "95": "95px",
    "101": "101px",
    "116": "116px",
    "130": "130px",
    "142": "142px",
    "151": "151px",
    "157": "157px",
    "166": "166px",
    "342": "342px",
    "462": "462px"
  },
  "radii": {
    "xs": "2px",
    "md": "9px",
    "lg": "14px",
    "full": "39px"
  },
  "shadows": {},
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#d2ff00",
      "light": "hsl(71, 100%, 65%)",
      "dark": "hsl(71, 100%, 35%)"
    },
    "secondary": {
      "main": "#b2c73a",
      "light": "hsl(69, 56%, 65%)",
      "dark": "hsl(69, 56%, 35%)"
    },
    "background": {
      "default": "#282c20",
      "paper": "#b2c73a"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#f4f4ed"
    }
  },
  "typography": {
    "h1": {
      "fontSize": "64.4444px",
      "fontWeight": "700",
      "lineHeight": "55.1644px"
    }
  },
  "shape": {
    "borderRadius": 6
  },
  "shadows": []
};

export default theme;
