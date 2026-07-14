import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideRocket,
  lucideClipboardCheck,
  lucideSun,
  lucideMoon,
  lucideMenu,
  lucideX,
} from '@ng-icons/lucide'
import { HlmButton } from '@spartan-ng/helm/button'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIcon, HlmButton],
  viewProviders: [
    provideIcons({
      lucideRocket,
      lucideClipboardCheck,
      lucideSun,
      lucideMoon,
      lucideMenu,
      lucideX,
    }),
  ],
  template: `
    <header class="sticky top-0 z-50 border-b bg-background">
      <nav class="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2">
          <ng-icon name="lucideRocket" size="24px" class="text-primary" />
          <span class="text-xl font-bold">CLIuno</span>
        </a>

        <!-- Desktop -->
        <div class="hidden items-center gap-1 md:flex">
          <button
            type="button"
            hlmBtn
            variant="ghost"
            size="icon"
            (click)="toggleTheme()"
            aria-label="Toggle theme"
          >
            <ng-icon [name]="isDark ? 'lucideSun' : 'lucideMoon'" size="18px" />
          </button>

          @for (item of navButtons; track item.label) {
            <a [href]="item.link" target="_blank" rel="noopener" hlmBtn variant="ghost" size="sm">
              {{ item.label }}
            </a>
          }

          @if (isLoggedIn) {
            <a routerLink="/todos" hlmBtn size="sm" class="ml-1">
              <ng-icon name="lucideClipboardCheck" size="16px" />
              Dashboard
            </a>
          } @else {
            <a routerLink="/login" hlmBtn variant="ghost" size="sm" class="ml-1">Login</a>
            <a routerLink="/register" hlmBtn size="sm">Register</a>
          }
        </div>

        <!-- Hamburger -->
        <button
          type="button"
          hlmBtn
          variant="ghost"
          size="icon"
          class="md:hidden"
          (click)="showMenu = !showMenu"
          aria-label="Toggle menu"
        >
          <ng-icon [name]="showMenu ? 'lucideX' : 'lucideMenu'" size="20px" />
        </button>
      </nav>

      <!-- Mobile Menu -->
      @if (showMenu) {
        <div class="border-t px-4 py-3 md:hidden">
          <div class="flex flex-col gap-1">
            @for (item of navButtons; track item.label) {
              <a
                [href]="item.link"
                target="_blank"
                rel="noopener"
                hlmBtn
                variant="ghost"
                class="justify-start"
              >
                {{ item.label }}
              </a>
            }
            @if (isLoggedIn) {
              <a routerLink="/todos" hlmBtn class="justify-start">Dashboard</a>
            } @else {
              <a routerLink="/login" hlmBtn variant="ghost" class="justify-start">Login</a>
              <a routerLink="/register" hlmBtn class="justify-start">Register</a>
            }
            <button
              type="button"
              hlmBtn
              variant="ghost"
              class="justify-start"
              (click)="toggleTheme()"
            >
              <ng-icon [name]="isDark ? 'lucideSun' : 'lucideMoon'" size="16px" />
              Toggle Theme
            </button>
          </div>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  showMenu = false
  isDark = false

  navButtons = [
    { label: 'Docs', link: 'https://github.com/CLIuno' },
    { label: 'Donate', link: 'https://ko-fi.com/ru44y' },
    { label: 'Star', link: 'https://github.com/CLIuno' },
  ]

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  constructor() {
    this.isDark = localStorage.getItem('theme') === 'dark'
    document.documentElement.classList.toggle('dark', this.isDark)
  }

  toggleTheme() {
    this.isDark = !this.isDark
    document.documentElement.classList.toggle('dark', this.isDark)
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
  }
}
