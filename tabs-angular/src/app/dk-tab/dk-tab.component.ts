import { Component, Input } from '@angular/core';

@Component({
  selector: 'dk-tab',
  template: '<slot></slot>',
})
export class DkTabComponent {
  @Input() title: string;
}
