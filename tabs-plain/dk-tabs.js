class DkTabs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-wrap: wrap;
    }
    ::slotted(dk-tab) {
      flex-basis: 100%;
    }
  </style>
  <slot></slot>`;
  }
  connectedCallback() {
    const tabsSlot = this.shadowRoot.querySelector("slot");
    console.log(tabsSlot.assignedElements({ flatten: true }))
    setTimeout(
      () => console.log(tabsSlot.assignedElements({ flatten: true })),
      1
    );
    this.tabs = tabsSlot.assignedNodes({ flatten: true }).filter(el => {
      return el.nodeType === Node.ELEMENT_NODE;
    });
  }
}
customElements.define("dk-tabs", DkTabs);

let dkTabCounter = 0;
class DkTab extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.id) {
      this.id = `dk-tab-generated-${dkTabCounter++}`;
    }
  }

  set selected(value) {
    value = Boolean(value);
    if (value) this.setAttribute("selected", "");
    else this.removeAttribute("selected");
  }

  get selected() {
    return this.hasAttribute("selected");
  }
}
customElements.define("dk-tab", DkTab);
