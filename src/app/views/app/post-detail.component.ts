import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideArrowLeft,
  lucidePencil,
  lucideUser,
  lucideMessagesSquare,
  lucideMessageCircleOff,
  lucideSend,
  lucideTrash2,
} from '@ng-icons/lucide'
import { PostApiService } from '../../services/post-api.service'
import { AuthStore } from '../../services/auth.store'
import { timeAgo } from '../../utils/helpers'
import { Post, Comment } from '../../types/models'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card'
import { HlmInput } from '@spartan-ng/helm/input'
import { HlmTextarea } from '@spartan-ng/helm/textarea'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { HlmSeparator } from '@spartan-ng/helm/separator'
import { HlmAvatar, HlmAvatarFallback } from '@spartan-ng/helm/avatar'

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmInput,
    HlmTextarea,
    HlmSpinner,
    HlmSeparator,
    HlmAvatar,
    HlmAvatarFallback,
  ],
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucidePencil,
      lucideUser,
      lucideMessagesSquare,
      lucideMessageCircleOff,
      lucideSend,
      lucideTrash2,
    }),
  ],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-8">
      <a routerLink="/posts" hlmBtn variant="ghost" size="sm" class="mb-6">
        <ng-icon name="lucideArrowLeft" size="18px" />
        Back to Posts
      </a>

      @if (loading) {
        <div class="flex justify-center py-20">
          <hlm-spinner class="size-8 text-primary" />
        </div>
      }

      @if (!loading && post) {
        <!-- Detail Card -->
        <div hlmCard class="mb-6">
          <div hlmCardContent>
            @if (!editing) {
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h1 class="text-2xl font-bold">{{ post.title }}</h1>
                  @if (post.content) {
                    <p class="mt-3 text-muted-foreground">{{ post.content }}</p>
                  }
                </div>
                @if (post.user.id === authStore.user()?.id) {
                  <button type="button" hlmBtn size="sm" variant="outline" (click)="startEdit()">
                    <ng-icon name="lucidePencil" size="16px" />
                  </button>
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
                  [(ngModel)]="editContent"
                  name="editContent"
                  class="w-full"
                  rows="5"
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

            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                [routerLink]="['/users', post.user.id]"
                class="flex items-center gap-1 hover:text-primary"
              >
                <ng-icon name="lucideUser" size="16px" />
                {{ post.user.first_name }} {{ post.user.last_name }} (&#64;{{ post.user.username }})
              </a>
              <span>{{ timeAgo(post.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div hlmCard>
          <div hlmCardContent>
            <h2 class="mb-4 flex items-center gap-1.5 text-xl font-bold">
              <ng-icon name="lucideMessagesSquare" size="22px" />
              Comments ({{ post.comments.length }})
            </h2>

            <!-- Add Comment -->
            <form (ngSubmit)="addComment()" class="mb-6 flex gap-2">
              <input
                hlmInput
                [(ngModel)]="newComment"
                name="newComment"
                type="text"
                placeholder="Write a comment..."
                class="flex-1"
                required
              />
              <button
                type="submit"
                hlmBtn
                size="icon"
                [disabled]="submittingComment"
                aria-label="Send comment"
              >
                <ng-icon name="lucideSend" size="18px" />
              </button>
            </form>

            @if (!post.comments.length) {
              <div class="py-8 text-center text-muted-foreground/70">
                <ng-icon name="lucideMessageCircleOff" size="40px" class="mx-auto mb-2" />
                <p>No comments yet. Be the first!</p>
              </div>
            }

            @if (post.comments.length) {
              <div class="space-y-4">
                @for (comment of post.comments; track comment.id) {
                  <div class="flex gap-3">
                    <hlm-avatar class="size-8 shrink-0">
                      <span hlmAvatarFallback class="text-xs">
                        {{ comment.user.first_name[0] }}{{ comment.user.last_name[0] }}
                      </span>
                    </hlm-avatar>
                    <div class="flex-1 rounded-lg bg-muted p-3">
                      <div class="mb-1 flex items-center justify-between">
                        <a
                          [routerLink]="['/users', comment.user.id]"
                          class="text-sm font-semibold hover:text-primary"
                        >
                          {{ comment.user.username }}
                        </a>
                        <div class="flex items-center gap-2">
                          <span class="text-xs text-muted-foreground">{{
                            timeAgo(comment.createdAt)
                          }}</span>
                          @if (comment.user.id === authStore.user()?.id) {
                            <button
                              type="button"
                              hlmBtn
                              variant="ghost"
                              size="icon-sm"
                              (click)="startEditComment(comment)"
                              aria-label="Edit comment"
                            >
                              <ng-icon name="lucidePencil" size="12px" />
                            </button>
                            <button
                              type="button"
                              hlmBtn
                              variant="ghost"
                              size="icon-sm"
                              (click)="deleteComment(comment.id)"
                              aria-label="Delete comment"
                            >
                              <ng-icon name="lucideTrash2" size="12px" />
                            </button>
                          }
                        </div>
                      </div>

                      @if (editingCommentId === comment.id) {
                        <div class="flex gap-2">
                          <input
                            hlmInput
                            [(ngModel)]="editCommentContent"
                            name="editComment"
                            class="h-8 flex-1"
                          />
                          <button
                            type="button"
                            hlmBtn
                            size="sm"
                            (click)="saveEditComment(comment.id)"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            hlmBtn
                            variant="outline"
                            size="sm"
                            (click)="editingCommentId = null"
                          >
                            Cancel
                          </button>
                        </div>
                      } @else {
                        <p class="text-sm">{{ comment.content }}</p>
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
