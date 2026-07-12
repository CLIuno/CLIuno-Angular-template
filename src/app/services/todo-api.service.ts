import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { ApiResponse } from './auth-api.service'
import { Todo } from '../types/models'

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  constructor(private readonly http: HttpService) {}

  getAllTodos() {
    return this.http.get<ApiResponse<{ todos: Todo[] }>>('/todos')
  }
  getCurrentUserTodos() {
    return this.http.get<ApiResponse<{ todos: Todo[] }>>('/todos/current-user')
  }
  getTodoById(id: string) {
    return this.http.get<ApiResponse<{ todo: Todo }>>(`/todos/${id}`)
  }
  createTodo(data: { title: string; description?: string }) {
    return this.http.post<ApiResponse>('/todos', data)
  }
  updateTodo(id: string, data: unknown) {
    return this.http.patch<ApiResponse>(`/todos/${id}`, data)
  }
  deleteTodo(id: string) {
    return this.http.delete<ApiResponse>(`/todos/${id}`)
  }
  toggleTodo(id: string) {
    return this.http.patch<ApiResponse>(`/todos/${id}/toggle`)
  }
}
