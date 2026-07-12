import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { ApiResponse } from './auth-api.service'
import { User } from '../types/models'

@Injectable({ providedIn: 'root' })
export class FollowApiService {
  constructor(private readonly http: HttpService) {}

  follow(userId: string) {
    return this.http.post<ApiResponse>(`/follows/${userId}/follow`)
  }
  unfollow(userId: string) {
    return this.http.delete<ApiResponse>(`/follows/${userId}/follow`)
  }
  getFollowers(userId: string) {
    return this.http.get<ApiResponse<{ followers: User[] }>>(`/follows/${userId}/followers`)
  }
  getFollowing(userId: string) {
    return this.http.get<ApiResponse<{ following: User[] }>>(`/follows/${userId}/following`)
  }
  isFollowing(userId: string) {
    return this.http.get<ApiResponse<{ isFollowing: boolean }>>(`/follows/${userId}/is-following`)
  }
}
