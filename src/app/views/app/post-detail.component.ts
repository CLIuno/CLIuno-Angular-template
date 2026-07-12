import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { PostApiService } from '../../services/post-api.service'
import { AuthStore } from '../../services/auth.store'
import { timeAgo } from '../../utils/helpers'
import { Post, Comment } from '../../types/models'

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8">
      <a routerLink="/posts" class="tw:btn tw:btn-ghost tw:btn-sm tw:mb-6">
        <iconify-icon icon="mdi:arrow-left" width="20"></iconify-icon>
        Back to Posts
      </a>

      @if (loading) {
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary"></span>
        </div>
      }

      @if (!loading && post) {
        <!-- Detail Card -->
        <div class="tw:card tw:bg-base-100 tw:shadow-lg tw:mb-6">
          <div class="tw:card-body">
            @if (!editing) {
              <div class="tw:flex tw:items-start tw:justify-between">
                <div>
                  <h1 class="tw:text-2xl tw:font-bold">{{ post.title }}</h1>
                  @if (post.content) {
                    <p class="tw:mt-3 tw:text-base-content/70">{{ post.content }}</p>
                  }
                </div>
                @if (post.user.id === authStore.user()?.id) {
                  <div class="tw:flex tw:gap-2">
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
                  [(ngModel)]="editContent"
                  name="editContent"
                  class="tw:textarea tw:textarea-bordered tw:w-full"
                  rows="5"
                ></textarea>
                <div class="tw:flex tw:gap-2 tw:justify-end">
                  <button type="button" (click)="editing = false" class="tw:btn tw:btn-sm">
                    Cancel
                  </button>
                  <button type="submit" class="tw:btn tw:btn-sm tw:btn-primary">Save</button>
                </div>
              </form>
            }

            <div
              class="tw:flex tw:items-center tw:gap-4 tw:mt-4 tw:pt-4 tw:border-t tw:border-base-200 tw:text-sm tw:text-base-content/50"
            >
              <a
                [routerLink]="['/users', post.user.id]"
                class="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
              >
                <iconify-icon icon="mdi:account" width="16"></iconify-icon>
                {{ post.user.first_name }} {{ post.user.last_name }} (&#64;{{ post.user.username }})
              </a>
              <span>{{ timeAgo(post.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="tw:card tw:bg-base-100 tw:shadow-lg">
          <div class="tw:card-body">
            <h2 class="tw:text-xl tw:font-bold tw:mb-4">
              <iconify-icon
                icon="mdi:comment-multiple-outline"
                width="24"
                class="tw:inline tw:mr-1"
              ></iconify-icon>
              Comments ({{ post.comments.length }})
            </h2>

            <!-- Add Comment -->
            <form (ngSubmit)="addComment()" class="tw:mb-6">
              <div class="tw:flex tw:gap-2">
                <input
                  [(ngModel)]="newComment"
                  name="newComment"
                  type="text"
                  placeholder="Write a comment..."
                  class="tw:input tw:input-bordered tw:flex-1"
                  required
                />
                <button type="submit" class="tw:btn tw:btn-primary" [disabled]="submittingComment">
                  <iconify-icon icon="mdi:send" width="20"></iconify-icon>
                </button>
              </div>
            </form>

            @if (!post.comments.length) {
              <div class="tw:text-center tw:py-8 tw:text-base-content/40">
                <iconify-icon
                  icon="mdi:comment-off-outline"
                  width="40"
                  class="tw:mx-auto tw:mb-2"
                ></iconify-icon>
                <p>No comments yet. Be the first!</p>
              </div>
            }

            @if (post.comments.length) {
              <div class="tw:space-y-4">
                @for (comment of post.comments; track comment.id) {
                  <div class="tw:flex tw:gap-3">
                    <div class="tw:avatar tw:placeholder">
                      <div
                        class="tw:bg-neutral tw:text-neutral-content tw:w-8 tw:h-8 tw:rounded-full"
                      >
                        <span class="tw:text-xs"
                          >{{ comment.user.first_name[0] }}{{ comment.user.last_name[0] }}</span
                        >
                      </div>
                    </div>
                    <div class="tw:flex-1 tw:bg-base-200 tw:rounded-lg tw:p-3">
                      <div class="tw:flex tw:items-center tw:justify-between tw:mb-1">
                        <a
                          [routerLink]="['/users', comment.user.id]"
                          class="tw:font-semibold tw:text-sm hover:tw:text-primary"
                        >
                          {{ comment.user.username }}
                        </a>
                        <div class="tw:flex tw:items-center tw:gap-2">
                          <span class="tw:text-xs tw:text-base-content/50">{{
                            timeAgo(comment.createdAt)
                          }}</span>
                          @if (comment.user.id === authStore.user()?.id) {
                            <button
                              (click)="startEditComment(comment)"
                              class="tw:btn tw:btn-ghost tw:btn-xs"
                            >
                              <iconify-icon icon="mdi:pencil" width="12"></iconify-icon>
                            </button>
                            <button
                              (click)="deleteComment(comment.id)"
                              class="tw:btn tw:btn-ghost tw:btn-xs tw:text-error"
                            >
                              <iconify-icon icon="mdi:delete" width="12"></iconify-icon>
                            </button>
                          }
                        </div>
                      </div>

                      @if (editingCommentId === comment.id) {
                        <div class="tw:flex tw:gap-2">
                          <input
                            [(ngModel)]="editCommentContent"
                            name="editComment"
                            class="tw:input tw:input-sm tw:input-bordered tw:flex-1"
                          />
                          <button
                            (click)="saveEditComment(comment.id)"
                            class="tw:btn tw:btn-sm tw:btn-primary"
                          >
                            Save
                          </button>
                          <button (click)="editingCommentId = null" class="tw:btn tw:btn-sm">
                            Cancel
                          </button>
                        </div>
                      } @else {
                        <p class="tw:text-sm">{{ comment.content }}</p>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null
  loading = true
  newComment = ''
  submittingComment = false
  editing = false
  editTitle = ''
  editContent = ''
  editingCommentId: string | null = null
  editCommentContent = ''
  timeAgo = timeAgo
  private postId = ''

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postApi: PostApiService,
    public authStore: AuthStore,
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id')!
    this.fetchPost()
  }

  fetchPost() {
    this.loading = true
    this.postApi.getPostById(this.postId).subscribe({
      next: (res) => {
        this.post = res.data.post
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  addComment() {
    if (!this.newComment.trim()) return
    this.submittingComment = true
    this.postApi.createComment(this.postId, { content: this.newComment }).subscribe({
      next: () => {
        this.newComment = ''
        this.submittingComment = false
        this.fetchPost()
      },
      error: () => {
        this.submittingComment = false
      },
    })
  }

  deleteComment(commentId: string) {
    this.postApi.deleteComment(this.postId, commentId).subscribe({
      next: () => {
        if (this.post)
          this.post.comments = this.post.comments.filter((c: Comment) => c.id !== commentId)
      },
    })
  }

  startEdit() {
    if (!this.post) return
    this.editTitle = this.post.title
    this.editContent = this.post.content || ''
    this.editing = true
  }

  saveEdit() {
    const post = this.post
    if (!post) return
    this.postApi
      .updatePostById(this.postId, { title: this.editTitle, content: this.editContent })
      .subscribe({
        next: () => {
          post.title = this.editTitle
          post.content = this.editContent
          this.editing = false
        },
      })
  }

  startEditComment(comment: Comment) {
    this.editingCommentId = comment.id
    this.editCommentContent = comment.content
  }

  saveEditComment(commentId: string) {
    this.postApi
      .updateComment(this.postId, commentId, { content: this.editCommentContent })
      .subscribe({
        next: () => {
          const comment = this.post?.comments.find((c: Comment) => c.id === commentId)
          if (comment) comment.content = this.editCommentContent
          this.editingCommentId = null
        },
      })
  }
}
