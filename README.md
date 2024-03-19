# LeseApp

A simple app to help kids learn to read.

Try it from mobile at [https://janmechtel.github.io/leseapp/](https://janmechtel.github.io/leseapp/)

1. Take a picture of the text to be read
2. Text is read out loud 
3. Kid is asked to read parts of the text (Coming soon)

![image](https://github.com/janmechtel/leseapp/assets/1004314/ef8f8284-b5d1-4be1-a509-57c09d1cc548)

## Setup
- using Google Cloud Vision for OCR and Google Speech for Text to Speech
- using simple Google Cloud Function to provide temporary access tokens to the front end
- using Github Pages for Hosting


## Local Development

- npm install
- npm run dev

## Deploy
- `npm run deploy`


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
