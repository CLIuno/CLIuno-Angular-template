import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { PostApiService } from '../../services/post-api.service'
import { AuthStore } from '../../services/auth.store'
import { timeAgo } from '../../utils/helpers'
import { Post } from '../../types/models'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-8">
      <!-- Header -->
      <div class="tw:flex tw:items-center tw:justify-between tw:mb-8">
        <div>
          <h1 class="tw:text-3xl tw:font-bold tw:text-base-content">Posts</h1>
          <p class="tw:text-base-content/60">Share and discuss with the community</p>
        </div>
        <button (click)="showCreateModal = true" class="tw:btn tw:btn-primary">
          <iconify-icon icon="mdi:plus" width="20"></iconify-icon>
          New Post
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
      </div>

      @if (loading) {
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary"></span>
        </div>
      }

      @if (!loading && filteredPosts.length === 0) {
        <div class="tw:text-center tw:py-20">
          <iconify-icon
            icon="mdi:post-outline"
            width="64"
            class="tw:mx-auto tw:text-base-content/30"
          ></iconify-icon>
          <h3 class="tw:text-xl tw:font-semibold tw:mt-4">No posts yet</h3>
          <p class="tw:text-base-content/60 tw:mt-2">Create your first post to get started!</p>
        </div>
      }

      @if (!loading && filteredPosts.length > 0) {
        <div class="tw:space-y-3">
          @for (post of filteredPosts; track post.id) {
            <div
              class="tw:card tw:bg-base-100 tw:shadow-sm hover:tw:shadow-md tw:transition-shadow"
            >
              <div class="tw:card-body tw:p-4">
                <div class="tw:flex tw:items-start tw:gap-3">
                  <div class="tw:flex-1 tw:min-w-0">
                    <a [routerLink]="['/posts', post.id]">
                      <h3
                        class="tw:font-semibold tw:text-lg hover:tw:text-primary tw:transition-colors"
                      >
                        {{ post.title }}
                      </h3>
                    </a>
                    @if (post.content) {
                      <p class="tw:text-base-content/60 tw:text-sm tw:mt-1 tw:line-clamp-2">
                        {{ post.content }}
                      </p>
                    }
                    <div
                      class="tw:flex tw:items-center tw:gap-4 tw:mt-2 tw:text-sm tw:text-base-content/50"
                    >
                      <a
                        [routerLink]="['/users', post.user.id]"
                        class="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
                      >
                        <iconify-icon icon="mdi:account" width="16"></iconify-icon>
                        {{ post.user.username }}
                      </a>
                      <span class="tw:flex tw:items-center tw:gap-1">
                        <iconify-icon icon="mdi:comment-outline" width="16"></iconify-icon>
                        {{ post.comments.length }}
                      </span>
                      <span>{{ timeAgo(post.createdAt) }}</span>
                    </div>
                  </div>

                  @if (post.user.id === authStore.user()?.id) {
                    <div class="tw:dropdown tw:dropdown-end">
                      <button class="tw:btn tw:btn-ghost tw:btn-sm tw:btn-circle">
                        <iconify-icon icon="mdi:dots-vertical" width="20"></iconify-icon>
                      </button>
                      <ul
                        class="tw:dropdown-content tw:menu tw:p-2 tw:shadow tw:bg-base-100 tw:rounded-box tw:w-40 tw:z-10"
                      >
                        <li>
                          <a [routerLink]="['/posts', post.id]"
                            ><iconify-icon icon="mdi:eye" width="16"></iconify-icon> View</a
                          >
                        </li>
                        <li>
                          <button (click)="deletePost(post.id)" class="tw:text-error">
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
            <h3 class="tw:font-bold tw:text-lg tw:mb-4">Create New Post</h3>
            <form (ngSubmit)="createPost()" class="tw:space-y-4">
              <div class="tw:form-control">
                <div class="tw:label"><span class="tw:label-text">Title</span></div>
                <input
                  [(ngModel)]="newTitle"
                  name="title"
                  type="text"
                  placeholder="Post title"
                  class="tw:input tw:input-bordered tw:w-full"
                  required
                />
              </div>
              <div class="tw:form-control">
                <div class="tw:label"><span class="tw:label-text">Content</span></div>
                <textarea
                  [(ngModel)]="newContent"
                  name="content"
                  placeholder="Write your post..."
                  class="tw:textarea tw:textarea-bordered tw:w-full"
                  rows="5"
                  required
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
export class PostsComponent implements OnInit {
  posts: Post[] = []
  loading = true
  showCreateModal = false
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

  createPost() {
    if (!this.newTitle.trim() || !this.newContent.trim()) return
    this.creating = true
    this.postApi.createPost({ title: this.newTitle, content: this.newContent }).subscribe({
      next: () => {
        this.newTitle = ''
        this.newContent = ''
        this.showCreateModal = false
        this.creating = false
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
