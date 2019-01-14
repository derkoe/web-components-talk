import { Component, ViewEncapsulation } from '@angular/core';
import { TodoFilter, TodoStore, Todo } from './todo-store.service';

@Component({
  selector: 'todomvc-angular',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TodoApp {
  todoStore: TodoStore;
  newTodoText = '';

  constructor(todoStore: TodoStore) {
    this.todoStore = todoStore;
  }

  stopEditing(todo: Todo, editedTitle: string) {
    todo.title = editedTitle;
    todo.editing = false;
  }

  cancelEditingTodo(todo: Todo) {
    todo.editing = false;
  }

  updateEditingTodo(todo: Todo, editedTitle: string) {
    editedTitle = editedTitle.trim();
    todo.editing = false;

    if (editedTitle.length === 0) {
      return this.todoStore.remove(todo);
    }

    todo.title = editedTitle;
  }

  editTodo(todo: Todo) {
    todo.editing = true;
  }

  removeCompleted() {
    this.todoStore.removeCompleted();
  }

  toggleCompletion(todo: Todo) {
    this.todoStore.toggleCompletion(todo);
  }

  remove(todo: Todo) {
    this.todoStore.remove(todo);
  }

  addTodo() {
    if (this.newTodoText.trim().length) {
      this.todoStore.add(this.newTodoText);
      this.newTodoText = '';
    }
  }
}
