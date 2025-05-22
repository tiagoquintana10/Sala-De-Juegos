import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './juegos-routing.module';
import { JuegosComponent } from '../componentes/juegos/juegos.component';
import { AhorcadoComponent } from '../componentes/ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../componentes/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../componentes/preguntados/preguntados.component';
import { SimonDiceComponent } from '../componentes/simon-dice/simon-dice.component';


@NgModule({
  declarations: [JuegosComponent,AhorcadoComponent,MayorMenorComponent,PreguntadosComponent,SimonDiceComponent],
  imports: [
    CommonModule,
    JuegosRoutingModule
  ],
  exports:[
    JuegosComponent 
  ]
})
export class JuegosModule { }
