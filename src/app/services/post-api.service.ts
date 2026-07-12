import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { ApiResponse } from './auth-api.service'
import { Post, Comment } from '../types/models'

@Injectable({ providedIn: 'root' })
export class PostApiService {
  constructor(private readonly http: HttpService) {}

  getAllPosts() {
    return this.http.get<ApiResponse<{ posts: Post[] }>>('/posts')
  }
  getCurrentUserPosts() {
    return this.http.get<ApiResponse<{ posts: Post[] }>>('/posts/current-user')
  }
  getPostById(id: string) {
    return this.http.get<ApiResponse<{ post: Post }>>(`/posts/${id}`)
  }
  createPost(postData: { title: string; content: string }) {
    return this.http.post<ApiResponse>('/posts', postData)
  }
  updatePostById(id: string, postData: unknown) {
    return this.http.patch<ApiResponse>(`/posts/${id}`, postData)
  }
  deletePostById(id: string) {
    return this.http.delete<ApiResponse>(`/posts/${id}`)
  }
  getComments(postId: string) {
    return this.http.get<ApiResponse<{ comments: Comment[] }>>(`/posts/${postId}/comments`)
  }
  createComment(postId: string, data: { content: string }) {
    return this.http.post<ApiResponse>(`/posts/${postId}/comments`, data)
  }
  updateComment(postId: string, commentId: string, data: { content: string }) {
    return this.http.patch<ApiResponse>(`/posts/${postId}/comments/${commentId}`, data)
  }
  deleteComment(postId: string, commentId: string) {
    return this.http.delete<ApiResponse>(`/posts/${postId}/comments/${commentId}`)
  }
}
