import { Injectable, signal, computed } from '@angular/core'
import { Router } from '@angular/router'
import { AuthApiService } from './auth-api.service'
import { UserApiService } from './user-api.service'
import { User } from '../types/models'

@Injectable({ providedIn: 'root' })
export class AuthStore {
  user = signal<User | null>(null)
  token = signal<string | null>(localStorage.getItem('token'))
  refreshTokenValue = signal<string | null>(localStorage.getItem('refreshToken'))
  loading = signal(false)
  error = signal<string | null>(null)

  isAuthenticated = computed(() => !!this.token())
  fullName = computed(() => {
    const u = this.user()
    return u ? `${u.first_name} ${u.last_name}` : ''
  })

  constructor(
    private readonly authApi: AuthApiService,
    private readonly userApi: UserApiService,
    private readonly router: Router,
  ) {}

  private setTokens(accessToken: string, refresh: string) {
    this.token.set(accessToken)
    this.refreshTokenValue.set(refresh)
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refresh)
  }

  clearAuth() {
    this.user.set(null)
    this.token.set(null)
    this.refreshTokenValue.set(null)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  login(usernameOrEmail: string, password: string) {
    this.loading.set(true)
    this.error.set(null)
    return this.authApi.login({ usernameOrEmail, password }).subscribe({
      next: (res) => {
        const data = res.data
        this.setTokens(data.token, data.refreshToken)
        this.user.set(data.user as User)
        this.loading.set(false)
        this.router.navigate(['/todos'])
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Login failed')
        this.loading.set(false)
      },
    })
  }

  register(userData: {
    first_name: string
    last_name: string
    username: string
    email: string
    phone: string
    password: string
    password_confirmation: string
  }) {
    this.loading.set(true)
    this.error.set(null)
    return this.authApi.register(userData).subscribe({
      next: () => {
        this.loading.set(false)
        this.router.navigate(['/login'])
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed')
        this.loading.set(false)
      },
    })
  }

  logout() {
    this.authApi.logout().subscribe({
      complete: () => {
        this.clearAuth()
        this.router.navigate(['/login'])
      },
      error: () => {
        this.clearAuth()
        this.router.navigate(['/login'])
      },
    })
  }

  fetchCurrentUser() {
    if (!this.token()) return
    this.userApi.getCurrentUser().subscribe({
      next: (res) => {
        this.user.set(res.data.user)
      },
      error: () => {
        this.clearAuth()
      },
    })
  }
}
