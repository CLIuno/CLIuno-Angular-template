import { Component } from '@angular/core'
import { HeaderComponent } from '../../components/header.component'
import { FooterComponent } from '../../components/footer.component'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCard, HlmCardTitle, HlmCardDescription } from '@spartan-ng/helm/card'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, HlmButton, HlmCard, HlmCardTitle, HlmCardDescription],
  template: `
    <div class="min-h-screen bg-background text-foreground">
      <app-header />

      <!-- Hero Section -->
      <section class="border-b bg-muted/30">
        <div
          class="container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-10 px-6 py-20 lg:flex-row-reverse"
        >
          <img
            src="https://placehold.co/600x400/"
            class="w-full max-w-sm rounded-2xl shadow-2xl transition-transform duration-500 ease-in-out hover:rotate-3 hover:scale-105"
            alt="Hero"
          />
          <div class="max-w-xl space-y-4 text-center lg:text-left">
            <h1 class="text-5xl font-bold tracking-tight text-balance">
              Welcome to CLIuno Templates
            </h1>
            <p class="text-lg text-muted-foreground">
              The ultimate tool to make your journey in web development less painful.
            </p>
            <button type="button" hlmBtn size="lg" class="transition-transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <!-- Reset Section -->
      <section class="px-6 py-20">
        <div class="mx-auto max-w-7xl">
          <div class="mb-16 text-center">
            <h2 class="text-4xl font-bold">Reset Your Development Journey</h2>
            <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
              Forget the confusion and complexity—use our templates to start your next project
              without the hassle.
            </p>
          </div>
          <div class="flex flex-col items-stretch gap-8 lg:flex-row">
            <div
              hlmCard
              class="flex-1 p-6 transition-transform duration-500 hover:scale-105 hover:shadow-md"
            >
              <h3 hlmCardTitle class="text-xl">Step 1: Choose Your Template</h3>
              <p hlmCardDescription class="pt-2">
                Browse through our collection of ready-to-use templates.
              </p>
            </div>
            <div
              hlmCard
              class="flex-1 p-6 transition-transform duration-500 hover:scale-105 hover:shadow-md"
            >
              <h3 hlmCardTitle class="text-xl">Step 2: Customize It</h3>
              <p hlmCardDescription class="pt-2">
                Adjust the template to your needs with minimal effort.
              </p>
            </div>
            <div
              hlmCard
              class="flex-1 p-6 transition-transform duration-500 hover:scale-105 hover:shadow-md"
            >
              <h3 hlmCardTitle class="text-xl">Step 3: Launch</h3>
              <p hlmCardDescription class="pt-2">Deploy and launch your project in no time.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="px-6 py-16">
        <div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          <div hlmCard class="p-6 transition-transform duration-500 hover:scale-105">
            <img
              src="https://placehold.co/400x200"
              alt="Open Source"
              class="mb-4 rounded-md transition-transform duration-300 hover:scale-105"
            />
            <h2 hlmCardTitle>⚡ Open Source</h2>
            <p hlmCardDescription class="pt-1">Use it for free and contribute to the project.</p>
          </div>
          <div hlmCard class="p-6 transition-transform duration-500 hover:scale-105">
            <img
              src="https://placehold.co/400x200"
              alt="Free"
              class="mb-4 rounded-md transition-transform duration-300 hover:scale-105"
            />
            <h2 hlmCardTitle>🎨 Free</h2>
            <p hlmCardDescription class="pt-1">Use even for commercial projects, no cost at all.</p>
          </div>
          <div hlmCard class="p-6 transition-transform duration-500 hover:scale-105">
            <img
              src="https://placehold.co/400x200"
              alt="Simplicity"
              class="mb-4 rounded-md transition-transform duration-300 hover:scale-105"
            />
            <h2 hlmCardTitle>🌙 Simplicity First</h2>
            <p hlmCardDescription class="pt-1">No experience needed. Just plug and play.</p>
          </div>
          <div hlmCard class="p-6 transition-transform duration-500 hover:scale-105">
            <img
              src="https://placehold.co/400x200"
              alt="Fast Launch"
              class="mb-4 rounded-md transition-transform duration-300 hover:scale-105"
            />
            <h2 hlmCardTitle>🚀 Fast Launch</h2>
            <p hlmCardDescription class="pt-1">Get projects off the ground with one command.</p>
          </div>
        </div>
      </section>

      <app-footer />
    </div>
  `,
})
export class HomeComponent {}
