import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { AuthStore } from '../../services/auth.store'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div
      class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-base-200 tw:px-4 tw:py-8"
    >
      <div class="tw:card tw:w-full tw:max-w-lg tw:bg-base-100 tw:shadow-xl">
        <div class="tw:card-body tw:p-8">
          <div class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-2">
            <iconify-icon
              icon="mdi:rocket-launch-outline"
              width="32"
              class="tw:text-primary"
            ></iconify-icon>
            <span class="tw:text-2xl tw:font-bold tw:text-primary">CLIuno</span>
          </div>

          <h2 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-1">Create Account</h2>
          <p class="tw:text-center tw:text-base-content/60 tw:mb-6">Join the community</p>

          @if (authStore.error()) {
            <div class="tw:alert tw:alert-error tw:mb-4">
              <iconify-icon icon="mdi:alert-circle" width="20"></iconify-icon>
              <span>{{ authStore.error() }}</span>
            </div>
          }

          <form (ngSubmit)="handleRegister()" class="tw:space-y-4">
            <div class="tw:grid tw:grid-cols-2 tw:gap-4">
              <fieldset class="tw:fieldset">
                <legend class="tw:fieldset-legend">First Name</legend>
                <input
                  [(ngModel)]="form.first_name"
                  name="first_name"
                  type="text"
                  placeholder="John"
                  class="tw:input tw:w-full"
                  required
                />
              </fieldset>
              <fieldset class="tw:fieldset">
                <legend class="tw:fieldset-legend">Last Name</legend>
                <input
                  [(ngModel)]="form.last_name"
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  class="tw:input tw:w-full"
                  required
                />
              </fieldset>
            </div>

            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Username</legend>
              <div class="tw:input tw:w-full">
                <iconify-icon icon="mdi:at" width="16" class="tw:opacity-50"></iconify-icon>
                <input
                  [(ngModel)]="form.username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  class="tw:grow"
                  required
                />
              </div>
            </fieldset>

            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Email</legend>
              <div class="tw:input tw:w-full">
                <iconify-icon
                  icon="mdi:email-outline"
                  width="16"
                  class="tw:opacity-50"
                ></iconify-icon>
                <input
                  [(ngModel)]="form.email"
                  name="email"
                  type="email"
                  placeholder="john&#64;example.com"
                  class="tw:grow"
                  required
                />
              </div>
            </fieldset>

            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Phone</legend>
              <div class="tw:input tw:w-full">
                <iconify-icon
                  icon="mdi:phone-outline"
                  width="16"
                  class="tw:opacity-50"
                ></iconify-icon>
                <input
                  [(ngModel)]="form.phone"
                  name="phone"
                  type="tel"
                  placeholder="+966512345678"
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
                  [(ngModel)]="form.password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Min 8 characters"
                  class="tw:grow"
                  required
                  minlength="8"
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

            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Confirm Password</legend>
              <div
                class="tw:input tw:w-full"
                [class.tw:input-error]="form.password_confirmation && !passwordsMatch"
              >
                <iconify-icon
                  icon="mdi:lock-check-outline"
                  width="16"
                  class="tw:opacity-50"
                ></iconify-icon>
                <input
                  [(ngModel)]="form.password_confirmation"
                  name="password_confirmation"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  class="tw:grow"
                  required
                />
              </div>
              @if (form.password_confirmation && !passwordsMatch) {
                <p class="tw:label tw:text-error">Passwords do not match</p>
              }
            </fieldset>

            <button
              type="submit"
              class="tw:btn tw:btn-primary tw:w-full"
              [class.tw:loading]="authStore.loading()"
              [disabled]="authStore.loading() || !isFormValid"
            >
              @if (!authStore.loading()) {
                <iconify-icon icon="mdi:account-plus-outline" width="20"></iconify-icon>
              }
              {{ authStore.loading() ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <div class="tw:divider tw:text-sm">Already have an account?</div>

          <a routerLink="/login" class="tw:btn tw:btn-outline tw:w-full">
            <iconify-icon icon="mdi:login" width="20"></iconify-icon>
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
