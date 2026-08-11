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
                    DEFAULT: { value: "#113946"},
                    200: { value: "#A1D7E8"},
                    400: { value: "#4FB3D4"},
                    600: { value: "#257C98"},
                },
                paper: {
                    DEFAULT: { value: "#EAF2F1"},
                    200: { value: "#BBD5D2"},
                    400: { value: "#7CAEA7"},
                    600: { value: "#4B7973"},
                },
                stamp: {
                    DEFAULT: { value: "#C1443B"},
                    200: { value: "#E6B2AF"},
                    400: { value: "#CF6860"},
                    600: { value: "#9A362F"},
                },
                amber: {
                    DEFAULT: { value: "#E8A33D"},
                    200: { value: "#F3CE98"},
                    600: { value: "#AB6E14"},
                },
                ink: {
                    DEFAULT: { value: "#16261F"},
                    600: { value: "#4E876E"},
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