import { Component, Listen, State } from '@stencil/core';
import { Todo, TodoFilter } from '../../todo';
import { TodoService } from '../../todo-service';

const ENTER_KEY = 13;

@Component({
	styleUrl: './index.css',
	tag: 'todo-app',
})
export class TodoApp {

	private todoService = new TodoService();

	@State() todos: Todo[] = this.todoService.load();

	@State() filter: TodoFilter = 'all';

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
						onKeyUp={event => this.onKeyUp(event)} />
				</header>
				<todo-list todos={this.filteredTodos} />
				{this.todos.length > 0 ? this.renderTodoFooter() : null}
			</section>
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
					<a onClick={() => this.filter = 'all'} class={{ selected: this.filter === 'all' }}>All</a>
				</li>
				<li>
					<a onClick={() => this.filter = 'active'} class={{ selected: this.filter === 'active' }}>Active</a>
				</li>
				<li>
					<a onClick={() => this.filter = 'completed'} class={{ selected: this.filter === 'completed' }}>Completed</a>
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

	@Listen('todoDeleted')
	private todoDeleted(event: DeleteTodoEvent) {
		this.todos = this.todoService.delete(event.detail as Todo);
	}

	@Listen('toggleCompleted')
	private toggleCompleted(event: ToggleCompletedEvent) {
		this.todos = this.todoService.toggleCompleted(event.detail);
	}

	@Listen('editTitle')
	private editTitle(event: EditTitleEvent) {
		this.todos = this.todoService.editTitle(event.detail.todo, event.detail.newTitle);
	}

	@Listen('toggleAll')
	private toggleAll(event: ToggleAllEvent) {
		this.todos = this.todoService.toggleAll(event.detail);
	}

	private onKeyUp(event: KeyboardEvent) {
		if (event.keyCode === ENTER_KEY) {
			const input = event.target as HTMLInputElement;
			const title = input.value.trim();
			if (title !== '') {
				this.todos = this.todoService.add(input.value);
				input.value = '';
			}
		}
	}

	@Listen('clearCompleted')
	private clearCompleted() {
		this.todos = this.todoService.clearCompleted();
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
