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
  lucideAtSign,
  lucideMail,
  lucidePhone,
  lucideLock,
  lucideLockKeyhole,
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
  selector: 'app-register',
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
      lucideAtSign,
      lucideMail,
      lucidePhone,
      lucideLock,
      lucideLockKeyhole,
    }),
  ],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div hlmCard class="w-full max-w-sm">
        <div hlmCardHeader class="items-center text-center">
          <div class="mb-2 flex items-center justify-center gap-2">
            <ng-icon name="lucideRocket" size="28px" class="text-primary" />
            <span class="text-xl font-bold">CLIuno</span>
          </div>
          <h2 hlmCardTitle class="text-2xl">Create Account</h2>
          <p hlmCardDescription>Join the community</p>
        </div>

        <div hlmCardContent>
          @if (authStore.error()) {
            <div hlmAlert variant="destructive" class="mb-4">
              <ng-icon hlmAlertIcon name="lucideCircleAlert" />
              <p hlmAlertDescription>{{ authStore.error() }}</p>
            </div>
          }

          <form (ngSubmit)="handleRegister()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label hlmLabel for="first_name">First Name</label>
                <input
                  hlmInput
                  id="first_name"
                  [(ngModel)]="form.first_name"
                  name="first_name"
                  type="text"
                  placeholder="John"
                  class="w-full"
                  required
                />
              </div>
              <div class="space-y-2">
                <label hlmLabel for="last_name">Last Name</label>
                <input
                  hlmInput
                  id="last_name"
                  [(ngModel)]="form.last_name"
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  class="w-full"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label hlmLabel for="username">Username</label>
              <div class="relative">
                <ng-icon
                  name="lucideAtSign"
                  size="16px"
                  class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  hlmInput
                  id="username"
                  [(ngModel)]="form.username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  class="w-full pl-9"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label hlmLabel for="email">Email</label>
              <div class="relative">
                <ng-icon
                  name="lucideMail"
                  size="16px"
                  class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  hlmInput
                  id="email"
                  [(ngModel)]="form.email"
                  name="email"
                  type="email"
                  placeholder="john&#64;example.com"
                  class="w-full pl-9"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label hlmLabel for="phone">Phone</label>
              <div class="relative">
                <ng-icon
                  name="lucidePhone"
                  size="16px"
                  class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  hlmInput
                  id="phone"
                  [(ngModel)]="form.phone"
                  name="phone"
                  type="tel"
                  placeholder="+966512345678"
                  class="w-full pl-9"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label hlmLabel for="password">Password</label>
              <div class="relative">
                <ng-icon
                  name="lucideLock"
                  size="16px"
                  class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  hlmInput
                  id="password"
                  [(ngModel)]="form.password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Min 8 characters"
                  class="w-full px-9"
                  required
                  minlength="8"
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

            <div class="space-y-2">
              <label hlmLabel for="password_confirmation">Confirm Password</label>
              <div class="relative">
                <ng-icon
                  name="lucideLockKeyhole"
                  size="16px"
                  class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  hlmInput
                  id="password_confirmation"
                  [error]="form.password_confirmation && !passwordsMatch ? true : 'auto'"
                  [(ngModel)]="form.password_confirmation"
                  name="password_confirmation"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  class="w-full pl-9"
                  required
                />
              </div>
              @if (form.password_confirmation && !passwordsMatch) {
                <p class="text-sm text-destructive">Passwords do not match</p>
              }
            </div>

            <button
              type="submit"
              hlmBtn
              class="w-full"
              [disabled]="authStore.loading() || !isFormValid"
            >
              @if (authStore.loading()) {
                <hlm-spinner class="size-4" />
              } @else {
                <ng-icon name="lucideUserPlus" size="18px" />
              }
              {{ authStore.loading() ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <div class="my-6 flex items-center gap-3">
            <hlm-separator class="flex-1" />
            <span class="text-xs text-muted-foreground">Already have an account?</span>
            <hlm-separator class="flex-1" />
          </div>

          <a routerLink="/login" hlmBtn variant="outline" class="w-full">
            <ng-icon name="lucideLogIn" size="18px" />
            Sign In
          </a>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  showPassword = false
  form = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  }

  constructor(public authStore: AuthStore) {}

  get passwordsMatch(): boolean {
    return this.form.password === this.form.password_confirmation
  }

  get isFormValid(): boolean {
    return !!(
      this.form.first_name &&
      this.form.last_name &&
      this.form.username &&
      this.form.email &&
      this.form.phone &&
      this.form.password.length >= 8 &&
      this.passwordsMatch
    )
  }

  handleRegister() {
    if (!this.isFormValid) return
    this.authStore.register(this.form)
  }
}
