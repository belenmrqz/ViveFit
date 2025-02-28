import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

/**
 * Componente principal de la aplicación.
 * Muestra la pantalla de inicio y proporciona métodos para navegar a otras vistas.
 */
@Component({
  selector: 'app-principal',
  imports: [RouterModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  /**
   * Constructor del componente.
   * @param router El servicio de router utilizado para la navegación entre rutas.
   */
  constructor(private router: Router) {}

  /**
   * Método que navega a la vista de la calculadora.
   */
  irACalculadora() {
    this.router.navigate(['/calculadora']);
  }

  /**
   * Método que navega a la vista de los ejercicios.
   */
  irAEjercicios() {
    this.router.navigate(['/ejercicios']);
  }
}
