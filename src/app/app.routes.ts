import { Routes } from '@angular/router'
import { authGuard, guestGuard } from './guards/auth.guard'
import { DefaultLayoutComponent } from './layouts/default-layout.component'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./views/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./views/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./views/auth/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'todos',
        loadComponent: () => import('./views/app/todos.component').then((m) => m.TodosComponent),
      },
      {
        path: 'todos/:id',
        loadComponent: () =>
          import('./views/app/todo-detail.component').then((m) => m.TodoDetailComponent),
      },
      {
        path: 'posts',
        loadComponent: () => import('./views/app/posts.component').then((m) => m.PostsComponent),
      },
      {
        path: 'posts/:id',
        loadComponent: () =>
          import('./views/app/post-detail.component').then((m) => m.PostDetailComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./views/app/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./views/user-profile/user-profile.component').then((m) => m.UserProfileComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./views/user-profile/user-profile.component').then((m) => m.UserProfileComponent),
      },
    ],
  },
]
