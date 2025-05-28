import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Component({
  selector: 'app-ahorcado',
  standalone:false,
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {
  
  constructor(private router: Router) {}
  
  palabraOculta: string = '';
  letrasAdivinadas: string[] = [];
  intentosRestantes: number = 6;
  juegoTerminado: boolean = false;
  juegoGanado: boolean = false;

  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  listaPalabras: string[] = ['ANGULAR', 'PROGRAMACION', 'AHORCADO', 'DESARROLLO', 'JUEGO'];

  ngOnInit(): void {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        this.router.navigate(['/login']);
      }else{
        this.reiniciarJuego();
      }
    });
  }


  get letrasPalabra(): string[] {
    return this.palabraOculta.split('');
  }

  letraUsada(letra: string): boolean {
    return this.letrasAdivinadas.includes(letra);
  }

  intentar(letra: string): void {
    if (this.juegoTerminado || this.letraUsada(letra)) return;

    this.letrasAdivinadas.push(letra);

    if (!this.palabraOculta.includes(letra)) {
      this.intentosRestantes--;

      if (this.intentosRestantes === 0) {
        this.juegoTerminado = true;
        this.juegoGanado = false;
      }
    } else {
      const todasAdivinadas = this.letrasPalabra.every(letra => this.letrasAdivinadas.includes(letra));
      if (todasAdivinadas) {
        this.juegoTerminado = true;
        this.juegoGanado = true;
      }
    }
  }

  reiniciarJuego(): void {
    const indice = Math.floor(Math.random() * this.listaPalabras.length);
    this.palabraOculta = this.listaPalabras[indice];
    this.letrasAdivinadas = [];
    this.intentosRestantes = 6;
    this.juegoTerminado = false;
    this.juegoGanado = false;
  }

}



