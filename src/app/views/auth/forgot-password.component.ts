import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { AuthApiService } from '../../services/auth-api.service'

@Component({
  selector: 'app-forgot-password',
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

          <h2 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-1">Forgot Password</h2>
          <p class="tw:text-center tw:text-base-content/60 tw:mb-6">
            Enter your email to receive a reset link
          </p>

          @if (success) {
            <div class="tw:alert tw:alert-success tw:mb-4">
              <iconify-icon icon="mdi:check-circle" width="20"></iconify-icon>
              <span>Reset link sent! Check your email.</span>
            </div>
          }

          @if (error) {
            <div class="tw:alert tw:alert-error tw:mb-4">
              <iconify-icon icon="mdi:alert-circle" width="20"></iconify-icon>
              <span>{{ error }}</span>
            </div>
          }

          @if (!success) {
            <form (ngSubmit)="handleSubmit()" class="tw:space-y-4">
              <fieldset class="tw:fieldset">
                <legend class="tw:fieldset-legend">Email Address</legend>
                <div class="tw:input tw:w-full">
                  <iconify-icon
                    icon="mdi:email-outline"
                    width="16"
                    class="tw:opacity-50"
                  ></iconify-icon>
                  <input
                    [(ngModel)]="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    class="tw:grow"
                    required
                  />
                </div>
              </fieldset>

              <button type="submit" class="tw:btn tw:btn-primary tw:w-full" [disabled]="loading">
                {{ loading ? 'Sending...' : 'Send Reset Link' }}
              </button>
            </form>
          }

          <div class="tw:text-center tw:mt-4">
            <a routerLink="/login" class="tw:link tw:link-primary">Back to Sign In</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  email = ''
  loading = false
  success = false
  error = ''

  constructor(private readonly authApi: AuthApiService) {}

  handleSubmit() {
    this.loading = true
    this.error = ''
    this.authApi.forgotPassword(this.email).subscribe({
      next: () => {
        this.success = true
        this.loading = false
      },
      error: (err) => {
        this.error = err.error?.message || 'Something went wrong'
        this.loading = false
      },
    })
  }
}
