import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { ApiResponse } from './auth-api.service'
import { User } from '../types/models'

@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(private readonly http: HttpService) {}

  getCurrentUser() {
    return this.http.get<ApiResponse<{ user: User }>>('/users/current')
  }
  getUsers() {
    return this.http.get<ApiResponse<{ users: User[] }>>('/users')
  }
  getUserByUsername(username: string) {
    return this.http.get<ApiResponse<{ user: User }>>(`/users/username/${username}`)
  }
  getUserById(id: string) {
    return this.http.get<ApiResponse<{ user: User }>>(`/users/${id}`)
  }
  updateUserById(id: string, userData: unknown) {
    return this.http.patch<ApiResponse>(`/users/${id}`, userData)
  }
  deleteUserById(id: string) {
    return this.http.delete<ApiResponse>(`/users/${id}`)
  }
  getPostsByUser(userId: string) {
    return this.http.get<ApiResponse>(`/users/${userId}/posts`)
  }
  getRolesByUser(userId: string) {
    return this.http.get<ApiResponse>(`/users/${userId}/roles`)
  }
}
