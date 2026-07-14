import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucidePlus, lucideClipboardCheck, lucideUser, lucideTrash2 } from '@ng-icons/lucide'
import { TodoApiService } from '../../services/todo-api.service'
import { AuthStore } from '../../services/auth.store'
import { timeAgo } from '../../utils/helpers'
import { Todo } from '../../types/models'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card'
import { HlmCheckbox } from '@spartan-ng/helm/checkbox'
import { HlmInput } from '@spartan-ng/helm/input'
import { HlmLabel } from '@spartan-ng/helm/label'
import { HlmTextarea } from '@spartan-ng/helm/textarea'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import {
  HlmDialog,
  HlmDialogContent,
  HlmDialogHeader,
  HlmDialogTitle,
  HlmDialogFooter,
} from '@spartan-ng/helm/dialog'
import { BrnDialogTrigger, BrnDialogContent, BrnDialogClose } from '@spartan-ng/brain/dialog'

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmCheckbox,
    HlmInput,
    HlmLabel,
    HlmTextarea,
    HlmSpinner,
    HlmDialog,
    HlmDialogContent,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmDialogFooter,
    BrnDialogTrigger,
    BrnDialogContent,
    BrnDialogClose,
  ],
  viewProviders: [provideIcons({ lucidePlus, lucideClipboardCheck, lucideUser, lucideTrash2 })],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">Todos</h1>
          <p class="text-muted-foreground">Manage your tasks and collaborate with others</p>
        </div>

        <hlm-dialog #createDialog="hlmDialog">
          <button type="button" hlmBtn brnDialogTrigger>
            <ng-icon name="lucidePlus" size="18px" />
            New Todo
          </button>
          <hlm-dialog-content *brnDialogContent="let ctx">
            <hlm-dialog-header>
              <h3 hlmDialogTitle>Create New Todo</h3>
            </hlm-dialog-header>
            <form (ngSubmit)="createTodo(createDialog)" class="space-y-4">
              <div class="space-y-2">
                <label hlmLabel for="new-todo-title">Title</label>
                <input
                  hlmInput
                  id="new-todo-title"
                  [(ngModel)]="newTitle"
                  name="title"
                  type="text"
                  placeholder="Todo title"
                  class="w-full"
                  required
                />
              </div>
              <div class="space-y-2">
                <label hlmLabel for="new-todo-description">Description</label>
                <textarea
                  hlmTextarea
                  id="new-todo-description"
                  [(ngModel)]="newDescription"
                  name="description"
                  placeholder="Optional description"
                  class="w-full"
                  rows="3"
                ></textarea>
              </div>
              <hlm-dialog-footer>
                <button type="button" brnDialogClose hlmBtn variant="outline">Cancel</button>
                <button type="submit" hlmBtn [disabled]="creating">
                  @if (creating) {
                    <hlm-spinner class="size-4" />
                  }
                  {{ creating ? 'Creating...' : 'Create' }}
                </button>
              </hlm-dialog-footer>
            </form>
          </hlm-dialog-content>
        </hlm-dialog>
      </div>

      <!-- Filters -->
      <div class="mb-6 inline-flex w-fit items-center gap-1 rounded-md border p-1">
        <button
          type="button"
          hlmBtn
          [variant]="filter === 'all' ? 'default' : 'ghost'"
          size="sm"
          (click)="filter = 'all'"
        >
          All
        </button>
        <button
          type="button"
          hlmBtn
          [variant]="filter === 'mine' ? 'default' : 'ghost'"
          size="sm"
          (click)="filter = 'mine'"
        >
          Mine
        </button>
        <button
          type="button"
          hlmBtn
          [variant]="filter === 'active' ? 'default' : 'ghost'"
          size="sm"
          (click)="filter = 'active'"
        >
          Active
        </button>
        <button
          type="button"
          hlmBtn
          [variant]="filter === 'completed' ? 'default' : 'ghost'"
          size="sm"
          (click)="filter = 'completed'"
        >
          Completed
        </button>
      </div>

      <!-- Loading -->
      @if (loading) {
        <div class="flex justify-center py-20">
          <hlm-spinner class="size-8 text-primary" />
        </div>
      }

      <!-- Empty State -->
      @if (!loading && filteredTodos.length === 0) {
        <div class="py-20 text-center">
          <ng-icon
            name="lucideClipboardCheck"
            size="64px"
            class="mx-auto text-muted-foreground/40"
          />
          <h3 class="mt-4 text-xl font-semibold">No todos yet</h3>
          <p class="mt-2 text-muted-foreground">Create your first todo to get started!</p>
        </div>
      }

      <!-- List -->
      @if (!loading && filteredTodos.length > 0) {
        <div class="space-y-3">
          @for (todo of filteredTodos; track todo.id) {
            <div hlmCard class="transition-shadow hover:shadow-md">
              <div hlmCardContent class="flex items-start gap-3">
                <hlm-checkbox
                  class="mt-1"
                  [checked]="todo.is_completed"
                  [disabled]="todo.user.id !== authStore.user()?.id"
                  (checkedChange)="toggleTodo(todo.id)"
                />

                <div class="min-w-0 flex-1">
                  <a [routerLink]="['/todos', todo.id]">
                    <h3
                      class="text-lg font-semibold transition-colors hover:text-primary"
                      [class.line-through]="todo.is_completed"
                      [class.text-muted-foreground]="todo.is_completed"
                    >
                      {{ todo.title }}
                    </h3>
                  </a>
                  @if (todo.description) {
                    <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {{ todo.description }}
                    </p>
                  }
                  <div class="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <a
                      [routerLink]="['/users', todo.user.id]"
                      class="flex items-center gap-1 hover:text-primary"
                    >
                      <ng-icon name="lucideUser" size="16px" />
                      {{ todo.user.username }}
                    </a>
                    <span>{{ timeAgo(todo.createdAt) }}</span>
                  </div>
                </div>

                @if (todo.user.id === authStore.user()?.id) {
                  <button
                    type="button"
                    hlmBtn
                    variant="ghost"
                    size="icon-sm"
                    (click)="deleteTodo(todo.id)"
                    aria-label="Delete todo"
                  >
                    <ng-icon name="lucideTrash2" size="16px" />
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class TodosComponent implements OnInit {
  todos: Todo[] = []
  loading = true
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

  createTodo(dialog: { close: () => void }) {
    if (!this.newTitle.trim()) return
    this.creating = true
    this.todoApi.createTodo({ title: this.newTitle, description: this.newDescription }).subscribe({
      next: () => {
        this.newTitle = ''
        this.newDescription = ''
        this.creating = false
        dialog.close()
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
