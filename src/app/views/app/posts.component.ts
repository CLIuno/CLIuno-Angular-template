import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucidePlus,
  lucideFileText,
  lucideUser,
  lucideMessageCircle,
  lucideTrash2,
} from '@ng-icons/lucide'
import { PostApiService } from '../../services/post-api.service'
import { AuthStore } from '../../services/auth.store'
import { timeAgo } from '../../utils/helpers'
import { Post } from '../../types/models'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card'
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
  selector: 'app-posts',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButton,
    HlmCard,
    HlmCardContent,
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
  viewProviders: [
    provideIcons({ lucidePlus, lucideFileText, lucideUser, lucideMessageCircle, lucideTrash2 }),
  ],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">Posts</h1>
          <p class="text-muted-foreground">Share and discuss with the community</p>
        </div>

        <hlm-dialog #createDialog="hlmDialog">
          <button type="button" hlmBtn brnDialogTrigger>
            <ng-icon name="lucidePlus" size="18px" />
            New Post
          </button>
          <hlm-dialog-content *brnDialogContent="let ctx">
            <hlm-dialog-header>
              <h3 hlmDialogTitle>Create New Post</h3>
            </hlm-dialog-header>
            <form (ngSubmit)="createPost(createDialog)" class="space-y-4">
              <div class="space-y-2">
                <label hlmLabel for="new-post-title">Title</label>
                <input
                  hlmInput
                  id="new-post-title"
                  [(ngModel)]="newTitle"
                  name="title"
                  type="text"
                  placeholder="Post title"
                  class="w-full"
                  required
                />
              </div>
              <div class="space-y-2">
                <label hlmLabel for="new-post-content">Content</label>
                <textarea
                  hlmTextarea
                  id="new-post-content"
                  [(ngModel)]="newContent"
                  name="content"
                  placeholder="Write your post..."
                  class="w-full"
                  rows="5"
                  required
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
      </div>

      @if (loading) {
        <div class="flex justify-center py-20">
          <hlm-spinner class="size-8 text-primary" />
        </div>
      }

      @if (!loading && filteredPosts.length === 0) {
        <div class="py-20 text-center">
          <ng-icon name="lucideFileText" size="64px" class="mx-auto text-muted-foreground/40" />
          <h3 class="mt-4 text-xl font-semibold">No posts yet</h3>
          <p class="mt-2 text-muted-foreground">Create your first post to get started!</p>
        </div>
      }

      @if (!loading && filteredPosts.length > 0) {
        <div class="space-y-3">
          @for (post of filteredPosts; track post.id) {
            <div hlmCard class="transition-shadow hover:shadow-md">
              <div hlmCardContent class="flex items-start gap-3">
                <div class="min-w-0 flex-1">
                  <a [routerLink]="['/posts', post.id]">
                    <h3 class="text-lg font-semibold transition-colors hover:text-primary">
                      {{ post.title }}
                    </h3>
                  </a>
                  @if (post.content) {
                    <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {{ post.content }}
                    </p>
                  }
                  <div class="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <a
                      [routerLink]="['/users', post.user.id]"
                      class="flex items-center gap-1 hover:text-primary"
                    >
                      <ng-icon name="lucideUser" size="16px" />
                      {{ post.user.username }}
                    </a>
                    <span class="flex items-center gap-1">
                      <ng-icon name="lucideMessageCircle" size="16px" />
                      {{ post.comments.length }}
                    </span>
                    <span>{{ timeAgo(post.createdAt) }}</span>
                  </div>
                </div>

                @if (post.user.id === authStore.user()?.id) {
                  <button
                    type="button"
                    hlmBtn
                    variant="ghost"
                    size="icon-sm"
                    (click)="deletePost(post.id)"
                    aria-label="Delete post"
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
export class PostsComponent implements OnInit {
  posts: Post[] = []
  loading = true
  newTitle = ''
  newContent = ''
  creating = false
  filter: 'all' | 'mine' = 'all'
  timeAgo = timeAgo

  constructor(
    private readonly postApi: PostApiService,
    public authStore: AuthStore,
  ) {}

  get filteredPosts(): Post[] {
    if (this.filter === 'mine')
      return this.posts.filter((p) => p.user.id === this.authStore.user()?.id)
    return this.posts
  }

  ngOnInit() {
    this.fetchPosts()
  }

  fetchPosts() {
    this.loading = true
    this.postApi.getAllPosts().subscribe({
      next: (res) => {
        this.posts = res.data.posts
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  createPost(dialog: { close: () => void }) {
    if (!this.newTitle.trim() || !this.newContent.trim()) return
    this.creating = true
    this.postApi.createPost({ title: this.newTitle, content: this.newContent }).subscribe({
      next: () => {
        this.newTitle = ''
        this.newContent = ''
        this.creating = false
        dialog.close()
        this.fetchPosts()
      },
      error: () => {
        this.creating = false
      },
    })
  }

  deletePost(id: string) {
    this.postApi.deletePostById(id).subscribe({
      next: () => {
        this.posts = this.posts.filter((p) => p.id !== id)
      },
    })
  }
}
