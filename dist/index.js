// Create a class for the element
class CardGenerator extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
    this._data = [];
    this._font = "Roboto";
    this._width = "200";

    this._shadow = this.attachShadow({ mode: this.getAttribute("shadow") });

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

  static get observedAttributes() {
    return ["data", "font", "width"];
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
    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");

    style.textContent = `
        .card-group {
          display: flex;
          flex-wrap: wrap;
          list-style: none;
          font-family: "${this.font}", sans-serif;
        }
  
        .card-item {
          font-size: 0.8rem;
          min-width: ${this.width}px;
          max-width: ${this.width}px;
          flex: 1;
          border: 1px solid #ccc;
          padding: 15px;
          background: white;
          border-radius: 5px;
          color: #000;
          margin: 10px;
        }
        .card-item div {
            line-height: 1.3rem;
            margin-bottom: 5px;
        }
        .label {
            display: block;
            font-weight: bold;
        }
        .sub-item {
            display: block;
            margin-left: 30px;
            line-height: 1.3rem;
        }
        .secondary {
            color: #909090;
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

    // Attach the created elements to the shadow dom
    this._shadow.appendChild(style);

    const content = this.fromJson(this.getAttribute("data"));
    if (Array.isArray(content)) {
      content.forEach(item => {
        this.buildCard(item);
      });
    } else {
      throw new Error("The data attribute should contain an Array of objects.");
    }
    this._shadow.appendChild(this._wrapper);
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
    }
    this.render();
  }
  connectedCallback() {
    this.data = this.getAttribute("data") || "";
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
