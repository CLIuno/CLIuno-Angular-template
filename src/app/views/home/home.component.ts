import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { NavbarComponent } from '../../components/navbar.component'
import { FooterComponent } from '../../components/footer.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="tw:min-h-screen tw:bg-base-100 tw:text-base-content">
      <app-navbar />

      <!-- Hero Section -->
      <section class="tw:hero tw:min-h-[80vh] tw:bg-base-200">
        <div class="tw:hero-content tw:flex-col lg:tw:flex-row-reverse">
          <img
            src="https://placehold.co/600x400/"
            class="tw:max-w-sm tw:rounded-2xl tw:shadow-2xl tw:transition-transform tw:duration-500 tw:ease-in-out tw:transform-gpu hover:tw:rotate-3 hover:tw:scale-105"
            alt="Hero"
          />
          <div class="tw:animate-fade-in tw:space-y-4">
            <h1 class="tw:text-5xl tw:font-bold tw:text-primary animate-bounce">
              Welcome to CLIuno Templates
            </h1>
            <p class="tw:py-6 tw:text-lg tw:max-w-xl">
              The ultimate tool to make your journey in web development less painful.
            </p>
            <button
              class="tw:btn tw:btn-primary hover:tw:scale-105 tw:transition-transform tw:duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <!-- Reset Section -->
      <section class="tw:py-20 tw:px-6">
        <div class="tw:max-w-7xl tw:mx-auto">
          <div class="tw:text-center tw:mb-16">
            <h2 class="tw:text-4xl tw:font-bold tw:text-primary">Reset Your Development Journey</h2>
            <p class="tw:text-lg tw:max-w-2xl tw:mx-auto">
              Forget the confusion and complexity—use our templates to start your next project
              without the hassle.
            </p>
          </div>
          <div
            class="tw:flex tw:flex-col lg:tw:flex-row tw:gap-8 tw:items-stretch tw:perspective-[1000px]"
          >
            <div
              class="tw:card tw:bg-base-100 tw:p-6 tw:rounded-xl tw:transition-transform tw:duration-500 tw:transform-gpu hover:tw:rotate-y-6 hover:tw:scale-105"
            >
              <h3 class="tw:text-xl tw:font-semibold tw:text-accent">
                Step 1: Choose Your Template
              </h3>
              <p class="tw:py-4">Browse through our collection of ready-to-use templates.</p>
            </div>
            <div
              class="tw:card tw:bg-base-100 tw:p-6 tw:rounded-xl tw:transition-transform tw:duration-500 tw:transform-gpu hover:tw:rotate-y-[-6deg] hover:tw:scale-105"
            >
              <h3 class="tw:text-xl tw:font-semibold tw:text-accent">Step 2: Customize It</h3>
              <p class="tw:py-4">Adjust the template to your needs with minimal effort.</p>
            </div>
            <div
              class="tw:card tw:bg-base-100 tw:p-6 tw:rounded-xl tw:transition-transform tw:duration-500 tw:transform-gpu hover:tw:rotate-y-3 hover:tw:scale-105"
            >
              <h3 class="tw:text-xl tw:font-semibold tw:text-accent">Step 3: Launch</h3>
              <p class="tw:py-4">Deploy and launch your project in no time.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="tw:py-16 tw:px-6">
        <div
          class="tw:flex md:tw:grid md:tw:grid-cols-3 tw:gap-6 tw:overflow-x-auto tw:scrollbar-hide tw:space-x-4 md:tw:space-x-0"
        >
          <div
            class="tw:min-w-70 md:tw:min-w-0 tw:card tw:bg-base-100 tw:p-6 tw:rounded-xl tw:shadow-md tw:transition-transform tw:duration-500 hover:tw:scale-105 hover:tw:rotate-2 tw:transform-gpu animate-pulse"
          >
            <img
              src="https://placehold.co/400x200"
              alt="Open Source"
              class="tw:rounded-md tw:mb-4 tw:transition-transform tw:duration-300 hover:tw:scale-105"
            />
            <h2 class="tw:card-title tw:text-primary">⚡ Open Source</h2>
            <p>Use it for free and contribute to the project.</p>
          </div>
          <div
            class="tw:min-w-70 md:tw:min-w-0 tw:card tw:bg-base-100 tw:p-6 tw:rounded-xl tw:shadow-md tw:transition-transform tw:duration-500 hover:tw:scale-105 hover:tw:-rotate-2 tw:transform-gpu animate-pulse"
          >
            <img
              src="https://placehold.co/400x200"
              alt="Free"
              class="tw:rounded-md tw:mb-4 tw:transition-transform tw:duration-300 hover:tw:scale-105"
            />
            <h2 class="tw:card-title tw:text-secondary">🎨 Free</h2>
            <p>Use even for commercial projects, no cost at all.</p>
          </div>
          <div
            class="tw:min-w-70 md:tw:min-w-0 tw:card tw:bg-base-100 tw:p-6 tw:rounded-xl tw:shadow-md tw:transition-transform tw:duration-500 hover:tw:scale-105 hover:tw:rotate-y-3 tw:transform-gpu animate-pulse"
          >
            <img
              src="https://placehold.co/400x200"
              alt="Simplicity"
              class="tw:rounded-md tw:mb-4 tw:transition-transform tw:duration-300 hover:tw:scale-105"
            />
            <h2 class="tw:card-title tw:text-accent">🌙 Simplicity First</h2>
            <p>No experience needed. Just plug and play.</p>
          </div>
          <div
            class="tw:min-w-70 md:tw:min-w-0 tw:card tw:bg-base-100 tw:p-6 tw:rounded-xl tw:shadow-md tw:transition-transform tw:duration-500 hover:tw:scale-105 hover:tw:-rotate-y-3 tw:transform-gpu animate-pulse"
          >
            <img
              src="https://placehold.co/400x200"
              alt="Fast Launch"
              class="tw:rounded-md tw:mb-4 tw:transition-transform tw:duration-300 hover:tw:scale-105"
            />
            <h2 class="tw:card-title tw:text-info">🚀 Fast Launch</h2>
            <p>Get projects off the ground with one command.</p>
          </div>
        </div>
      </section>

      <app-footer />
    </div>
  `,
  styles: [
    `
      @keyframes fade-in-left {
        0% {
          opacity: 0;
          transform: translateX(-40px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes fade-in-right {
        0% {
          opacity: 0;
          transform: translateX(40px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      :host ::ng-deep .animate-fade-in-left {
        animation: fade-in-left 1s ease-out both;
      }
      :host ::ng-deep .animate-fade-in-right {
        animation: fade-in-right 1s ease-out both;
      }
    `,
  ],
})
export class HomeComponent {}
