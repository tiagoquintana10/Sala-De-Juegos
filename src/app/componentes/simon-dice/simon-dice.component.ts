import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Component({
  selector: 'app-simon-dice',
  standalone: false,
  templateUrl: './simon-dice.component.html',
  styleUrl: './simon-dice.component.scss'
})
export class SimonDiceComponent {

  usuarioId: string ='';
  usuarioNombre: string ='';

  colores: string[] = ['verde', 'rojo', 'amarillo', 'azul'];
  secuencia: string[] = [];
  secuenciaJugador: string[] = [];
  nivel: number = 0;
  mostrandoSecuencia: boolean = false;
  mensaje: string = '';
  
  score: number = 0;
  ultimoScore: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        this.router.navigate(['/login']);
      }else{
        this.usuarioId = user.id;
        supabase.from('users-data').select('name').eq('authId',this.usuarioId).single()
        .then(({data,error}) => {
          this.usuarioNombre = data?.name || 'Desconocido';
          this.iniciarJuego();  
        })  
      }
    });
  }

    iniciarJuego() {
    this.secuencia = [];
    this.secuenciaJugador = [];
    this.nivel = 0;
    this.mensaje = '';
    this.score = 0;
    this.nuevaRonda();
  }

  nuevaRonda() {
    this.nivel++;
    this.mensaje = `Nivel ${this.nivel}`;
    this.secuenciaJugador = [];
    const colorAleatorio = this.colores[Math.floor(Math.random() * this.colores.length)];
    this.secuencia.push(colorAleatorio);
    this.mostrarSecuencia();
  }

  mostrarSecuencia() {
    this.mostrandoSecuencia = true;
    let i = 0;

    const intervalo = setInterval(() => {
      const color = this.secuencia[i];
      this.resaltar(color);
      i++;
      if (i >= this.secuencia.length) {
        clearInterval(intervalo);
        this.mostrandoSecuencia = false;
      }
    }, 800);
  }

  resaltar(color: string) {
    const btn = document.getElementById(color);
    if (btn) {
      btn.classList.add('activo');
      setTimeout(() => btn.classList.remove('activo'), 400);
    }
  }

  seleccionar(color: string) {
    if (this.mostrandoSecuencia) return;

    this.secuenciaJugador.push(color);
    const index = this.secuenciaJugador.length - 1;

    if (color !== this.secuencia[index]) {
      this.mensaje = '¡Perdiste!';
      this.ultimoScore = this.score;
      this.mostrandoSecuencia = true;
      return;
    }

    if (this.secuenciaJugador.length === this.secuencia.length) {
      this.mensaje = '¡Bien hecho!';
      this.score++;
      setTimeout(() => this.nuevaRonda(), 1000);
    }
  }
}
  

