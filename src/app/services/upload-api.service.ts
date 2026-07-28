import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { ApiResponse } from './auth-api.service'

@Injectable({ providedIn: 'root' })
export class UploadApiService {
  constructor(private readonly http: HttpService) {}

  // HttpClient sets multipart/form-data (with the boundary) itself for FormData,
  // so no Content-Type is passed here.
  uploadImage(file: File) {
    const form = new FormData()
    form.append('file', file)
    return this.http.post<ApiResponse<{ url: string; filename: string }>>('/uploads/image', form)
  }
}
