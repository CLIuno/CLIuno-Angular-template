import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideRocket, lucideCircleCheck, lucideCircleAlert, lucideMail } from '@ng-icons/lucide'
import { AuthApiService } from '../../services/auth-api.service'
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
import { HlmSpinner } from '@spartan-ng/helm/spinner'

@Component({
  selector: 'app-forgot-password',
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
    HlmSpinner,
  ],
  viewProviders: [provideIcons({ lucideRocket, lucideCircleCheck, lucideCircleAlert, lucideMail })],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-background px-4">
      <div hlmCard class="w-full max-w-sm">
        <div hlmCardHeader class="items-center text-center">
          <div class="mb-2 flex items-center justify-center gap-2">
            <ng-icon name="lucideRocket" size="28px" class="text-primary" />
            <span class="text-xl font-bold">CLIuno</span>
          </div>
          <h2 hlmCardTitle class="text-2xl">Forgot Password</h2>
          <p hlmCardDescription>Enter your email to receive a reset link</p>
        </div>

        <div hlmCardContent>
          @if (success) {
            <div hlmAlert class="mb-4">
              <ng-icon hlmAlertIcon name="lucideCircleCheck" />
              <p hlmAlertDescription>Reset link sent! Check your email.</p>
            </div>
          }

          @if (error) {
            <div hlmAlert variant="destructive" class="mb-4">
              <ng-icon hlmAlertIcon name="lucideCircleAlert" />
              <p hlmAlertDescription>{{ error }}</p>
            </div>
          }

          @if (!success) {
            <form (ngSubmit)="handleSubmit()" class="space-y-4">
              <div class="space-y-2">
                <label hlmLabel for="email">Email Address</label>
                <div class="relative">
                  <ng-icon
                    name="lucideMail"
                    size="16px"
                    class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    hlmInput
                    id="email"
                    [(ngModel)]="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    class="w-full pl-9"
                    required
                  />
                </div>
              </div>

              <button type="submit" hlmBtn class="w-full" [disabled]="loading">
                @if (loading) {
                  <hlm-spinner class="size-4" />
                }
                {{ loading ? 'Sending...' : 'Send Reset Link' }}
              </button>
            </form>
          }

          <div class="mt-4 text-center">
            <a routerLink="/login" class="text-sm text-primary hover:underline">Back to Sign In</a>
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
