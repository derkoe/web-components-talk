import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { TodoApp } from "./todo-app.component";
import { BrowserModule } from '@angular/platform-browser';
import { TodoStore } from './todo-store.service';

@NgModule({
  declarations: [TodoApp],
  entryComponents: [TodoApp],
  imports: [BrowserModule],
  providers: [TodoStore],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(injector: Injector) {
    const todoApp = createCustomElement(TodoApp, { injector });
    customElements.define("todo-app", todoApp);
  }
  ngDoBootstrap() {}
}
