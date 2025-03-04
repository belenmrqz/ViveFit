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

  mostrarResultados: boolean = false;   // Controla qué se muestra en pantalla
  resultadosCalculados: boolean = false;  // Indica si los resultados han sido calculados

  //API
  

  constructor(private router: Router, private fb: FormBuilder) {
    this.ejerciciosForm = this.fb.group({
      tipoRutina: ['', [Validators.required]],
      diasEntrenamiento: ['', [Validators.required]],
    });
  }



  irAPrincipal() {
    this.router.navigate(['/']);
  }

    /**
   * Navega a la vista de la calculadora.
   */

  irACalculadora(){
    this.router.navigate(['/calculadora'])
  }

  editarFormulario(){  //Vuelve al formulario con los datos introducidos anteriormente 
    this.mostrarResultados = false;
    this.resultadosCalculados = false;
    this.rutinaGenerada = null;
    this.descripcionRutina = null;
  }

  resetearFormulario(){ //Vuelve al formulario en blanco para volver a empzar
    this.ejerciciosForm.reset();
    this.mostrarResultados = false;
    this.rutinaGenerada = null;
    this.descripcionRutina = null;
  }


  compuestosAislados(){
    Swal.fire({
      icon: 'question',
      title: '¿Qué son los ejercicios compuestos y aislados?',
      text: 'Los ejercicios compuestos son los que trabajan varios músculos al mismo tiempo, como las sentadillas, que usan piernas, glúteos y abdomen. Son más eficientes porque ganas fuerza en varias partes del cuerpo a la vez. Los ejercicios aislados se enfocan en un solo músculo, como el curl de bíceps, que solo trabaja el brazo. Son buenos para definir o mejorar zonas específicas.'
    });
  }

  

  crearRutina() {
    if (this.ejerciciosForm.valid) {
      const { tipoRutina, diasEntrenamiento } = this.ejerciciosForm.value
      const dias = parseInt(diasEntrenamiento, 10);

      this.mostrarResultados = true;
      this.resultadosCalculados = true;

      // Base de datos de rutinas
      const rutinas: any = {
        hipertrofia: {
          descripcion:{
            queEs: 'Una rutina de hipertrofia está diseñada para ayudarte a aumentar el tamaño de tus músculos. Si tu objetivo es verte más fuerte, definido y con mayor volumen muscular, este es el tipo de entrenamiento que necesitas.',
            comoFunciona: 'El crecimiento muscular ocurre cuando sometes tus músculos a un esfuerzo intenso que los obliga a adaptarse. Este esfuerzo crea pequeños desgarros en las fibras musculares que, al recuperarse, se vuelven más grandes y fuertes.',
            seriesRepes: 'de 3 a 4 seies de 8 a 12 repeticiones'
          },
          3: { nombre:'Hipertrofia 3 días/semana', ejercicios: 'de 5 a 7 ejercicios', distribucion: 'de 2 a 3  compuestos y de 3 a 4 aislados', tipo: 'Full body' },
          4: { nombre:'Hipertrofia 4 días/semana', ejercicios: 'de 6 a 8 ejercicios', distribucion: '2 compuestos y de 4 a 6 aislados', tipo: '2 días tren superior y 2 días tren inferior' },
          5: { nombre:'Hipertrofia 5 días/semana', ejercicios: 'de 7 a 9 ejercicios', distribucion: '2 compuestos y de 5 a 7 aislados', tipo: 'Pecho + espalda, hombro + brazo, pierna + abs, etc.' }
        },
        fuerza: {
          descripcion: {
            queEs: 'Una rutina de fuerza se enfoca en mejorar la capacidad de tus músculos para levantar cargas pesadas. Si tu objetivo es aumentar tu fuerza máxima y la resistencia de los músculos, este es el entrenamiento ideal.',
            comoFunciona: 'El entrenamiento de fuerza pone a tus músculos bajo una tensión significativa mediante levantamiento de pesas, lo que provoca adaptaciones neurológicas y fisiológicas que mejoran la capacidad de generar fuerza.',
            seriesRepes: 'de 4 a 6 seies de 3 a 6 repeticiones'
          },
          3: { nombre:'Fuerza 3 días/semana', ejercicios: 'de 4 a 5 ejercicios', distribucion: '3 compuestos y de 1 a 2 accesorios', tipo: 'Full body' },
          4: { nombre:'Fuerza 4 días/semana', ejercicios: 'de 5 a 6 ejercicios', distribucion: '2 compuestos y de 3 a 4 accesorios', tipo: '2 días tren superior y 2 días tren inferior' },
          5: { nombre:'Fuerza 5 días/semana', ejercicios: 'de 5 a 7 ejercicios', distribucion: '2 compuestos yde  4 a 5 accesorios', tipo: 'Pecho + espalda, hombro + brazo, etc.' }
        },
        enForma: {
          descripcion: {
            queEs: 'Una rutina para mantenerse en forma está diseñada para mantener una buena salud física general y un cuerpo tonificado. Ideal para quienes no buscan cambios extremos pero quieren mantenerse activos.',
            comoFunciona: 'La rutina está equilibrada con ejercicios de fuerza y cardiovasculares, que ayudan a mantener la masa muscular mientras se mejora la resistencia y la salud general del cuerpo.',
            seriesRepes: 'de 2 a 4 series de 12 a 20 repeticiones'
          },
          3: { nombre:'Mantenerse en forma 3 días/semana', ejercicios: 'de 5 a 7 ejercicios', distribucion: 'de 3 a 4 compuestos y de 2 a 3 aislados', tipo: 'Full body' },
          4: { nombre:'Mantenerse en forma 4 días/semana', ejercicios: 'de 6 a 8 ejercicios', distribucion: 'de 2 a 3 compuestos y de 4 a 5 aislados', tipo: '2 días tren superior y 2 días tren inferior' },
          5: { nombre:'Mantenerse en forma 5 días/semana', ejercicios: 'de 6 a 9 ejercicios', distribucion: '2 compuestos y de 4 a 6 aislados', tipo: 'Pecho + espalda, hombro + brazo, etc.' }
        },
        perderPeso: {
          descripcion: {
            queEs: 'Una rutina para perder peso se enfoca en quemar calorías y reducir la grasa corporal. Implica combinar ejercicios de resistencia con un enfoque en cardio para maximizar la quema de calorías.',
            comoFunciona: 'Al aumentar el ritmo cardíaco durante los ejercicios y combinarlo con entrenamiento de fuerza, tu cuerpo se vuelve más eficiente en la quema de grasa mientras mantiene la masa muscular.',
            seriesRepes: 'de 4 a 5 seies de 8 a 15 repeticiones'
          },
          3: { nombre:'Perdida de peso 3 días/semana', ejercicios: 'de 6 a 8 ejercicios', distribucion: 'de 3 a 4 ejercicios compuestos, de 2 a 3 aislados y de 1 a 2 de alta intensidad', tipo: 'Full body' },
          4: { nombre:'Perdida de peso 4 días/semana', ejercicios: 'de 7 a 9 ejercicios', distribucion: 'de 2 a 3 ejercicios compuestos, de 3 a 4 aislados y 2 de alta intensidad', tipo: '2 días tren superior y 2 días tren inferior' },
          5: { nombre:'Perdida de peso 5 días/semana', ejercicios: 'de 6 a 10 ejercicios', distribucion: '2 ejercicios compuestos, de 4 a 5 aislados y de 2 a 3 de alta intensidad', tipo: 'Pecho, hombro y tríceps, espalda y bíceps, etc.' }
        }
      };

      // Obtener la rutina según el tipo y los días seleccionados
      this.rutinaGenerada = rutinas[tipoRutina]?.[dias] || null;
      this.descripcionRutina = rutinas[tipoRutina]?.descripcion || null;


      if (!this.rutinaGenerada) {
        console.log("No se encontró una rutina para esta combinación.");
      } else {
        console.log("Rutina generada:", this.rutinaGenerada);
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Formulario invalido',
        text: 'Debes rellenar todos los campos para continuar'
      });
    }


  }
}





  