# Card Generator

This is a web component that produces cards using the data provided. It is opinionated so it ignores properties that have the word `id` in it. It also looks for the following keywords and produces the output as mentioned:

- `img`, `image`, `icon`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.ico` -> produces an `<img>` element
- `url` -> produces an `<a>` element.

## Installation

```
npm install @wynsoft/wsx-card-generator
```

`or`

```
yard add @wynsoft/wsx-card-generator
```

## Properties

The following properties are available and must be set at the initial stage, except for the `data` property which can be dynamically set.

- `font`: sets the font family to use.
- `width`: sets the width of the card.
- `background`: sets the background color for the card.
- `color`: sets the text color for the card.
- `data`: sets the data for the cards. This can be set dynamically.

## Usage

Add the script tag within the `<head>` tag of your HTML page:

```
<script src="node_modules/@wynsoft/wsx-card-generator/dist/index.js></script>
```

Not add the component within the `<body>`:

```
      <card-generator
        id="cardgroup1"
        font="Roboto"
        width="300"
        background="#fff"
        color="#000"
        data="[]"
      ></card-generator>
```

You can dynamically load the data by referencing the object by it's `id` and setting the `data` attribute.

E.g.

```
fetch("https://jsonplaceholder.typicode.com/users")
   .then(response => response.json())
   .then(json => {
    const src = JSON.stringify(json);
    let cardgrp1 = document.getElementById("cardgroup1");
    cardgrp1.setAttribute("data", src);
    });
```

### Demo

https://wynsoft.ca/wsx-card-generator
