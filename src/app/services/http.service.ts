import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly baseUrl = environment.apiUrl

  constructor(private readonly http: HttpClient) {}

  get<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}${path}`)
  }

  post<T>(path: string, body: unknown = {}) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body)
  }

  patch<T>(path: string, body: unknown = {}) {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body)
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${this.baseUrl}${path}`)
  }
}
