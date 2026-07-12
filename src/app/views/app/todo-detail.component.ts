import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { TodoApiService } from '../../services/todo-api.service'
import { AuthStore } from '../../services/auth.store'
import { timeAgo } from '../../utils/helpers'
import { Todo } from '../../types/models'

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  imports: [FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8">
      <!-- Back -->
      <a routerLink="/todos" class="tw:btn tw:btn-ghost tw:btn-sm tw:mb-6">
        <iconify-icon icon="mdi:arrow-left" width="20"></iconify-icon>
        Back to Todos
      </a>

      @if (loading) {
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary"></span>
        </div>
      }

      @if (!loading && todo) {
        <div class="tw:card tw:bg-base-100 tw:shadow-lg">
          <div class="tw:card-body">
            @if (!editing) {
              <div class="tw:flex tw:items-start tw:justify-between">
                <div>
                  <div class="tw:flex tw:items-center tw:gap-3 tw:mb-2">
                    <span
                      class="tw:badge"
                      [class.tw:badge-success]="todo.is_completed"
                      [class.tw:badge-warning]="!todo.is_completed"
                    >
                      {{ todo.is_completed ? 'Completed' : 'Active' }}
                    </span>
                  </div>
                  <h1
                    class="tw:text-2xl tw:font-bold"
                    [class.tw:line-through]="todo.is_completed"
                    [class.tw:opacity-60]="todo.is_completed"
                  >
                    {{ todo.title }}
                  </h1>
                  @if (todo.description) {
                    <p class="tw:mt-3 tw:text-base-content/70">{{ todo.description }}</p>
                  }
                </div>
                @if (todo.user.id === authStore.user()?.id) {
                  <div class="tw:flex tw:gap-2">
                    <button
                      (click)="toggleComplete()"
                      class="tw:btn tw:btn-sm tw:btn-outline"
                      [class.tw:btn-warning]="todo.is_completed"
                      [class.tw:btn-success]="!todo.is_completed"
                    >
                      <iconify-icon
                        [icon]="todo.is_completed ? 'mdi:undo' : 'mdi:check'"
                        width="16"
                      ></iconify-icon>
                      {{ todo.is_completed ? 'Reopen' : 'Complete' }}
                    </button>
                    <button (click)="startEdit()" class="tw:btn tw:btn-sm tw:btn-outline">
                      <iconify-icon icon="mdi:pencil" width="16"></iconify-icon>
                    </button>
                  </div>
                }
              </div>
            } @else {
              <form (ngSubmit)="saveEdit()" class="tw:space-y-4">
                <input
                  [(ngModel)]="editTitle"
                  name="editTitle"
                  type="text"
                  class="tw:input tw:input-bordered tw:w-full tw:text-xl tw:font-bold"
                />
                <textarea
                  [(ngModel)]="editDescription"
                  name="editDescription"
                  class="tw:textarea tw:textarea-bordered tw:w-full"
                  rows="3"
                ></textarea>
                <div class="tw:flex tw:gap-2 tw:justify-end">
                  <button type="button" (click)="editing = false" class="tw:btn tw:btn-sm">
                    Cancel
                  </button>
                  <button type="submit" class="tw:btn tw:btn-sm tw:btn-primary">Save</button>
                </div>
              </form>
            }

            <!-- Meta -->
            <div
              class="tw:flex tw:items-center tw:gap-4 tw:mt-4 tw:pt-4 tw:border-t tw:border-base-200 tw:text-sm tw:text-base-content/50"
            >
              <a
                [routerLink]="['/users', todo.user.id]"
                class="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
              >
                <iconify-icon icon="mdi:account" width="16"></iconify-icon>
                {{ todo.user.first_name }} {{ todo.user.last_name }} (&#64;{{ todo.user.username }})
              </a>
              <span>{{ timeAgo(todo.createdAt) }}</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class TodoDetailComponent implements OnInit {
  todo: Todo | null = null
  loading = true
  editing = false
  editTitle = ''
  editDescription = ''
  timeAgo = timeAgo

  constructor(
    private readonly route: ActivatedRoute,
    private readonly todoApi: TodoApiService,
    public authStore: AuthStore,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? ''
    this.todoApi.getTodoById(id).subscribe({
      next: (res) => {
        this.todo = res.data.todo
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  toggleComplete() {
    const todo = this.todo
    if (!todo) return
    this.todoApi.toggleTodo(todo.id).subscribe({
      next: () => {
        todo.is_completed = !todo.is_completed
      },
    })
  }

  startEdit() {
    if (!this.todo) return
    this.editTitle = this.todo.title
    this.editDescription = this.todo.description || ''
    this.editing = true
  }

  saveEdit() {
    const todo = this.todo
    if (!todo) return
    this.todoApi
      .updateTodo(todo.id, { title: this.editTitle, description: this.editDescription })
      .subscribe({
        next: () => {
          todo.title = this.editTitle
          todo.description = this.editDescription
          this.editing = false
        },
      })
  }
}
