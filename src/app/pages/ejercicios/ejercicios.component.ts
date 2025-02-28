import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

/**
 * Componente para la gestión de rutinas de ejercicios.
 * Permite a los usuarios crear rutinas personalizadas y ver los resultados generados.
 */
@Component({
  selector: 'app-ejercicios',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ejercicios.component.html',
  styleUrl: './ejercicios.component.css',
})
export class EjerciciosComponent {
  /**
   * Formulario de ejercicios.
   */
  ejerciciosForm: FormGroup;

  /**
   * Rutina generada después de calcular.
   */
  rutinaGenerada: any = null;

  /**
   * Descripción de la rutina generada.
   */
  descripcionRutina: any = null;

  /**
   * Indica si se deben mostrar los resultados calculados.
   */
  mostrarResultados: boolean = false;

  /**
   * Indica si los resultados ya fueron calculados.
   */
  resultadosCalculados: boolean = false;

  /**
   * Constructor del componente.
   * @param router El servicio de router utilizado para la navegación.
   * @param fb El servicio FormBuilder utilizado para construir formularios reactivos.
   */
  constructor(private router: Router, private fb: FormBuilder) {
    this.ejerciciosForm = this.fb.group({
      tipoRutina: ['', [Validators.required]],
      diasEntrenamiento: ['', [Validators.required]],
    });
  }

  /**
   * Navega a la vista principal.
   */
  irAPrincipal() {
    this.router.navigate(['/']);
  }

  /**
   * Navega a la vista de la calculadora.
   */
  irACalculadora(){
    this.router.navigate(['/calculadora']);
  }

  /**
   * Permite editar el formulario y mostrar la vista original sin resultados.
   */
  editarFormulario() {
    this.mostrarResultados = false;
    this.resultadosCalculados = false;
    this.rutinaGenerada = null;
    this.descripcionRutina = null;
  }

  /**
   * Resetea el formulario y borra los resultados generados.
   */
  resetearFormulario() {
    this.ejerciciosForm.reset();
    this.mostrarResultados = false;
    this.rutinaGenerada = null;
    this.descripcionRutina = null;
  }

  /**
   * Muestra información sobre la diferencia entre ejercicios compuestos y aislados.
   */
  compuestosAislados() {
    Swal.fire({
      icon: 'question',
      title: '¿Qué son los ejercicios compuestos y aislados?',
      text: 'Los ejercicios compuestos trabajan varios músculos al mismo tiempo, mientras que los aislados se centran en un solo músculo.'
    });
  }

  /**
   * Crea una rutina personalizada en base a la selección del usuario.
   * Calcula la rutina según los datos introducidos.
   */
  crearRutina() {
    if (this.ejerciciosForm.valid) {
      const { tipoRutina, diasEntrenamiento } = this.ejerciciosForm.value;
      const dias = parseInt(diasEntrenamiento, 10);

      this.mostrarResultados = true;
      this.resultadosCalculados = true;

      // Base de datos de rutinas
      const rutinas: any = {
        // Definición de rutinas según tipo y días
      };

      this.rutinaGenerada = rutinas[tipoRutina]?.[dias] || null;
      this.descripcionRutina = rutinas[tipoRutina]?.descripcion || null;

      if (!this.rutinaGenerada) {
        console.log("No se encontró una rutina para esta combinación.");
      } else {
        console.log("Rutina generada:", this.rutinaGenerada);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Debes rellenar todos los campos para continuar'
      });
    }
  }
}
