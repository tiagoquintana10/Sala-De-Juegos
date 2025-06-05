import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(environment.apiUrl,environment.publicAnonKey)

@Component({
  standalone: true,
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.scss'
})
export class QuienSoyComponent {

  nombre: string = 'Tiago Quintana';
  edad: string = '21 años';
  email: string = 'tiago.exequiel.quintana@gmail.com';
  profesion: string = 'Programador web y deportista';
  biografia: string = 'Soy programador web con pasión por la tecnología. Me encanta el desarrollo de software utilizando tecnologías como Angular, HTML, CSS y JavaScript. ' +
                      'Fuera del código, soy jugador de futsal de la primera division de Atlanta. Me encanta competir, trabajar en equipo, cualidades que también aplico en el ' +
                      'mundo del desarrollo. Siempre estoy buscando aprender, mejorar y aportar valor tanto en la cancha como en cada proyecto que desarrollo.';
  miJuego: string = 'Mi juego propuesto es el simon-dice. El juego empieza con un color que se ilumina en la pantalla (por ejemplo, un cuadrado rojo). ' +
  'Este color es el primer paso de la secuencia de colores. Cada ronda, Simon (el "controlador" del juego) agrega un nuevo color a la secuencia que el jugador debe seguir. ' +
  'La secuencia se va haciendo más larga a medida que avanzan los niveles del juego. El jugador debe repetir la secuencia de colores haciendo clic sobre los botones correspondientes '+
  'en el mismo orden en el que se presentaron. Si el jugador acierta, se pasa al siguiente nivel y se agrega otro color a la secuencia. ¿Qué pasa si el jugador se equivoca? ' +
  'Si el jugador hace clic en un color incorrecto o no sigue la secuencia correctamente, el juego termina y el jugador pierde. El nivel alcanzado se muestra como su puntuación.'
  imagenUrl: string = 'assets/mi-foto.jpg'; 
  
  getAvatarUrl(avatarUrl: string) {
    return supabase.storage.from('images').getPublicUrl(avatarUrl).data.publicUrl;
  }
}



