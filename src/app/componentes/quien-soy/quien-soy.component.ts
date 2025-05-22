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
  biografia: string = 'Soy programador web con pasión por la tecnología. Me encanta el desarrollo de software utilizando tecnologías como Angular, HTML, CSS y JavaScript.' +
                      'Fuera del código, soy jugador de futsal de la primera division de Atlanta. Me encanta competir, trabajar en equipo, cualidades que también aplico en el' +
                      'mundo del desarrollo. Siempre estoy buscando aprender, mejorar y aportar valor tanto en la cancha como en cada proyecto que desarrollo.';
  imagenUrl: string = 'assets/mi-foto.jpg'; 
  
  getAvatarUrl(avatarUrl: string) {
    return supabase.storage.from('images').getPublicUrl(avatarUrl).data.publicUrl;
  }
}



