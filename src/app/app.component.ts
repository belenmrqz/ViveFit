import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { PrincipalComponent } from './pages/principal/principal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vivefit';
}

