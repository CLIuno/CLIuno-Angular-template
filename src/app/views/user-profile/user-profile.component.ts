import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideMail, lucideUserCheck, lucideUserPlus } from '@ng-icons/lucide'
import { UploadApiService } from '../../services/upload-api.service'
import { UserApiService } from '../../services/user-api.service'
import { FollowApiService } from '../../services/follow-api.service'
import { AuthStore } from '../../services/auth.store'
import { User } from '../../types/models'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { HlmAvatar, HlmAvatarFallback, HlmAvatarImage } from '@spartan-ng/helm/avatar'

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmSpinner,
    HlmAvatar,
    HlmAvatarFallback,
    HlmAvatarImage,
  ],
  viewProviders: [provideIcons({ lucideMail, lucideUserCheck, lucideUserPlus })],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-8">
      @if (loading) {
        <div class="flex justify-center py-20">
          <hlm-spinner class="size-8 text-primary" />
        </div>
      }

      @if (!loading && user) {
        <!-- Profile Card -->
        <div hlmCard class="overflow-hidden">
          <!-- Cover -->
          <div class="-mt-6 h-32 bg-gradient-to-r from-primary to-muted-foreground"></div>

          <div hlmCardContent class="-mt-16">
            <div class="mb-4 flex items-end gap-4">
              <div class="flex flex-col items-center gap-2">
                <hlm-avatar class="size-24 ring-4 ring-background">
                  @if (user.avatar_url) {
                    <img hlmAvatarImage [src]="user.avatar_url" [alt]="user.username" />
                  }
                  <span hlmAvatarFallback class="text-3xl"
                    >{{ user.first_name[0] }}{{ user.last_name[0] }}</span
                  >
                </hlm-avatar>

                @if (user.id === authStore.user()?.id) {
                  <input
                    #avatarInput
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    class="hidden"
                    (change)="onAvatarPicked($event)"
                  />
                  <button
                    type="button"
                    hlmBtn
                    size="sm"
                    variant="outline"
                    [disabled]="uploading"
                    (click)="avatarInput.click()"
                  >
                    {{ uploading ? 'Uploading…' : 'Change photo' }}
                  </button>
                }
              </div>
              <div class="flex-1">
                <h1 class="text-2xl font-bold">{{ user.first_name }} {{ user.last_name }}</h1>
                <p class="text-muted-foreground">&#64;{{ user.username }}</p>
                @if (uploadError) {
                  <p class="mt-1 text-sm text-destructive">{{ uploadError }}</p>
                }
              </div>
              @if (user.id !== authStore.user()?.id) {
                <button
                  type="button"
                  hlmBtn
                  size="sm"
                  [variant]="isFollowing ? 'outline' : 'default'"
                  (click)="toggleFollow()"
                >
                  <ng-icon
                    [name]="isFollowing ? 'lucideUserCheck' : 'lucideUserPlus'"
                    size="16px"
                  />
                  {{ isFollowing ? 'Following' : 'Follow' }}
                </button>
              }
            </div>

            @if (user.email) {
              <p class="flex items-center gap-2 text-muted-foreground">
                <ng-icon name="lucideMail" size="16px" />
                {{ user.email }}
              </p>
            }

            <!-- Stats -->
            <div class="mt-4 flex gap-6">
              <button
                type="button"
                (click)="activeTab = 'followers'"
                class="cursor-pointer transition-colors hover:text-primary"
              >
                <span class="font-bold">{{ followers.length }}</span>
                <span class="ml-1 text-muted-foreground">Followers</span>
              </button>
              <button
                type="button"
                (click)="activeTab = 'following'"
                class="cursor-pointer transition-colors hover:text-primary"
              >
                <span class="font-bold">{{ following.length }}</span>
                <span class="ml-1 text-muted-foreground">Following</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mt-6 mb-4 inline-flex w-fit items-center gap-1 rounded-md border p-1">
          <button
            type="button"
            hlmBtn
            [variant]="activeTab === 'followers' ? 'default' : 'ghost'"
            size="sm"
            (click)="activeTab = 'followers'"
          >
            Followers
          </button>
          <button
            type="button"
            hlmBtn
            [variant]="activeTab === 'following' ? 'default' : 'ghost'"
            size="sm"
            (click)="activeTab = 'following'"
          >
            Following
          </button>
        </div>

        <!-- Followers/Following List -->
        <div class="space-y-3">
          @for (person of activeTab === 'followers' ? followers : following; track person.id) {
            <div hlmCard>
              <div hlmCardContent class="flex flex-row items-center gap-4">
                <hlm-avatar class="size-10 shrink-0">
                  <span hlmAvatarFallback>{{ person.first_name[0] }}{{ person.last_name[0] }}</span>
                </hlm-avatar>
                <div class="min-w-0 flex-1">
                  <a [routerLink]="['/users', person.id]" class="font-semibold hover:text-primary">
                    {{ person.first_name }} {{ person.last_name }}
                  </a>
                  <p class="text-sm text-muted-foreground">&#64;{{ person.username }}</p>
                </div>
              </div>
            </div>
          } @empty {
            <div class="py-8 text-center text-muted-foreground/70">
              <p>No {{ activeTab }} yet</p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class UserProfileComponent implements OnInit {
  user: User | null = null
  loading = true
  isFollowing = false
  followers: User[] = []
  following: User[] = []
  activeTab: 'followers' | 'following' = 'followers'
  uploading = false
  uploadError: string | null = null

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userApi: UserApiService,
    private readonly followApi: FollowApiService,
    private readonly uploadApi: UploadApiService,
    public authStore: AuthStore,
  ) {}

  onAvatarPicked(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    this.uploading = true
    this.uploadError = null
    this.uploadApi.uploadImage(file).subscribe({
      next: (res) => {
        const url = res.data.url
        this.userApi.updateCurrentUser({ avatar_url: url }).subscribe({
          next: () => {
            if (this.user) this.user = { ...this.user, avatar_url: url }
            this.authStore.fetchCurrentUser()
            this.uploading = false
          },
          error: () => {
            this.uploadError = 'Upload failed'
            this.uploading = false
          },
        })
      },
      error: () => {
        this.uploadError = 'Upload failed'
        this.uploading = false
      },
    })

    // reset so re-picking the same file still fires change
    input.value = ''
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || this.authStore.user()?.id
    if (id) this.fetchUser(id)
  }

  fetchUser(id: string) {
    this.loading = true
    this.userApi.getUserById(id).subscribe({
      next: (res) => {
        this.user = res.data.user
        this.loading = false
        this.fetchFollowData(id)
      },
      error: () => {
        this.loading = false
      },
    })
  }

  fetchFollowData(userId: string) {
    this.followApi.isFollowing(userId).subscribe({
      next: (res) => {
        this.isFollowing = res.data.isFollowing
      },
    })
    this.followApi.getFollowers(userId).subscribe({
      next: (res) => {
        this.followers = res.data.followers
      },
    })
    this.followApi.getFollowing(userId).subscribe({
      next: (res) => {
        this.following = res.data.following
      },
    })
  }

  toggleFollow() {
    const user = this.user
    if (!user) return
    if (this.isFollowing) {
      this.followApi.unfollow(user.id).subscribe({
        next: () => {
          this.isFollowing = false
          this.fetchFollowData(user.id)
        },
      })
    } else {
      this.followApi.follow(user.id).subscribe({
        next: () => {
          this.isFollowing = true
          this.fetchFollowData(user.id)
        },
      })
    }
  }
}
