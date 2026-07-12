import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { AuthStore } from '../services/auth.store'

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="tw:min-h-screen tw:flex tw:flex-col tw:bg-base-200">
      <!-- App Navbar -->
      <header class="tw:bg-base-100 tw:shadow-sm tw:sticky tw:top-0 tw:z-50">
        <nav
          class="tw:container tw:mx-auto tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3"
        >
          <!-- Logo -->
          <a routerLink="/todos" class="tw:flex tw:items-center tw:gap-2">
            <iconify-icon
              icon="mdi:rocket-launch-outline"
              width="24"
              class="tw:text-primary"
            ></iconify-icon>
            <span class="tw:text-xl tw:font-bold tw:text-primary">CLIuno</span>
          </a>

          <!-- Nav Links -->
          <div class="tw:flex tw:items-center tw:gap-1">
            <a
              routerLink="/todos"
              routerLinkActive="tw:btn-active"
              class="tw:btn tw:btn-ghost tw:btn-sm"
            >
              <iconify-icon icon="mdi:clipboard-check-outline" width="20"></iconify-icon>
              <span class="tw:hidden sm:tw:inline">Todos</span>
            </a>
            <a
              routerLink="/posts"
              routerLinkActive="tw:btn-active"
              class="tw:btn tw:btn-ghost tw:btn-sm"
            >
              <iconify-icon icon="mdi:post-outline" width="20"></iconify-icon>
              <span class="tw:hidden sm:tw:inline">Posts</span>
            </a>
            <a
              routerLink="/users"
              routerLinkActive="tw:btn-active"
              class="tw:btn tw:btn-ghost tw:btn-sm"
            >
              <iconify-icon icon="mdi:account-group-outline" width="20"></iconify-icon>
              <span class="tw:hidden sm:tw:inline">Users</span>
            </a>

            <!-- Theme Toggle -->
            <label class="tw:toggle tw:text-base-content tw:ml-1">
              <input
                type="checkbox"
                [checked]="isDark"
                (change)="onThemeChange($event)"
                value="dark"
                class="theme-controller"
              />
              <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </g>
              </svg>
              <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </g>
              </svg>
            </label>

            <!-- User Menu -->
            <div class="tw:dropdown tw:dropdown-end">
              <button class="tw:btn tw:btn-ghost tw:btn-sm">
                <div class="tw:avatar tw:placeholder">
                  <div class="tw:bg-primary tw:text-primary-content tw:w-7 tw:h-7 tw:rounded-full">
                    <span class="tw:text-xs">{{ userInitials }}</span>
                  </div>
                </div>
                <span class="tw:hidden sm:tw:inline tw:ml-1">{{ authStore.user()?.username }}</span>
                <iconify-icon icon="mdi:chevron-down" width="16"></iconify-icon>
              </button>
              <ul
                class="tw:dropdown-content tw:menu tw:p-2 tw:shadow-lg tw:bg-base-100 tw:rounded-box tw:w-52 tw:z-10"
              >
                <li>
                  @if (authStore.user()) {
                    <a [routerLink]="['/users', authStore.user()!.id]">
                      <iconify-icon icon="mdi:account" width="16"></iconify-icon> My Profile
                    </a>
                  }
                </li>
                <li>
                  <button (click)="authStore.logout()" class="tw:text-error">
                    <iconify-icon icon="mdi:logout" width="16"></iconify-icon> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="tw:flex-1">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="tw:py-4 tw:text-center tw:text-sm tw:text-base-content/50">
        &copy; {{ currentYear }} CLIuno — Built with Angular
      </footer>
    </div>
  `,
})
export class DefaultLayoutComponent {
  isDark = false
  currentYear = new Date().getFullYear()

  constructor(public authStore: AuthStore) {
    const theme = localStorage.getItem('theme')
    this.isDark = theme === 'dark'
    document.documentElement.dataset['theme'] = this.isDark ? 'dark' : 'light'
  }

  get userInitials(): string {
    const u = this.authStore.user()
    if (!u) return '?'
    return (u.first_name?.[0] || '?') + (u.last_name?.[0] || '')
  }

  onThemeChange(event: Event) {
    this.isDark = (event.target as HTMLInputElement).checked
    const theme = this.isDark ? 'dark' : 'light'
    document.documentElement.dataset['theme'] = theme
    localStorage.setItem('theme', theme)
  }
}
