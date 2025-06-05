import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { JuegosModule } from './juegos/juegos.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,JuegosModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SalaDeJuegos';
}
