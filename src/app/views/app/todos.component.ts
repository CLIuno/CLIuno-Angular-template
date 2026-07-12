import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { TodoApiService } from '../../services/todo-api.service'
import { AuthStore } from '../../services/auth.store'
import { timeAgo } from '../../utils/helpers'
import { Todo } from '../../types/models'

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-8">
      <!-- Header -->
      <div class="tw:flex tw:items-center tw:justify-between tw:mb-8">
        <div>
          <h1 class="tw:text-3xl tw:font-bold tw:text-base-content">Todos</h1>
          <p class="tw:text-base-content/60">Manage your tasks and collaborate with others</p>
        </div>
        <button (click)="showCreateModal = true" class="tw:btn tw:btn-primary">
          <iconify-icon icon="mdi:plus" width="20"></iconify-icon>
          New Todo
        </button>
      </div>

      <!-- Filters -->
      <div class="tw:tabs tw:tabs-boxed tw:mb-6 tw:w-fit">
        <button class="tw:tab" [class.tw:tab-active]="filter === 'all'" (click)="filter = 'all'">
          All
        </button>
        <button class="tw:tab" [class.tw:tab-active]="filter === 'mine'" (click)="filter = 'mine'">
          Mine
        </button>
        <button
          class="tw:tab"
          [class.tw:tab-active]="filter === 'active'"
          (click)="filter = 'active'"
        >
          Active
        </button>
        <button
          class="tw:tab"
          [class.tw:tab-active]="filter === 'completed'"
          (click)="filter = 'completed'"
        >
          Completed
        </button>
      </div>

      <!-- Loading -->
      @if (loading) {
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary"></span>
        </div>
      }

      <!-- Empty State -->
      @if (!loading && filteredTodos.length === 0) {
        <div class="tw:text-center tw:py-20">
          <iconify-icon
            icon="mdi:clipboard-check-outline"
            width="64"
            class="tw:mx-auto tw:text-base-content/30"
          ></iconify-icon>
          <h3 class="tw:text-xl tw:font-semibold tw:mt-4">No todos yet</h3>
          <p class="tw:text-base-content/60 tw:mt-2">Create your first todo to get started!</p>
        </div>
      }

      <!-- List -->
      @if (!loading && filteredTodos.length > 0) {
        <div class="tw:space-y-3">
          @for (todo of filteredTodos; track todo.id) {
            <div
              class="tw:card tw:bg-base-100 tw:shadow-sm hover:tw:shadow-md tw:transition-shadow"
            >
              <div class="tw:card-body tw:p-4">
                <div class="tw:flex tw:items-start tw:gap-3">
                  <!-- Checkbox -->
                  @if (todo.user.id === authStore.user()?.id) {
                    <button (click)="toggleTodo(todo.id)" class="tw:mt-1 tw:shrink-0">
                      <iconify-icon
                        [icon]="
                          todo.is_completed
                            ? 'mdi:checkbox-marked-circle'
                            : 'mdi:checkbox-blank-circle-outline'
                        "
                        width="24"
                        [class]="todo.is_completed ? 'tw:text-success' : 'tw:text-base-content/30'"
                      ></iconify-icon>
                    </button>
                  } @else {
                    <div class="tw:mt-1 tw:shrink-0">
                      <iconify-icon
                        [icon]="
                          todo.is_completed
                            ? 'mdi:checkbox-marked-circle'
                            : 'mdi:checkbox-blank-circle-outline'
                        "
                        width="24"
                        [class]="todo.is_completed ? 'tw:text-success' : 'tw:text-base-content/30'"
                      ></iconify-icon>
                    </div>
                  }

                  <!-- Content -->
                  <div class="tw:flex-1 tw:min-w-0">
                    <a [routerLink]="['/todos', todo.id]">
                      <h3
                        class="tw:font-semibold tw:text-lg hover:tw:text-primary tw:transition-colors"
                        [class.tw:line-through]="todo.is_completed"
                        [class.tw:opacity-60]="todo.is_completed"
                      >
                        {{ todo.title }}
                      </h3>
                    </a>
                    @if (todo.description) {
                      <p class="tw:text-base-content/60 tw:text-sm tw:mt-1 tw:line-clamp-2">
                        {{ todo.description }}
                      </p>
                    }
                    <div
                      class="tw:flex tw:items-center tw:gap-4 tw:mt-2 tw:text-sm tw:text-base-content/50"
                    >
                      <a
                        [routerLink]="['/users', todo.user.id]"
                        class="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
                      >
                        <iconify-icon icon="mdi:account" width="16"></iconify-icon>
                        {{ todo.user.username }}
                      </a>
                      <span>{{ timeAgo(todo.createdAt) }}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  @if (todo.user.id === authStore.user()?.id) {
                    <div class="tw:dropdown tw:dropdown-end">
                      <button class="tw:btn tw:btn-ghost tw:btn-sm tw:btn-circle">
                        <iconify-icon icon="mdi:dots-vertical" width="20"></iconify-icon>
                      </button>
                      <ul
                        class="tw:dropdown-content tw:menu tw:p-2 tw:shadow tw:bg-base-100 tw:rounded-box tw:w-40 tw:z-10"
                      >
                        <li>
                          <a [routerLink]="['/todos', todo.id]"
                            ><iconify-icon icon="mdi:eye" width="16"></iconify-icon> View</a
                          >
                        </li>
                        <li>
                          <button (click)="deleteTodo(todo.id)" class="tw:text-error">
                            <iconify-icon icon="mdi:delete" width="16"></iconify-icon> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Create Modal -->
      @if (showCreateModal) {
        <div class="tw:modal tw:modal-open">
          <div class="tw:modal-box">
            <h3 class="tw:font-bold tw:text-lg tw:mb-4">Create New Todo</h3>
            <form (ngSubmit)="createTodo()" class="tw:space-y-4">
              <div class="tw:form-control">
                <div class="tw:label"><span class="tw:label-text">Title</span></div>
                <input
                  [(ngModel)]="newTitle"
                  name="title"
                  type="text"
                  placeholder="Todo title"
                  class="tw:input tw:input-bordered tw:w-full"
                  required
                />
              </div>
              <div class="tw:form-control">
                <div class="tw:label"><span class="tw:label-text">Description</span></div>
                <textarea
                  [(ngModel)]="newDescription"
                  name="description"
                  placeholder="Optional description"
                  class="tw:textarea tw:textarea-bordered tw:w-full"
                  rows="3"
                ></textarea>
              </div>
              <div class="tw:modal-action">
                <button type="button" (click)="showCreateModal = false" class="tw:btn">
                  Cancel
                </button>
                <button type="submit" class="tw:btn tw:btn-primary" [disabled]="creating">
                  {{ creating ? 'Creating...' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
          <div
            class="tw:modal-backdrop"
            (click)="showCreateModal = false"
            (keydown.escape)="showCreateModal = false"
            tabindex="-1"
          ></div>
        </div>
      }
    </div>
  `,
})
export class TodosComponent implements OnInit {
  todos: Todo[] = []
  loading = true
  showCreateModal = false
  newTitle = ''
  newDescription = ''
  creating = false
  filter: 'all' | 'mine' | 'active' | 'completed' = 'all'
  timeAgo = timeAgo

  constructor(
    private readonly todoApi: TodoApiService,
    public authStore: AuthStore,
  ) {}

  get filteredTodos(): Todo[] {
    let result = this.todos
    if (this.filter === 'mine')
      result = result.filter((t) => t.user.id === this.authStore.user()?.id)
    if (this.filter === 'active') result = result.filter((t) => !t.is_completed)
    if (this.filter === 'completed') result = result.filter((t) => t.is_completed)
    return result
  }

  ngOnInit() {
    this.fetchTodos()
  }

  fetchTodos() {
    this.loading = true
    this.todoApi.getAllTodos().subscribe({
      next: (res) => {
        this.todos = res.data.todos
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  createTodo() {
    if (!this.newTitle.trim()) return
    this.creating = true
    this.todoApi.createTodo({ title: this.newTitle, description: this.newDescription }).subscribe({
      next: () => {
        this.newTitle = ''
        this.newDescription = ''
        this.showCreateModal = false
        this.creating = false
        this.fetchTodos()
      },
      error: () => {
        this.creating = false
      },
    })
  }

  toggleTodo(id: string) {
    this.todoApi.toggleTodo(id).subscribe({
      next: () => {
        const todo = this.todos.find((t) => t.id === id)
        if (todo) todo.is_completed = !todo.is_completed
      },
    })
  }

  deleteTodo(id: string) {
    this.todoApi.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter((t) => t.id !== id)
      },
    })
  }
}
