import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideRocket,
  lucideCircleAlert,
  lucideEye,
  lucideEyeOff,
  lucideLogIn,
  lucideUserPlus,
} from '@ng-icons/lucide'
import { AuthStore } from '../../services/auth.store'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmInput } from '@spartan-ng/helm/input'
import { HlmLabel } from '@spartan-ng/helm/label'
import {
  HlmCard,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardContent,
} from '@spartan-ng/helm/card'
import { HlmAlert, HlmAlertIcon, HlmAlertDescription } from '@spartan-ng/helm/alert'
import { HlmSeparator } from '@spartan-ng/helm/separator'
import { HlmSpinner } from '@spartan-ng/helm/spinner'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButton,
    HlmInput,
    HlmLabel,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardContent,
    HlmAlert,
    HlmAlertIcon,
    HlmAlertDescription,
    HlmSeparator,
    HlmSpinner,
  ],
  viewProviders: [
    provideIcons({
      lucideRocket,
      lucideCircleAlert,
      lucideEye,
      lucideEyeOff,
      lucideLogIn,
      lucideUserPlus,
    }),
  ],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-background px-4">
      <div hlmCard class="w-full max-w-sm">
        <div hlmCardHeader class="items-center text-center">
          <div class="mb-2 flex items-center justify-center gap-2">
            <ng-icon name="lucideRocket" size="28px" class="text-primary" />
            <span class="text-xl font-bold">CLIuno</span>
          </div>
          <h2 hlmCardTitle class="text-2xl">Welcome back</h2>
          <p hlmCardDescription>Sign in to your account</p>
        </div>

        <div hlmCardContent>
          @if (authStore.error()) {
            <div hlmAlert variant="destructive" class="mb-4">
              <ng-icon hlmAlertIcon name="lucideCircleAlert" />
              <p hlmAlertDescription>{{ authStore.error() }}</p>
            </div>
          }

          <form (ngSubmit)="handleLogin()" class="space-y-4">
            <div class="space-y-2">
              <label hlmLabel for="usernameOrEmail">Email or Username</label>
              <input
                hlmInput
                id="usernameOrEmail"
                [(ngModel)]="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                placeholder="Enter your email or username"
                class="w-full"
                required
              />
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label hlmLabel for="password">Password</label>
                <a routerLink="/forgot-password" class="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div class="relative">
                <input
                  hlmInput
                  id="password"
                  [(ngModel)]="password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  <ng-icon [name]="showPassword ? 'lucideEyeOff' : 'lucideEye'" size="16px" />
                </button>
              </div>
            </div>

            <button type="submit" hlmBtn class="w-full" [disabled]="authStore.loading()">
              @if (authStore.loading()) {
                <hlm-spinner class="size-4" />
              } @else {
                <ng-icon name="lucideLogIn" size="18px" />
              }
              {{ authStore.loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="my-6 flex items-center gap-3">
            <hlm-separator class="flex-1" />
            <span class="text-xs text-muted-foreground">Don't have an account?</span>
            <hlm-separator class="flex-1" />
          </div>

          <a routerLink="/register" hlmBtn variant="outline" class="w-full">
            <ng-icon name="lucideUserPlus" size="18px" />
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
