import { createSystem, defaultConfig, defineConfig, plainTextAdapter } from "@chakra-ui/react";

const config = defineConfig({
    globalCss: {
        "html, body": {
            bg: { base: "bg.canvas" },
            color: { base: "fg.default" },
        },
    },
    theme: {
        breakpoints: {
            sm: "480px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            xxl: "1546px",
        },
        tokens: {
            colors: {
                teal: {
                    DEFAULT: { value: "#113946" },
                    50: { value: "#DEF1F7" },
                    100: { value: "#CAE8F2" },
                    200: { value: "#A1D7E8" },
                    300: { value: "#78C5DE" },
                    400: { value: "#4FB3D4" },
                    500: { value: "#2F9DC1" },
                    600: { value: "#257C98" },
                    700: { value: "#1B5A6F" },
                    800: { value: "#113946" },
                    900: { value: "#07181D" },
                },
                paper: {
                    DEFAULT: { value: "#EAF2F1" },
                    50: { value: "#EAF2F1" },
                    100: { value: "#DAE8E7" },
                    200: { value: "#BBD5D2" },
                    300: { value: "#9BC1BC" },
                    400: { value: "#7CAEA7" },
                    500: { value: "#5E9891" },
                    600: { value: "#4B7973" },
                    700: { value: "#375955" },
                    800: { value: "#243A37" },
                    900: { value: "#101A19" },
                },
                stamp: {
                    DEFAULT: { value: "#c1443b" },
                    50: { value: "#f8eae9" },
                    100: { value: "#f2d8d6" },
                    200: { value: "#e6b2af" },
                    300: { value: "#da8d88" },
                    400: { value: "#cf6860" },
                    500: { value: "#c1443b" },
                    600: { value: "#9a362f" },
                    700: { value: "#732823" },
                    800: { value: "#4c1b17" },
                    900: { value: "#250d0b" },
                },
                amber: {
                    DEFAULT: { value: "#E8A33D" },
                    50: { value: "#FBEFDD" },
                    100: { value: "#F8E4C6" },
                    200: { value: "#F3CE98" },
                    300: { value: "#EDB96B" },
                    400: { value: "#E8A33D" },
                    500: { value: "#D88B1A" },
                    600: { value: "#AB6E14" },
                    700: { value: "#7D510F" },
                    800: { value: "#503309" },
                    900: { value: "#221604" },
                },
                ink: {
                    DEFAULT: { value: "#16261F" },
                    50: { value: "#F5F9F7" },
                    100: { value: "#E4F0EB" },
                    200: { value: "#C4DDD2" },
                    300: { value: "#A4CAB9" },
                    400: { value: "#84B8A1" },
                    500: { value: "#63A588" },
                    600: { value: "#4E876E" },
                    700: { value: "#3B6754" },
                    800: { value: "#294639" },
                    900: { value: "#16261F" },
                },
            },
            fonts: {
                heading: { value: `'Fraunces', serif`},
                body: { value: `'Work Sans', sans-serif`},
            },
        },
        semanticTokens: {
            colors: {
                bg: {
                    canvas: { value: "{colors.paper}"},
                    emphasized: { value: "{colors.teal}"},
                },
                fg: {
                    default: { value: "{colors.ink}"},
                    muted: { value: "{colors.teal.600}"},
                },
                accent: {
                    solid: { value: "{colors.stamp}"},
                    emphasized: { value: "{colors.stamp.600}"},
                },
                highlight: { value: "{colors.amber}" },
            },
        },
    },
})

export const system = createSystem(defaultConfig, config);