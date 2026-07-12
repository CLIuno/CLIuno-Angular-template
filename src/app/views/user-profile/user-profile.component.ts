import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { UserApiService } from '../../services/user-api.service'
import { FollowApiService } from '../../services/follow-api.service'
import { AuthStore } from '../../services/auth.store'
import { User } from '../../types/models'

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8">
      @if (loading) {
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary"></span>
        </div>
      }

      @if (!loading && user) {
        <!-- Profile Card -->
        <div class="tw:card tw:bg-base-100 tw:shadow-lg tw:overflow-hidden">
          <!-- Cover -->
          <div class="tw:h-32 tw:bg-gradient-to-r tw:from-primary tw:to-secondary"></div>

          <div class="tw:card-body tw:-mt-16">
            <div class="tw:flex tw:items-end tw:gap-4 tw:mb-4">
              <div class="tw:avatar tw:placeholder">
                <div
                  class="tw:bg-neutral tw:text-neutral-content tw:w-24 tw:h-24 tw:rounded-full tw:ring tw:ring-base-100 tw:ring-4"
                >
                  <span class="tw:text-3xl">{{ user.first_name[0] }}{{ user.last_name[0] }}</span>
                </div>
              </div>
              <div class="tw:flex-1">
                <h1 class="tw:text-2xl tw:font-bold">{{ user.first_name }} {{ user.last_name }}</h1>
                <p class="tw:text-base-content/60">&#64;{{ user.username }}</p>
              </div>
              @if (user.id !== authStore.user()?.id) {
                <button
                  (click)="toggleFollow()"
                  class="tw:btn tw:btn-sm"
                  [class.tw:btn-outline]="isFollowing"
                  [class.tw:btn-primary]="!isFollowing"
                >
                  <iconify-icon
                    [icon]="isFollowing ? 'mdi:account-check' : 'mdi:account-plus'"
                    width="16"
                  ></iconify-icon>
                  {{ isFollowing ? 'Following' : 'Follow' }}
                </button>
              }
            </div>

            @if (user.email) {
              <p class="tw:text-base-content/70 tw:flex tw:items-center tw:gap-2">
                <iconify-icon icon="mdi:email-outline" width="16"></iconify-icon>
                {{ user.email }}
              </p>
            }

            <!-- Stats -->
            <div class="tw:flex tw:gap-6 tw:mt-4">
              <button
                (click)="activeTab = 'followers'"
                class="tw:cursor-pointer hover:tw:text-primary tw:transition-colors"
              >
                <span class="tw:font-bold">{{ followers.length }}</span>
                <span class="tw:text-base-content/60 tw:ml-1">Followers</span>
              </button>
              <button
                (click)="activeTab = 'following'"
                class="tw:cursor-pointer hover:tw:text-primary tw:transition-colors"
              >
                <span class="tw:font-bold">{{ following.length }}</span>
                <span class="tw:text-base-content/60 tw:ml-1">Following</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tw:tabs tw:tabs-boxed tw:mt-6 tw:mb-4 tw:w-fit">
          <button
            class="tw:tab"
            [class.tw:tab-active]="activeTab === 'followers'"
            (click)="activeTab = 'followers'"
          >
            Followers
          </button>
          <button
            class="tw:tab"
            [class.tw:tab-active]="activeTab === 'following'"
            (click)="activeTab = 'following'"
          >
            Following
          </button>
        </div>

        <!-- Followers/Following List -->
        <div class="tw:space-y-3">
          @for (person of activeTab === 'followers' ? followers : following; track person.id) {
            <div class="tw:card tw:bg-base-100 tw:shadow-sm">
              <div class="tw:card-body tw:p-4 tw:flex tw:flex-row tw:items-center tw:gap-4">
                <div class="tw:avatar tw:placeholder">
                  <div
                    class="tw:bg-primary tw:text-primary-content tw:w-10 tw:h-10 tw:rounded-full"
                  >
                    <span>{{ person.first_name[0] }}{{ person.last_name[0] }}</span>
                  </div>
                </div>
                <div class="tw:flex-1">
                  <a
                    [routerLink]="['/users', person.id]"
                    class="tw:font-semibold hover:tw:text-primary"
                  >
                    {{ person.first_name }} {{ person.last_name }}
                  </a>
                  <p class="tw:text-sm tw:text-base-content/50">&#64;{{ person.username }}</p>
                </div>
              </div>
            </div>
          } @empty {
            <div class="tw:text-center tw:py-8 tw:text-base-content/40">
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userApi: UserApiService,
    private readonly followApi: FollowApiService,
    public authStore: AuthStore,
  ) {}

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
