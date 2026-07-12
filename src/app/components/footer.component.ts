import { Component } from '@angular/core'

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="tw:footer tw:footer-center tw:p-4 tw:bg-base-200 tw:text-base-content">
      <div>
        <p>&copy; {{ currentYear }} — Built with 💖 using Angular</p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear()
}
