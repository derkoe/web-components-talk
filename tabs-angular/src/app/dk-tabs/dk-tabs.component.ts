import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DkTabComponent } from '../dk-tab/dk-tab.component';

@Component({
  selector: 'dk-tabs',
  templateUrl: './dk-tabs.component.html',
  styleUrls: ['./dk-tabs.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class DkTabsComponent {

  tabs: DkTabComponent[];

  @Input() selected: number;

  slotChange($event) {
    this.tabs = $event.target.assignedNodes({ flatten: true }).filter(el => {
      return el.nodeName === "DK-TAB";
    });
    this.selectTab(this.selected || 0);
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

}
