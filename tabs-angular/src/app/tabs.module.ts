import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { createCustomElement } from "@angular/elements";

import { DkTabsComponent } from "./dk-tabs/dk-tabs.component";
import { DkTabComponent } from "./dk-tab/dk-tab.component";

@NgModule({
  declarations: [DkTabsComponent, DkTabComponent],
  entryComponents: [DkTabsComponent],
  imports: [BrowserModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabsModule {
  constructor(injector: Injector) {
    const dkTabs = createCustomElement(DkTabsComponent, { injector });
    customElements.define("dk-tabs", dkTabs);
  }
  ngDoBootstrap(){}
}
