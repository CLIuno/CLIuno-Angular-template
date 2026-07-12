import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { UserApiService } from '../../services/user-api.service'
import { FollowApiService } from '../../services/follow-api.service'
import { AuthStore } from '../../services/auth.store'
import { User } from '../../types/models'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-8">
      <div class="tw:mb-8">
        <h1 class="tw:text-3xl tw:font-bold tw:text-base-content">Users</h1>
        <p class="tw:text-base-content/60">Discover and follow other users</p>
      </div>

      @if (loading) {
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary"></span>
        </div>
      }

      @if (!loading && users.length === 0) {
        <div class="tw:text-center tw:py-20">
          <iconify-icon
            icon="mdi:account-group-outline"
            width="64"
            class="tw:mx-auto tw:text-base-content/30"
          ></iconify-icon>
          <h3 class="tw:text-xl tw:font-semibold tw:mt-4">No other users yet</h3>
        </div>
      }

      @if (!loading && users.length > 0) {
        <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
          @for (user of users; track user.id) {
            <div
              class="tw:card tw:bg-base-100 tw:shadow-sm hover:tw:shadow-md tw:transition-shadow"
            >
              <div class="tw:card-body tw:p-4 tw:flex tw:flex-row tw:items-center tw:gap-4">
                <!-- Avatar -->
                <div class="tw:avatar tw:placeholder">
                  <div
                    class="tw:bg-primary tw:text-primary-content tw:w-12 tw:h-12 tw:rounded-full"
                  >
                    <span class="tw:text-lg">{{ user.first_name[0] }}{{ user.last_name[0] }}</span>
                  </div>
                </div>

                <!-- Info -->
                <div class="tw:flex-1">
                  <a
                    [routerLink]="['/users', user.id]"
                    class="tw:font-semibold hover:tw:text-primary tw:transition-colors"
                  >
                    {{ user.first_name }} {{ user.last_name }}
                  </a>
                  <p class="tw:text-sm tw:text-base-content/50">&#64;{{ user.username }}</p>
                </div>

                <!-- Follow Button -->
                <button
                  (click)="toggleFollow(user.id)"
                  class="tw:btn tw:btn-sm"
                  [class.tw:btn-outline]="followingMap[user.id]"
                  [class.tw:btn-primary]="!followingMap[user.id]"
                >
                  <iconify-icon
                    [icon]="followingMap[user.id] ? 'mdi:account-check' : 'mdi:account-plus'"
                    width="16"
                  ></iconify-icon>
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
