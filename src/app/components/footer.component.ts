import { Component } from '@angular/core'

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t py-4 text-center text-sm text-muted-foreground">
      <p>&copy; {{ currentYear }} — Built with 💖 using Angular</p>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear()
}
