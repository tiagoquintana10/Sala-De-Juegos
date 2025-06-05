import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { createClient } from '@supabase/supabase-js';
import { PersonajesRYMService } from '../../services/personajes-RYM.service';
import { Personaje } from '../../models/personajes';
import { TopScore } from '../../models/top-score';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Subscription } from 'rxjs';


const supabase = createClient(environment.apiUrl, environment.publicAnonKey);


@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent implements OnInit {

  usuarioId: string ='';
  usuarioNombre: string ='';

  personajeCorrecto!: Personaje;
  opciones: string[] = [];
  imagenUrl: string = '';
  respuestaSeleccionada: string = '';
  respuestaCorrecta: boolean | null = null;
  subscripcion!: Subscription;

  score: number = 0;
  ultimoScore: number = 0;

  top3: TopScore[]= [];

  constructor(private router: Router, private RYMService: PersonajesRYMService  ) {}

  ngOnInit(): void {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        this.router.navigate(['/login']);
      }else{
        this.usuarioId = user.id;
        supabase.from('users-data').select('name').eq('authId',this.usuarioId).single()
        .then(({data,error}) => {
          this.usuarioNombre = data?.name || 'Desconocido';
          this.generarPregunta();  
        })
      }
    });
  }

  ngOnDestroy(): void { 
    if(this.subscripcion){
      this.subscripcion.unsubscribe();
    }
  }

  generarPregunta(): void {
    this.obtenerTop3('preguntados');
    this.subscripcion = this.RYMService.getPersonajes().subscribe(data => {
      const personajes = data.results;
      
      // Elegir personaje correcto al azar
      const aleatorio = personajes[Math.floor(Math.random() * personajes.length)];
      this.personajeCorrecto = aleatorio;
      this.imagenUrl = aleatorio.image;

      // Elegir 3 personajes incorrectos
      const incorrectos = personajes
        .filter(p => p.name !== aleatorio.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(p => p.name);

      // Combinar y mezclar opciones
      this.opciones = [...incorrectos, aleatorio.name].sort(() => 0.5 - Math.random());
      this.respuestaSeleccionada = '';
      this.respuestaCorrecta = null;
    });
  }

  seleccionarOpcion(nombre: string): void {
    this.respuestaSeleccionada = nombre;
    this.respuestaCorrecta = nombre === this.personajeCorrecto.name;

    if(this.respuestaCorrecta) {
      this.score++;
    }else{
      this.ultimoScore = this.score;
      this.guardarScore('preguntados',this.ultimoScore);
      this.score = 0;
    }
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
