import { Component, Element, Prop, State } from "@stencil/core";

@Component({
  tag: "dk-tabs",
  styleUrl: "dk-tabs.css",
  shadow: true
})
export class Tabs {
  /**
   * Index of the selected tab.
   */
  @Prop({
    mutable: true,
    reflectToAttr: true
  })
  selected = 0;

  @Element()
  el: HTMLElement;

  @State()
  tabs: HTMLDkTabElement[] = [];

  componentDidLoad() {
    this.updateTabs(this.el.shadowRoot.querySelector("slot"));
  }

  updateTabs(slot) {
    if (slot) {
      this.tabs = slot.assignedNodes({ flatten: true }).filter(el => {
        return el.nodeName === "DK-TAB";
      });
    } else {
      // this is for Browser not supporting HTMLSlotElement#assignedNodes
      this.tabs = Array.from(this.el.querySelector("#panels").children) as HTMLDkTabElement[];
    }
    this.selectTab(this.selected);
  }

  selectTab(idx: number) {
    this.selected = idx;
    for (let i = 0, tab; (tab = this.tabs[i]); ++i) {
      const selected = i === idx;
      tab.setAttribute("aria-hidden", !selected);
      // set style.display for Edge (CSS not working)
      if (selected) {
        tab.style.display = "";
      } else {
        tab.style.display = "none";
      }
    }
  }

  render() {
    return (
      <div>
        <div id="tabs">
          {this.tabs.map((tab: HTMLDkTabElement, index: number) => (
            <div title={tab.title} onClick={() => this.selectTab(index)}>
              {tab.title}
            </div>
          ))}
        </div>
        <div id="panels">
          <slot></slot>
        </div>
      </div>
    );
  }
}
