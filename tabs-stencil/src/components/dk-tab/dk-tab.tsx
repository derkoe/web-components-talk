import { Component, Prop } from "@stencil/core";

@Component({
  tag: "dk-tab"
})
export class Tab {
  @Prop() label: string;
}
