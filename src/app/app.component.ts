import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { AuthStore } from './services/auth.store'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  constructor(private readonly authStore: AuthStore) {}

  ngOnInit() {
    if (this.authStore.token()) {
      this.authStore.fetchCurrentUser()
    }
  }
}
