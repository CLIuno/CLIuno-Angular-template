import { Injectable } from '@angular/core'
import { HttpService } from './http.service'

export interface ApiResponse<T = unknown> {
  status: string
  message: string
  data: T
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly http: HttpService) {}

  login(credentials: { usernameOrEmail: string; password: string }) {
    return this.http.post<ApiResponse<{ token: string; refreshToken: string; user: unknown }>>(
      '/auth/login',
      credentials,
    )
  }
  register(userData: unknown) {
    return this.http.post<ApiResponse>('/auth/register', userData)
  }
  logout() {
    return this.http.post<ApiResponse>('/auth/logout')
  }
  forgotPassword(email: string) {
    return this.http.post<ApiResponse>('/auth/forgot-password', { email })
  }
  resetPassword(password: string, token: string) {
    return this.http.post<ApiResponse>('/auth/reset-password', { password, token })
  }
  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post<ApiResponse>('/auth/change-password', { oldPassword, newPassword })
  }
  verifyEmail(token: string) {
    return this.http.post<ApiResponse>('/auth/verify-email', { token })
  }
  sendVerificationEmail() {
    return this.http.post<ApiResponse>('/auth/send-verify-email')
  }
  checkToken(token: string) {
    return this.http.post<ApiResponse>('/auth/check-token', { token })
  }
  refreshToken(refreshToken: string) {
    return this.http.post<ApiResponse>('/auth/refresh-token', { refreshToken })
  }
  generateOTP() {
    return this.http.post<ApiResponse>('/auth/otp/generate')
  }
  verifyOTP(otp: string) {
    return this.http.post<ApiResponse>('/auth/otp/verify', { otp })
  }
  validateOTP(otp: string) {
    return this.http.post<ApiResponse>('/auth/otp/validate', { otp })
  }
  disableOTP() {
    return this.http.post<ApiResponse>('/auth/otp/disable')
  }
}
