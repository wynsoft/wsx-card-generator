// Create a class for the element
class CardGenerator extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
    this._data = [];
    this._font = "Roboto";
    this._width = "200";
    this._background = "#fff";
    this._color = "#000";

    this._shadowDOM = this.attachShadow({ mode: "closed" });

    // Create spans
    this._wrapper = document.createElement("ul");
    this._wrapper.setAttribute("class", "card-group");
  }

  get data() {
    return this._data;
  }
  set data(data) {
    this.setAttribute("data", data);
  }

  get font() {
    return this._font;
  }
  set font(font) {
    this.setAttribute("font", font);
  }

  get width() {
    return this._width;
  }
  set width(width) {
    this.setAttribute("width", width);
  }

  get background() {
    return this._background;
  }
  set background(background) {
    this.setAttribute("background", background);
  }

  get color() {
    return this._color;
  }
  set color(color) {
    this.setAttribute("color", color);
  }

  static get observedAttributes() {
    return ["data", "font", "width", "background", "color"];
  }

  capitalize(str) {
    return str.replace(/(?:^|\s)\S/g, a => {
      return a.toUpperCase();
    });
  }

  buildSubItems(obj, parent) {
    if (typeof obj === "object") {
      for (var key in obj) {
        let el = document.createElement("span");
        el.setAttribute("class", "sub-item");
        if (typeof obj[key] !== "object") {
          el.innerHTML =
            "<span class='secondary'>" +
            this.capitalize(key) +
            "</span>: " +
            obj[key];
          parent.appendChild(el);
          el = null;
        } else {
          let el1 = document.createElement("span");
          el1.setAttribute("class", "label");
          el1.textContent = this.capitalize(key);
          parent.appendChild(el1);
          el1 = null;
        }
        this.buildSubItems(obj[key], parent);
      }
      delete obj[key];
    }
  }

  buildCard(obj) {
    if (typeof obj == "object") {
      const card = document.createElement("li");
      card.setAttribute("class", "card-item");
      for (var key in obj) {
        const keyName = key.toLowerCase().toString();
        let keyValue = "";
        if (typeof obj[key] !== "object") {
          keyValue = obj[key];
        }
        if (!keyName.includes("id")) {
          let text = document.createElement("div");
          let keyEl = document.createElement("span");
          keyEl.setAttribute("class", "label");
          keyEl.textContent = this.capitalize(key);
          card.appendChild(keyEl);
          if (typeof obj[key] === "object") {
            this.buildSubItems(obj[key], text);
          } else if (keyName.includes("url")) {
            let link = document.createElement("a");
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noreferrer, noopener");
            link.setAttribute("href", obj[key]);
            link.setAttribute("class", "link");
            link.textContent = obj[key];
            card.appendChild(link);
          } else if (
            keyName.includes("img") ||
            keyName.includes("image") ||
            keyName.includes("icon") ||
            keyValue.includes(".jpg") ||
            keyValue.includes(".jpeg") ||
            keyValue.includes(".gif") ||
            keyValue.includes(".png") ||
            keyValue.includes(".bmp") ||
            keyValue.includes(".ico")
          ) {
            let img = document.createElement("img");
            img.setAttribute("src", obj[key]);
            img.setAttribute("class", "image");
            card.appendChild(img);
          } else {
            text.textContent += obj[key];
          }
          card.appendChild(text);
          text = null;
        }
        delete obj[key];
      }
      this._wrapper.appendChild(card);
    }
  }

  render() {
    // Attach the created elements to the shadow dom
    const content = this.fromJson(this.getAttribute("data"));
    if (Array.isArray(content)) {
      content.forEach(item => {
        this.buildCard(item);
      });
    } else {
      throw new Error("The data attribute should contain an Array of objects.");
    }
    this._shadowDOM.appendChild(this._wrapper);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._wrapper.innerHTML = "";
    switch (name) {
      case "data":
        this._data = newValue;
        break;
      case "font":
        this._font = newValue;
        break;
      case "width":
        this._width = newValue;
        break;
      case "background":
        this._background = newValue;
        break;
      case "color":
        this._color = newValue;
        break;
    }
    this.render();
  }

  connectedCallback() {
    const css = `
    .card-group {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;
      margin: 0;
      font-family: "${this.font}", sans-serif;
    }

    .card-item {
      font-size: 0.8rem;
      min-width: ${this.width}px;
      max-width: ${this.width}px;
      flex: 1;
      border: 1px solid #ccc;
      padding: 15px;
      background-color: ${this.background};
      border-radius: 5px;
      color: ${this.color};
      margin: 10px;
    }
    .card-item div {
        line-height: 1.3rem;
        margin-bottom: 5px;
    }
    .label {
        display: block;
        font-weight: 600;
    }
    .sub-item {
        display: block;
        margin-left: 20px;
        line-height: 1.3rem;
    }
    .secondary {
        margin-right: 15px;
        display: inline-block;
        min-width: 75px;
    }
    .image {
        max-width: 100%;
    }
    .link {
        color: #003366;
        text-decoration: none;
    }
    .link:hover {
        text-decoration: underline;
    }
    .link:visited {
        color: #003366;
    }
  `;
    const style = document.createElement("style");
    style.textContent = css;
    this._shadowDOM.appendChild(style);
  }

  fromJson(str) {
    let obj = null;
    if (typeof str == "string") {
      try {
        obj = JSON.parse(str);
      } catch (e) {
        throw new Error(
          "The JSON string provided in the content attribute is invalid. "
        );
      }
    }
    return obj;
  }
}

// Define the new element
customElements.define("card-generator", CardGenerator);
