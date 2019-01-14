import { Component, Element, Listen, State } from '@stencil/core';
import { Todo, TodoFilter } from '../../todo';
import { TodoService } from '../../todo-service';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

@Component({
  shadow: true,
  styleUrl: './index.css',
  tag: 'todomvc-stencil',
})
export class TodoApp {

  private todoService = new TodoService();

  @State() todos: Todo[] = this.todoService.load();

  @State() editing: string | null;

  @State() filter: TodoFilter = 'all';

  @Element() el: HTMLStencilElement;

  get filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  render() {
    return (
      <section class="todoapp">
        <header class="header">
          <input class="new-todo" placeholder="What needs to be done?" autoComplete="on" autoFocus
            onKeyUp={event => this.onNewKeyUp(event)} />
        </header>
        {this.renderTodoList()}
        {this.todos.length > 0 ? this.renderTodoFooter() : null}
      </section>
    );
  }

  private renderTodoList() {
    return this.filteredTodos.length <= 0 ? null : (
      <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox"
          onClick={ev => this.toggleAll()} checked={this.allCompleted()} />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          {this.filteredTodos.map(todo => this.renderTodo(todo))}
        </ul>
      </section>
    );
  }

  private renderTodo(todo: Todo) {
    return (
      <li class={{ completed: todo.completed, editing: todo.id === this.editing }}>
        <div class="view">
          <input class="toggle" type="checkbox" checked={todo.completed}
            onChange={() => this.toggleCompleted(todo)} />
          <label onDblClick={event => this.edit(todo, event)}>{todo.title}</label>
          <button class="destroy" onClick={() => this.deleteTodo(todo)}></button>
        </div>
        <input class="edit"
          onBlur={ev => this.doneEdit(todo, ev)}
          onKeyUp={ev => this.onEditKeyUp(todo, ev)}
          value={todo.title} />
      </li>
    );
  }

  private renderTodoFooter() {
    let clearCompletedButton = null;
    if (this.todos.some(item => item.completed)) {
      clearCompletedButton = (
        <button class="clear-completed" onClick={(ev) => this.clearCompleted()}>Clear completed</button>
      );
    }

    return (<footer class="footer">
      {this.renderTodoCount()}
      <ul class="filters">
        <li>
          <a onClick={() => this.setFilter('all')} class={{ selected: this.filter === 'all' }}>All</a>
        </li>
        <li>
          <a onClick={() => this.setFilter('active')} class={{ selected: this.filter === 'active' }}>Active</a>
        </li>
        <li>
          <a onClick={() => this.setFilter('completed')} class={{ selected: this.filter === 'completed' }}>Completed</a>
        </li>
      </ul>
      {clearCompletedButton}
    </footer>);
  }

  private renderTodoCount() {
    const items = this.todos.filter(todo => !todo.completed).length;
    return (
      <span class="todo-count">
        <strong>{items}</strong> {items > 1 || items < 1 ? 'items' : 'item'} left
      </span>
    );
  }

  private onNewKeyUp(event: KeyboardEvent) {
    if (event.keyCode === ENTER_KEY) {
      const input = event.target as HTMLInputElement;
      const title = input.value.trim();
      if (title !== '') {
        this.todos = this.todoService.add(input.value);
        input.value = '';
      }
    }
  }

  private edit(todo: Todo, event: MouseEvent) {
    this.editing = todo.id;
    const element = this.el.shadowRoot;

    setTimeout(() => {
      if (element) {
        // set focus on edit item and put cursor to the end
        const editInput = element.querySelector('.editing .edit') as HTMLInputElement;
        if (editInput) {
          editInput.focus();
          editInput.selectionStart = editInput.value.length;
        }
      }
    }, 0);
  }

  private onEditKeyUp(todo: Todo, ev: KeyboardEvent) {
    if (ev.keyCode === ENTER_KEY) {
      this.doneEdit(todo, ev);
    } else if (ev.keyCode === ESCAPE_KEY) {
      this.editing = null;
    }
  }

  private doneEdit(todo: Todo, ev: UIEvent) {
    this.editing = null;
    const newTitle = (ev.target as HTMLInputElement).value.trim();
    if (newTitle && newTitle.length > 0) {
      this.todos = this.todoService.editTitle(todo, newTitle);
    } else {
      this.deleteTodo(todo);
    }
  }

  private deleteTodo(todo: Todo) {
    this.todos = this.todoService.delete(todo);
  }

  private toggleCompleted(todo: Todo) {
    this.todos = this.todoService.toggleCompleted(todo);
  }

  private toggleAll() {
    this.todos = this.todoService.toggleAll(!this.allCompleted());
  }

  private allCompleted() {
    return this.todos.filter(item => !item.completed).length === 0;
  }

  private clearCompleted() {
    this.todos = this.todoService.clearCompleted();
  }

  private setFilter(filter: TodoFilter) {
    this.filter = filter;
  }
}

interface ToggleCompletedEvent {
  detail: Todo;
}

interface EditTitleEvent {
  detail: {
    todo: Todo;
    newTitle: string;
  };
}

interface DeleteTodoEvent {
  detail: Todo;
}

interface ToggleAllEvent {
  detail: boolean;
}
