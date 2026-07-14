import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideRocket,
  lucideClipboardCheck,
  lucideFileText,
  lucideUsers,
  lucideSun,
  lucideMoon,
  lucideChevronDown,
  lucideUser,
  lucideLogOut,
} from '@ng-icons/lucide'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmAvatar, HlmAvatarFallback } from '@spartan-ng/helm/avatar'
import { HlmMenu, HlmMenuItem, HlmMenuItemIcon, HlmMenuSeparator } from '@spartan-ng/helm/menu'
import { BrnMenuTrigger } from '@spartan-ng/brain/menu'
import { AuthStore } from '../services/auth.store'

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIcon,
    HlmButton,
    HlmAvatar,
    HlmAvatarFallback,
    HlmMenu,
    HlmMenuItem,
    HlmMenuItemIcon,
    HlmMenuSeparator,
    BrnMenuTrigger,
  ],
  viewProviders: [
    provideIcons({
      lucideRocket,
      lucideClipboardCheck,
      lucideFileText,
      lucideUsers,
      lucideSun,
      lucideMoon,
      lucideChevronDown,
      lucideUser,
      lucideLogOut,
    }),
  ],
  template: `
    <div class="flex min-h-screen flex-col bg-background text-foreground">
      <!-- App Navbar -->
      <header class="sticky top-0 z-50 border-b bg-background">
        <nav class="container mx-auto flex items-center justify-between px-4 py-3">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2">
            <ng-icon name="lucideRocket" size="24px" class="text-primary" />
            <span class="text-xl font-bold">CLIuno</span>
          </a>

          <!-- Nav Links -->
          <div class="flex items-center gap-1">
            <a
              routerLink="/todos"
              routerLinkActive="bg-accent text-accent-foreground"
              hlmBtn
              variant="ghost"
              size="sm"
            >
              <ng-icon name="lucideClipboardCheck" size="18px" />
              <span class="hidden sm:inline">Todos</span>
            </a>
            <a
              routerLink="/posts"
              routerLinkActive="bg-accent text-accent-foreground"
              hlmBtn
              variant="ghost"
              size="sm"
            >
              <ng-icon name="lucideFileText" size="18px" />
              <span class="hidden sm:inline">Posts</span>
            </a>
            <a
              routerLink="/users"
              routerLinkActive="bg-accent text-accent-foreground"
              hlmBtn
              variant="ghost"
              size="sm"
            >
              <ng-icon name="lucideUsers" size="18px" />
              <span class="hidden sm:inline">Users</span>
            </a>

            <!-- Theme Toggle -->
            <button
              type="button"
              hlmBtn
              variant="ghost"
              size="icon"
              class="ml-1"
              (click)="toggleTheme()"
              aria-label="Toggle theme"
            >
              <ng-icon [name]="isDark ? 'lucideSun' : 'lucideMoon'" size="18px" />
            </button>

            <!-- User Menu -->
            <button
              type="button"
              hlmBtn
              variant="ghost"
              size="sm"
              class="ml-1 gap-1.5"
              [brnMenuTriggerFor]="userMenu"
            >
              <hlm-avatar class="size-7">
                <span hlmAvatarFallback class="text-xs">{{ userInitials }}</span>
              </hlm-avatar>
              <span class="hidden sm:inline">{{ authStore.user()?.username }}</span>
              <ng-icon name="lucideChevronDown" size="14px" />
            </button>
            <ng-template #userMenu>
              <hlm-menu>
                @if (authStore.user(); as user) {
                  <a hlmMenuItem [routerLink]="['/users', user.id]">
                    <ng-icon hlmMenuIcon name="lucideUser" />
                    My Profile
                  </a>
                  <hlm-menu-separator />
                }
                <button
                  type="button"
                  hlmMenuItem
                  variant="destructive"
                  (click)="authStore.logout()"
                >
                  <ng-icon hlmMenuIcon name="lucideLogOut" />
                  Logout
                </button>
              </hlm-menu>
            </ng-template>
          </div>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="flex-1">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="border-t py-4 text-center text-sm text-muted-foreground">
        &copy; {{ currentYear }} CLIuno — Built with Angular
      </footer>
    </div>
  `,
})
export class DefaultLayoutComponent {
  isDark = false
  currentYear = new Date().getFullYear()

  constructor(public authStore: AuthStore) {
    this.isDark = localStorage.getItem('theme') === 'dark'
    document.documentElement.classList.toggle('dark', this.isDark)
  }

  get userInitials(): string {
    const u = this.authStore.user()
    if (!u) return '?'
    return (u.first_name?.[0] || '?') + (u.last_name?.[0] || '')
  }

  toggleTheme() {
    this.isDark = !this.isDark
    document.documentElement.classList.toggle('dark', this.isDark)
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
  }
}
