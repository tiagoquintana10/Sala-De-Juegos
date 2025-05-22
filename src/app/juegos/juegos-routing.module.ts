import { NgModule } from '@angular/core';
import { PreloadingStrategy, RouterModule, Routes } from '@angular/router';
import { JuegosComponent } from '../componentes/juegos/juegos.component';
import { AhorcadoComponent } from '../componentes/ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../componentes/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../componentes/preguntados/preguntados.component';
import { SimonDiceComponent } from '../componentes/simon-dice/simon-dice.component';

const routes: Routes = [
    {path: '', component: JuegosComponent },
    { path: 'ahorcado', component: AhorcadoComponent },
    { path: 'mayor-menor', component: MayorMenorComponent },
    { path: 'preguntados', component: PreguntadosComponent },
    { path: 'simon-dice', component: SimonDiceComponent }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
