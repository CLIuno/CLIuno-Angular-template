import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideArrowLeft,
  lucideUndo2,
  lucideCheck,
  lucidePencil,
  lucideUser,
} from '@ng-icons/lucide'
import { TodoApiService } from '../../services/todo-api.service'
import { AuthStore } from '../../services/auth.store'
import { timeAgo } from '../../utils/helpers'
import { Todo } from '../../types/models'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { HlmInput } from '@spartan-ng/helm/input'
import { HlmTextarea } from '@spartan-ng/helm/textarea'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { HlmSeparator } from '@spartan-ng/helm/separator'

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmBadge,
    HlmInput,
    HlmTextarea,
    HlmSpinner,
    HlmSeparator,
  ],
  viewProviders: [
    provideIcons({ lucideArrowLeft, lucideUndo2, lucideCheck, lucidePencil, lucideUser }),
  ],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-8">
      <!-- Back -->
      <a routerLink="/todos" hlmBtn variant="ghost" size="sm" class="mb-6">
        <ng-icon name="lucideArrowLeft" size="18px" />
        Back to Todos
      </a>

      @if (loading) {
        <div class="flex justify-center py-20">
          <hlm-spinner class="size-8 text-primary" />
        </div>
      }

      @if (!loading && todo) {
        <div hlmCard>
          <div hlmCardContent>
            @if (!editing) {
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="mb-2 flex items-center gap-3">
                    @if (todo.is_completed) {
                      <span
                        hlmBadge
                        variant="outline"
                        class="border-green-600/30 text-green-600 dark:text-green-400"
                      >
                        Completed
                      </span>
                    } @else {
                      <span
                        hlmBadge
                        variant="outline"
                        class="border-amber-600/30 text-amber-600 dark:text-amber-400"
                      >
                        Active
                      </span>
                    }
                  </div>
                  <h1
                    class="text-2xl font-bold"
                    [class.line-through]="todo.is_completed"
                    [class.text-muted-foreground]="todo.is_completed"
                  >
                    {{ todo.title }}
                  </h1>
                  @if (todo.description) {
                    <p class="mt-3 text-muted-foreground">{{ todo.description }}</p>
                  }
                </div>
                @if (todo.user.id === authStore.user()?.id) {
                  <div class="flex shrink-0 gap-2">
                    <button
                      type="button"
                      hlmBtn
                      size="sm"
                      variant="outline"
                      (click)="toggleComplete()"
                    >
                      <ng-icon
                        [name]="todo.is_completed ? 'lucideUndo2' : 'lucideCheck'"
                        size="16px"
                      />
                      {{ todo.is_completed ? 'Reopen' : 'Complete' }}
                    </button>
                    <button type="button" hlmBtn size="sm" variant="outline" (click)="startEdit()">
                      <ng-icon name="lucidePencil" size="16px" />
                    </button>
                  </div>
                }
              </div>
            } @else {
              <form (ngSubmit)="saveEdit()" class="space-y-4">
                <input
                  hlmInput
                  [(ngModel)]="editTitle"
                  name="editTitle"
                  type="text"
                  class="w-full text-xl font-bold"
                />
                <textarea
                  hlmTextarea
                  [(ngModel)]="editDescription"
                  name="editDescription"
                  class="w-full"
                  rows="3"
                ></textarea>
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    hlmBtn
                    variant="outline"
                    size="sm"
                    (click)="editing = false"
                  >
                    Cancel
                  </button>
                  <button type="submit" hlmBtn size="sm">Save</button>
                </div>
              </form>
            }

            <hlm-separator class="my-4" />

            <!-- Meta -->
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                [routerLink]="['/users', todo.user.id]"
                class="flex items-center gap-1 hover:text-primary"
              >
                <ng-icon name="lucideUser" size="16px" />
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
