const template = `<style>
:host {
  display: inline-block;
  font-family: sans-serif;
  contain: content;
}
:host([background]) {
  background: var(--background-color, #9E9E9E);
  border-radius: 10px;
  padding: 10px;
}
#panels {
  box-shadow: 0 2px 2px rgba(0, 0, 0, .3);
  background: white;
  border-radius: 3px;
  padding: 16px;
  overflow: auto;
}
#tabs {
  display: inline-flex;
  -webkit-user-select: none;
  user-select: none;
}
#tabs div {
  font: 400 16px/22px sans-serif;
  padding: 16px 8px;
  margin: 0;
  text-align: center;
  width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background: linear-gradient(#fafafa, #eee);
}
#panels ::slotted([aria-hidden="true"]) {
  display: none;
}
</style>
<div id="tabs"></div>
<div id="panels"><slot></slot></div>`;

class DkTabs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = template;
  }
  get selected() {
    return this._selected;
  }
  set selected(idx) {
    this._selected = idx;
    this._selectTab(idx);
    this.setAttribute("selected", idx);
  }
  connectedCallback() {
    this.shadowRoot.addEventListener("slotchange", e => this._updateTabs());
    this._selected = 0;
  }
  _updateTabs() {
    const tabsSlot = this.shadowRoot.querySelector("slot");
    this.tabs = tabsSlot.assignedNodes({ flatten: true }).filter(el => {
      return el.nodeName === "DK-TAB";
    });
    const tabHeadersElm = this.shadowRoot.getElementById("tabs");
    for (let i = 0, tab; tab = this.tabs[i]; ++i) {
      const existingTitle = this.shadowRoot.querySelector(`#${tab.id}-title`);
      if (!existingTitle) {
        const tabHeader = document.createElement("div");
        tabHeader.setAttribute("id", `${tab.id}-title`)
        tabHeader.addEventListener("click", (div, ev) => this._selectTab(i))
        tabHeader.setAttribute("title", tab.title);
        tabHeader.appendChild(document.createTextNode(tab.title));
        tabHeadersElm.appendChild(tabHeader);
      }
    }
    this._selectTab(this.selected)
  }
  _selectTab(idx) {
    for (let i = 0, tab; tab = this.tabs[i]; ++i) {
      const selected = i === idx;
      tab.setAttribute('aria-selected', selected);
      tab.setAttribute('aria-hidden', !selected);
    }
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
}
customElements.define("dk-tab", DkTab);
