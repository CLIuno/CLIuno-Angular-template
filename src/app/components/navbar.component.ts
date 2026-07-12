import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <header class="tw:bg-base-100 tw:shadow-sm tw:px-4 sm:tw:px-6 tw:py-3">
      <nav class="tw:flex tw:items-center tw:justify-between tw:container tw:mx-auto">
        <!-- Logo -->
        <a routerLink="/" class="tw:flex tw:items-center tw:gap-2">
          <iconify-icon
            icon="mdi:rocket-launch-outline"
            width="24"
            class="tw:text-primary"
          ></iconify-icon>
          <span class="tw:text-xl tw:font-bold tw:text-primary">CLIuno</span>
        </a>

        <!-- Desktop Buttons -->
        <div class="tw:hidden tw:md:flex tw:items-center">
          <label class="tw:toggle tw:text-base-content">
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

          @for (btn of navButtons; track btn.label) {
            <a
              [href]="btn.link"
              target="_blank"
              rel="noopener"
              class="tw:btn tw:btn-sm tw:ml-2"
              [class]="'tw:btn-' + btn.style"
            >
              {{ btn.label }}
            </a>
          }

          @if (isLoggedIn) {
            <a routerLink="/todos" class="tw:btn tw:btn-sm tw:btn-primary tw:ml-2">
              <iconify-icon icon="mdi:clipboard-check-outline" width="16"></iconify-icon>
              Dashboard
            </a>
          } @else {
            <a routerLink="/login" class="tw:btn tw:btn-sm tw:btn-success tw:ml-2">Login</a>
            <a routerLink="/register" class="tw:btn tw:btn-sm tw:btn-outline tw:btn-primary tw:ml-2"
              >Register</a
            >
          }
        </div>

        <!-- Hamburger -->
        <button
          (click)="showMenu = !showMenu"
          class="tw:p-2 tw:rounded-md hover:tw:bg-base-200 tw:transition-colors tw:md:hidden"
        >
          <iconify-icon
            [icon]="showMenu ? 'mdi:close' : 'mdi:menu'"
            width="24"
            class="tw:text-base-content"
          ></iconify-icon>
        </button>
      </nav>

      <!-- Mobile Menu -->
      <div
        class="tw:overflow-hidden tw:transition-all tw:duration-300 tw:ease-in-out tw:mx-auto tw:mt-1 tw:rounded-lg tw:bg-base-200 tw:shadow-md md:tw:hidden"
        [style.maxHeight]="showMenu ? '500px' : '0px'"
      >
        <div class="tw:p-3">
          <ul class="tw:flex tw:flex-col tw:gap-2">
            @for (btn of navButtons; track btn.label) {
              <li>
                <a
                  [href]="btn.link"
                  target="_blank"
                  rel="noopener"
                  class="tw:block tw:px-4 tw:py-2 tw:rounded-md tw:transition-colors hover:tw:bg-base-300"
                >
                  {{ btn.label }}
                </a>
              </li>
            }
            @if (isLoggedIn) {
              <li>
                <a
                  routerLink="/todos"
                  class="tw:block tw:px-4 tw:py-2 tw:bg-primary tw:text-white tw:rounded-md"
                  >Dashboard</a
                >
              </li>
            } @else {
              <li>
                <a
                  routerLink="/login"
                  class="tw:block tw:px-4 tw:py-2 tw:bg-success tw:text-white tw:rounded-md"
                  >Login</a
                >
              </li>
              <li>
                <a
                  routerLink="/register"
                  class="tw:block tw:px-4 tw:py-2 tw:bg-primary/10 tw:text-primary tw:rounded-md"
                  >Register</a
                >
              </li>
            }
            <li>
              <button
                class="tw:flex tw:items-center tw:gap-2 tw:w-full tw:text-left tw:px-4 tw:py-2 tw:rounded-md hover:tw:bg-base-300"
              >
                <label class="tw:toggle tw:text-base-content">
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
                Toggle Theme
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  showMenu = false
  isDark = false

  navButtons = [
    { label: 'Docs', link: 'https://github.com/CLIuno', style: 'secondary' },
    { label: 'Donate', link: 'https://ko-fi.com/ru44y', style: 'accent' },
    { label: 'Star', link: 'https://github.com/CLIuno', style: 'info' },
  ]

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  constructor() {
    const theme = localStorage.getItem('theme')
    this.isDark = theme === 'dark'
    document.documentElement.dataset['theme'] = this.isDark ? 'dark' : 'light'
  }

  onThemeChange(event: Event) {
    this.isDark = (event.target as HTMLInputElement).checked
    const theme = this.isDark ? 'dark' : 'light'
    document.documentElement.dataset['theme'] = theme
    localStorage.setItem('theme', theme)
  }
}
