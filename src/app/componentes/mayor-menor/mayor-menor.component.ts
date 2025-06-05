import { Component, OnDestroy, OnInit } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';
import { CartasService } from '../../services/cartas.service';
import { Cartas } from '../../models/cartas';
import { Subscription } from 'rxjs';
import { TopScore } from '../../models/top-score';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent implements OnInit, OnDestroy{

  constructor(private router: Router, private cartasService: CartasService) {}

  usuarioId: string ='';
  usuarioNombre: string ='';


  cartas: Cartas[] = [];
  cartaActual: Cartas | null = null;
  cartaPerdedora: Cartas | null = null;
  cartasRestantes: number = 52;
  mensaje: string = '';
  juegoTerminado: boolean = false;
  subscripcion! : Subscription;
  
  score: number = 0;

  top3: TopScore[]= [];

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

  ngOnDestroy(): void { 
    if(this.subscripcion){
      this.subscripcion.unsubscribe();
    }
  }

  iniciarJuego() {
    this.obtenerTop3('mayor-menor');
    this.subscripcion = this.cartasService.crearMazo().subscribe(res => {
      this.cartasService.setDeckId(res.deck_id);
      this.cartasRestantes = res.remaining;
      this.cartaPerdedora = null;
      this.score = 0;
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
        (eleccion === 'mayor' && valorSiguiente >= valorActual) ||
        (eleccion === 'menor' && valorSiguiente <= valorActual);

      if (acierto) {
        this.score++;
        this.mensaje = '¡Correcto! Sigue jugando.';
        this.cartaActual = cartaSiguiente;
        this.cartaPerdedora = null;
      } else {
        this.cartaPerdedora = cartaSiguiente;
        this.mensaje = `Perdiste! La carta era: `;
        this.guardarScore('mayor-menor',this.score)
        this.juegoTerminado = true;
      }

      if (this.cartasRestantes === 0 && !this.juegoTerminado) {
        this.mensaje = '¡Ganaste! No quedan más cartas.';
        this.guardarScore('mayor-menor',this.score)
        this.juegoTerminado = true;
      }
    });
  }

  getValorNumerico(carta: Cartas): number {
    const valores: Record<string, number> = {
      'ACE': 1,
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

  guardarScore(juego: string, score:number): void{
    supabase.from('score-juegos').insert([{
    user_id: this.usuarioId,
    nombre: this.usuarioNombre,
    juego,
    fecha:new Date().toISOString(),
    score  
    }])
    .then(({error}) => {
      if(error){
        console.error('Error al guardar score: ',error.message);
      }
    })
  }

  obtenerTop3(juego: string) {
    supabase
      .from('score-juegos')
      .select('nombre, score, fecha')
      .eq('juego', juego)
      .order('score', { ascending: false })
      .order('fecha', { ascending: true })
      .limit(3)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al obtener top 3:', error.message);
          this.top3 = [];
          return;
        }
        this.top3 = data || [];
      });
  }  

}
