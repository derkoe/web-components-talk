class MyButton extends HTMLElement {
  static get observedAttributes() {
    return ["type"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }
  render() {
    const type = this.getAttribute("type");
    this.shadowRoot.innerHTML = `
    <style>
        button {
          cursor: pointer;
          border: 5px solid black;
          background-color: ${type == "error" ? "red" : "green"};
        }
    </style>
    <button><slot></slot></button>`;
  }
}

customElements.define("my-button", MyButton);
