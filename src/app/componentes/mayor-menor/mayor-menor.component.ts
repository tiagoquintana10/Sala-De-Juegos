import { Component, OnDestroy, OnInit } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';
import { CartasService } from '../../services/cartas.service';
import { Cartas } from '../../models/cartas';
import { Subscription } from 'rxjs';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent implements OnInit, OnDestroy{

  constructor(private router: Router, private cartasService: CartasService) {}

  cartas: Cartas[] = [];
  cartaActual: Cartas | null = null;
  puntaje: number = 0;
  cartasRestantes: number = 52;
  mensaje: string = '';
  juegoTerminado: boolean = false;
  subscripcion! : Subscription;


  ngOnInit(): void {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        this.router.navigate(['/login']);
      }else{  
        this.iniciarJuego();          
      }
    });
  }

  ngOnDestroy(): void { 
    this.subscripcion.unsubscribe();
  }

  iniciarJuego() {
    this.subscripcion = this.cartasService.crearMazo().subscribe(res => {
      this.cartasService.setDeckId(res.deck_id);
      this.cartasRestantes = res.remaining;
      this.puntaje = 0;
      this.juegoTerminado = false;
      this.mensaje = '';
      this.sacarPrimeraCarta();
    });
  }

  sacarPrimeraCarta() {
    this.subscripcion = this.cartasService.sacarCarta().subscribe(res => {
      this.cartaActual = res.cards[0];
      this.cartasRestantes = res.remaining;
    });
  }

  jugar(eleccion: 'mayor' | 'menor') {
    if (this.juegoTerminado || !this.cartaActual) return;

    this.subscripcion = this.cartasService.sacarCarta().subscribe(res => {
      const cartaSiguiente = res.cards[0];
      this.cartasRestantes = res.remaining;

      if (!cartaSiguiente) {
        this.mensaje = 'No quedan cartas. ¡Juego terminado!';
        this.juegoTerminado = true;
        return;
      }
      
      if (!this.cartaActual) return; // para evitar q le envie null a getValorNumerico()

      const valorActual = this.getValorNumerico(this.cartaActual);
      const valorSiguiente = this.getValorNumerico(cartaSiguiente);

      const acierto =
        (eleccion === 'mayor' && valorSiguiente > valorActual) ||
        (eleccion === 'menor' && valorSiguiente < valorActual);

      if (acierto) {
        this.puntaje++;
        this.mensaje = '¡Correcto! Sigue jugando.';
        this.cartaActual = cartaSiguiente;
      } else {
        this.mensaje = `¡Incorrecto! La carta era ${cartaSiguiente.value} de ${cartaSiguiente.suit}. Puntaje final: ${this.puntaje}`;
        this.juegoTerminado = true;
      }

      if (this.cartasRestantes === 0 && !this.juegoTerminado) {
        this.mensaje = '¡Ganaste! No quedan más cartas.';
        this.juegoTerminado = true;
      }
    });
  }

  getValorNumerico(carta: Cartas): number {
    const valores: Record<string, number> = {
      'ACE': 14,
      'KING': 13,
      'QUEEN': 12,
      'JACK': 11,
      '10': 10,
      '9': 9,
      '8': 8,
      '7': 7,
      '6': 6,
      '5': 5,
      '4': 4,
      '3': 3,
      '2': 2
    };
    return valores[carta.value.toUpperCase()] || parseInt(carta.value);
  }

}
