import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juegos',
  standalone: false,
  templateUrl: './juegos.component.html',
  styleUrl: './juegos.component.scss'
})
export class JuegosComponent {
  
  constructor(private router: Router) {}

  juegos = [
    {
      nombre: 'Ahorcado',
      icono: '😵🪢',
      ruta: 'ahorcado'
    },
    {
      nombre: 'Mayor o menor',
      icono: '🔼🔽🎲',
      ruta: 'mayor-menor'
    },
    {
      nombre: 'Preguntados',
      icono: '❓🧠',
      ruta: 'preguntados'
    },
    {
      nombre: 'Simon dice',
      icono: '🧠🎵💡',
      ruta: 'simon-dice'
    }
  ];

  irAJuego(ruta: string) {
    this.router.navigate(['home', 'juegos', ruta]);
  }
}

