import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideUsers, lucideUserCheck, lucideUserPlus } from '@ng-icons/lucide'
import { UserApiService } from '../../services/user-api.service'
import { FollowApiService } from '../../services/follow-api.service'
import { AuthStore } from '../../services/auth.store'
import { User } from '../../types/models'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { HlmAvatar, HlmAvatarFallback } from '@spartan-ng/helm/avatar'

@Component({
  selector: 'app-users',
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
  ],
  viewProviders: [provideIcons({ lucideUsers, lucideUserCheck, lucideUserPlus })],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Users</h1>
        <p class="text-muted-foreground">Discover and follow other users</p>
      </div>

      @if (loading) {
        <div class="flex justify-center py-20">
          <hlm-spinner class="size-8 text-primary" />
        </div>
      }

      @if (!loading && users.length === 0) {
        <div class="py-20 text-center">
          <ng-icon name="lucideUsers" size="64px" class="mx-auto text-muted-foreground/40" />
          <h3 class="mt-4 text-xl font-semibold">No other users yet</h3>
        </div>
      }

      @if (!loading && users.length > 0) {
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (user of users; track user.id) {
            <div hlmCard class="transition-shadow hover:shadow-md">
              <div hlmCardContent class="flex flex-row items-center gap-4">
                <hlm-avatar class="size-12 shrink-0">
                  <span hlmAvatarFallback class="text-lg"
                    >{{ user.first_name[0] }}{{ user.last_name[0] }}</span
                  >
                </hlm-avatar>

                <div class="min-w-0 flex-1">
                  <a
                    [routerLink]="['/users', user.id]"
                    class="font-semibold transition-colors hover:text-primary"
                  >
                    {{ user.first_name }} {{ user.last_name }}
                  </a>
                  <p class="text-sm text-muted-foreground">&#64;{{ user.username }}</p>
                </div>

                <button
                  type="button"
                  hlmBtn
                  size="sm"
                  [variant]="followingMap[user.id] ? 'outline' : 'default'"
                  (click)="toggleFollow(user.id)"
                >
                  <ng-icon
                    [name]="followingMap[user.id] ? 'lucideUserCheck' : 'lucideUserPlus'"
                    size="16px"
                  />
                  {{ followingMap[user.id] ? 'Following' : 'Follow' }}
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class UsersComponent implements OnInit {
  users: User[] = []
  loading = true
  followingMap: Record<string, boolean> = {}

  constructor(
    private readonly userApi: UserApiService,
    private readonly followApi: FollowApiService,
    public authStore: AuthStore,
  ) {}

  ngOnInit() {
    this.fetchUsers()
  }

  fetchUsers() {
    this.loading = true
    this.userApi.getUsers().subscribe({
      next: (res) => {
        this.users = res.data.users.filter((u: User) => u.id !== this.authStore.user()?.id)
        for (const user of this.users) {
          this.followApi.isFollowing(user.id).subscribe({
            next: (r) => {
              this.followingMap[user.id] = r.data.isFollowing
            },
            error: () => {
              this.followingMap[user.id] = false
            },
          })
        }
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  toggleFollow(userId: string) {
    if (this.followingMap[userId]) {
      this.followApi.unfollow(userId).subscribe({
        next: () => {
          this.followingMap[userId] = false
        },
      })
    } else {
      this.followApi.follow(userId).subscribe({
        next: () => {
          this.followingMap[userId] = true
        },
      })
    }
  }
}
