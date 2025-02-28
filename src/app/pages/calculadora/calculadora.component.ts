import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

/**
 * Componente de la calculadora para calcular el IMC, TMB y macronutrientes según los datos proporcionados.
 * Permite al usuario ingresar su peso, altura, edad, género, horas de sueño, horas activas y objetivo de salud.
 */
@Component({
  selector: 'app-calculadora',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent {

  // Formulario reactivo para capturar los datos del usuario
  calculadoraForm: FormGroup;

  // Variables para almacenar los resultados
  resultadoTMB: number | null = null;
  resultadoIMC: number = 0;
  imcOMS: string = '';
  porcentGrasa: number = 0;
  porcentMusculo: number = 0;
  lipidos: number = 0;
  hidratos: number = 0;
  proteina: number = 0;

  // Controla la visibilidad de los resultados
  mostrarResultados: boolean = false;   
  resultadosCalculados: boolean = false;

  /**
   * Constructor que inicializa el formulario reactivo con las validaciones necesarias.
   */
  constructor(private router: Router, private fb: FormBuilder) {
    this.calculadoraForm = this.fb.group({
      peso: ['', [Validators.required, Validators.min(1)]],
      altura: ['', [Validators.required, Validators.min(50)]],
      genero: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      objetivo: ['', Validators.required],
      horasSuenio: ['', [Validators.required, Validators.min(0), Validators.max(24)]],
      horasActivas: ['', [Validators.required, Validators.min(0), Validators.max(24)]]
    });
  }

  /** NAVEGABILIDAD O RUTEO */
  
  /**
   * Navega hacia la página principal.
   */
  irAPrincipal() {
    this.router.navigate(['/']);
  }

  /**
   * Reinicia el formulario y oculta los resultados.
   */
  reiniciarFormulario() {
    this.calculadoraForm.reset();
    this.mostrarResultados = false;
  }

  /**
   * Permite editar el formulario, ocultando los resultados.
   */
  editarFormulario() {
    this.mostrarResultados = false;
    this.resultadosCalculados = false;
  }

  /**
   * Navega hacia la página de ejercicios.
   */
  irAEjercicios() {
    this.router.navigate(['/ejercicios']);  
  }

  /** COMPROBACIONES */

  /**
   * Calcula todos los resultados (IMC, TMB, macronutrientes) y muestra los resultados.
   * Si el formulario es inválido, muestra un mensaje de error.
   */
  calcularTodo() {
    if (this.calculadoraForm.valid) {
      this.calcularIMC();
      this.calcularTMB();
      this.macronutrientes();
      this.mostrarResultados = true;
      this.resultadosCalculados = true;
      this.IMCsegunOMS();
      this.porcentajes();
    } else if (this.camposRellenos()) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, revisa los datos ingresados e inténtalo de nuevo.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, rellena todos los campos e inténtalo de nuevo.',
      });
    }
  }

  /** CALCULOS */

  /**
   * Calcula la Tasa Metabólica Basal (TMB) del usuario.
   */
  calcularTMB() {
    if (this.calculadoraForm.valid) {
      const { peso, altura, genero, edad } = this.calculadoraForm.value;
      let tmb: number;

      // Fórmula de Harris-Benedict para calcular TMB
      tmb = (10 * peso) + (6.25 * altura) - (5 * edad) + (genero === 'masculino' ? 5 : -161);
      this.resultadoTMB = parseFloat((tmb).toFixed(2));
    }
  }

  /**
   * Obtiene el valor de calorías por hora.
   */
  get kcalHora(): number {
    return this.resultadoTMB ? this.resultadoTMB / 24 : 0;
  }

  /**
   * Calcula las calorías diarias necesarias considerando la actividad física y el sueño.
   */
  get kcalDiaActivo(): number {
    const { horasActivas, horasSuenio } = this.calculadoraForm.value;
    if (!this.resultadoTMB) return 0;

    const horasExtras = (24 - horasActivas - horasSuenio) * 1.5 * this.kcalHora;
    const horasDormido = horasSuenio * 1 * this.kcalHora;
    const horasAct = horasActivas * 2.5 * this.kcalHora;

    return parseFloat((horasExtras + horasDormido + horasAct).toFixed(2));
  }

  /**
   * Calcula el Índice de Masa Corporal (IMC) del usuario.
   */
  calcularIMC() {
    if (this.calculadoraForm.valid) {
      const { peso, altura } = this.calculadoraForm.value;
      const alturaMetros = altura / 100;
      this.resultadoIMC = parseFloat((peso / Math.pow(alturaMetros, 2)).toFixed(2));
    }
  }

  /**
   * Determina el estado del IMC según los estándares de la OMS.
   */
  IMCsegunOMS() {
    this.calcularIMC();

    if (this.resultadoIMC < 18.5) {
      this.imcOMS = 'infrapeso - delgadez';
    } else if (this.resultadoIMC >= 18.5 && this.resultadoIMC <= 24.9) {
      this.imcOMS = 'peso normal';
    } else if (this.resultadoIMC >= 25 && this.resultadoIMC <= 29.9) {
      this.imcOMS = 'sobrepeso';
    } else if (this.resultadoIMC >= 30 && this.resultadoIMC <= 34.9) {
      this.imcOMS = 'obesidad grado 1';
    } else if (this.resultadoIMC >= 35 && this.resultadoIMC <= 39.9) {
      this.imcOMS = 'obesidad grado 2';
    } else {
      this.imcOMS = 'obesidad grado 3 - obesidad mórbida';
    }
  }

  /**
   * Calcula los porcentajes de grasa corporal y masa muscular.
   */
  porcentajes() {
    const { genero, edad, peso } = this.calculadoraForm.value;
    this.porcentGrasa = parseFloat(((1.2 * this.resultadoIMC) + (0.23 * edad) - (genero === 'masculino' ? 10.8 : 0) - 5.4).toFixed(2));

    let x: number = peso * this.porcentGrasa / 100;
    let y: number = (peso - x) * 0.5;
    this.porcentMusculo = parseFloat(((y / peso) * 100).toFixed(2));
  }

  /**
   * Calcula los macronutrientes necesarios según el objetivo de la persona.
   */
  macronutrientes() {
    if (this.calculadoraForm.valid) {
      const { objetivo, genero } = this.calculadoraForm.value;

      let imcReferencia: number = 21.7;
      let kcalConsumir: number = imcReferencia * this.kcalDiaActivo / this.resultadoIMC;

      if (objetivo === 'saludable') {
        this.lipidos = parseFloat((this.kcalDiaActivo * 0.2 / 9).toFixed(2));
        this.hidratos = parseFloat((this.kcalDiaActivo * 0.6 / 4).toFixed(2));
        this.proteina = parseFloat((this.kcalDiaActivo * 0.2 / 4).toFixed(2));
      } else if (objetivo === 'entrenar') {
        if (genero === 'masculino') {
          this.lipidos = parseFloat((this.kcalDiaActivo * 0.2 / 9).toFixed(2));
          this.hidratos = parseFloat((this.kcalDiaActivo * 0.5 / 4).toFixed(2));
          this.proteina = parseFloat((this.kcalDiaActivo * 0.3 / 4).toFixed(2));
        } else if (genero === 'femenino') {
          this.lipidos = parseFloat((this.kcalDiaActivo * 0.25 / 9).toFixed(2));
          this.hidratos = parseFloat((this.kcalDiaActivo * 0.5 / 4).toFixed(2));
          this.proteina = parseFloat((this.kcalDiaActivo * 0.25 / 4).toFixed(2));
        }
      }
    }
  }

  /** EXTRAS */

  /**
   * Verifica si todos los campos del formulario están llenos.
   */
  camposRellenos(): boolean {
    return Object.values(this.calculadoraForm.value).every(value => value !== '' && value !== null);
  }

  /** ACLARACIONES AL USUARIO */

  /**
   * Muestra una aclaración sobre las diferencias entre las calorías diarias necesarias con y sin actividad.
   */
  caloriasAclaracion() {
    Swal.fire({
      icon: 'info',
      title: 'Diferencia entre los dos resultados',
      text: 'Las kcal diarias necesarias son aquellas calorías que el cuerpo necesita para realizar sus funciones básicas mientras está en reposo total, mientras que las kcal diarias con actividad son aquellas calorías que necesitas según tu nivel de actividad diaria.',
    });
  }
}
