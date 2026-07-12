import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { AuthStore } from '../../services/auth.store'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-base-200 tw:px-4">
      <div class="tw:card tw:w-full tw:max-w-md tw:bg-base-100 tw:shadow-xl">
        <div class="tw:card-body tw:p-8">
          <div class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-2">
            <iconify-icon
              icon="mdi:rocket-launch-outline"
              width="32"
              class="tw:text-primary"
            ></iconify-icon>
            <span class="tw:text-2xl tw:font-bold tw:text-primary">CLIuno</span>
          </div>

          <h2 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-1">Welcome back</h2>
          <p class="tw:text-center tw:text-base-content/60 tw:mb-6">Sign in to your account</p>

          @if (authStore.error()) {
            <div class="tw:alert tw:alert-error tw:mb-4">
              <iconify-icon icon="mdi:alert-circle" width="20"></iconify-icon>
              <span>{{ authStore.error() }}</span>
            </div>
          }

          <form (ngSubmit)="handleLogin()" class="tw:space-y-4">
            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Email or Username</legend>
              <div class="tw:input tw:w-full">
                <iconify-icon
                  icon="mdi:account-outline"
                  width="16"
                  class="tw:opacity-50"
                ></iconify-icon>
                <input
                  [(ngModel)]="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  placeholder="Enter your email or username"
                  class="tw:grow"
                  required
                />
              </div>
            </fieldset>

            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Password</legend>
              <div class="tw:input tw:w-full">
                <iconify-icon
                  icon="mdi:lock-outline"
                  width="16"
                  class="tw:opacity-50"
                ></iconify-icon>
                <input
                  [(ngModel)]="password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="tw:grow"
                  required
                />
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="tw:btn tw:btn-ghost tw:btn-xs tw:btn-circle"
                >
                  <iconify-icon
                    [icon]="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                    width="16"
                  ></iconify-icon>
                </button>
              </div>
            </fieldset>

            <div class="tw:flex tw:justify-end">
              <a routerLink="/forgot-password" class="tw:link tw:link-primary tw:text-sm"
                >Forgot password?</a
              >
            </div>

            <button
              type="submit"
              class="tw:btn tw:btn-primary tw:w-full"
              [class.tw:loading]="authStore.loading()"
              [disabled]="authStore.loading()"
            >
              @if (!authStore.loading()) {
                <iconify-icon icon="mdi:login" width="20"></iconify-icon>
              }
              {{ authStore.loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="tw:divider tw:text-sm">Don't have an account?</div>

          <a routerLink="/register" class="tw:btn tw:btn-outline tw:btn-secondary tw:w-full">
            <iconify-icon icon="mdi:account-plus-outline" width="20"></iconify-icon>
            Create Account
          </a>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  usernameOrEmail = ''
  password = ''
  showPassword = false

  constructor(public authStore: AuthStore) {}

  handleLogin() {
    if (!this.usernameOrEmail || !this.password) return
    this.authStore.login(this.usernameOrEmail, this.password)
  }
}
