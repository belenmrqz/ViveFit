import { Routes } from '@angular/router';
import { EjerciciosComponent } from './pages/ejercicios/ejercicios.component';
import { CalculadoraComponent } from './pages/calculadora/calculadora.component';
import { PrincipalComponent } from './pages/principal/principal.component';


export const routes: Routes = [
    { path: '', component: PrincipalComponent },   //Carga el componente principal por defecto 
    { path: 'ejercicios', component: EjerciciosComponent },
    { path: "calculadora", component: CalculadoraComponent }
   
];
