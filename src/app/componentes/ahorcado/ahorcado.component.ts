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
  listaPalabras: string[] = ["ZAPATILLA", "LAGO", "GUITARRA", "RUEDA", "HIELO", "TEXTO", "ZEBRA", "ISLA", "NUBE", "ORGANO",
  "BARCO", "VELA", "OPTICO", "YOGA", "DADO", "BESO", "MESA", "XILOFONO", "SILLA", "KILO",
  "AMIGO", "FOTO", "CABALLO", "NARANJA", "WIFI", "LUNA", "QUEMAR", "HADA", "RANA", "MURCIELAGO",
  "GEMA", "JIRAFA", "JUEGO", "BANDERA", "KACTUS", "TIGRE", "SOPA", "PAIS", "CIELO", "LAMPARA",
  "PERRO", "ESTRELLA", "ZORRO", "HURACAN", "NIDO", "JOVEN", "PESCADO", "QUILATE", "UTIL", "IGLU",
  "VOZ", "DIA", "NACION", "RUEDO", "ARBOL", "PAJARO", "MANGO", "XEROX", "QUESO", "VELA",
  "TULIPAN", "BARCO", "CASCADA", "YUPPIE", "AVION", "DENSO", "ELEFANTE", "FELIZ", "ISOTOPOS", "AGUILA",
  "OXIDO", "SABIO", "GOL", "LAZARO", "AMIGO", "TEMA", "ORO", "SUDOR", "BOLSA", "UNIVERSO",
  "PUNTO", "CAMA", "JAZZ", "GALAXIA", "JABON", "URUGUAY", "RUIDO", "DIA", "MASCARA", "NORTE",
  "FACIL", "ELEFANTE", "SABADO", "JARDIN", "MIRADA", "CABALLO", "SIMBOLO", "NACIMIENTO", "FILTRO", "VOZ",
  "QUESO", "RAPIDO", "HORMIGA", "VESTIDO", "ARBOL", "UNIVERSO", "TREN", "YIN", "VACA", "FIESTA",
  "IGLESIA", "RELOJ", "JOYERIA", "ZUMO", "OPERA", "ALAS", "KIOSCO", "JIRA", "NUBE", "RADIO",
  "BUZON", "TARDE", "ZEPPELIN", "VIRUS", "LAPIZ", "OVALO", "MOTIVO", "QUINTO", "CIRCULO", "DULCE",
  "ZOCALO", "DIRECCION", "APOYO", "GALLINA", "RUTA", "FARMACO", "ULCERA", "TIZA", "BARRIO", "GRANDE",
  "XILOFAGO", "LARGO", "WOK", "NINJA", "TABLA", "SENSO", "NACIMIENTO", "UNAS", "MUSICA", "INVIERNO",
  "NUCLEO", "BUZON", "SABIO", "FRESA", "CABALLO", "GATO", "IMAN", "TAREA", "PELOTA", "VELA",
  "RUGIR", "JUGO", "CAMINO", "QUINCEAÑERA", "LAZARO", "DIA", "TULIPAN", "WOMBAT", "CIEGA", "GEL",
  "MORADO", "UNICO", "YERBA", "NEVADO", "JUEZ", "BESO", "SILENCIO", "DUNA", "PESO", "VOZ",
  "PAGINA", "UNICO", "ORACION", "DRAGON", "PATO", "URUGUAY", "SUEÑO", "NOCHE", "WATER", "GOL",
  "JUGO", "JIRAFA", "VELA", "MANGO", "NOCHE", "SOPA", "BANDERA", "TIGRE", "YERNO", "QUIMICA",
  "TABLA", "ÑANDU", "ZEPPELIN", "CUERVO", "PUNTO", "LISO", "KANGURO", "RICO", "FOTO", "PARED",
  "GALAXIA", "VOZ", "SIMBOLO", "BUZON", "RUTA", "ZUMO", "MAR", "LAZARO", "DENSO", "NACIMIENTO",
  "ORGANO", "ARCO", "LAGO", "DIA", "FELIZ", "JUNTA", "GRIS", "PELOTA", "RIO", "BOLSA",
  "VESTIDO", "ÑANDU", "NUBE", "CABALLO", "VENTANA", "YOYO", "SENSO", "NEVADO", "CIELO", "VIRGEN",
  "QUESO", "MESA", "RUEDA", "WIFI", "CABALLO", "RUIDO", "JOVEN", "SILENCIO", "GRUTA", "HEROE",
  "TIEMPO", "VACA", "SOPA", "JIRAFA", "TAREA", "BESO", "HUMO", "QUEMAR", "LARGO", "PAJARO",
  "OXIDO", "AGUILA", "XENON", "GALLINA", "NIDO", "UTIL", "VOZ", "FRESA", "DIA", "BARCO",
  "RIO", "KILOMETRO", "HIELO", "ISLA", "QUESO", "JAZZ", "VINO", "LAMPARA", "TIGRE", "GRIS",
  "SOL", "CIELO", "BESO", "NUBE", "MIRADA", "YUPPIE", "CASCADA", "NACIMIENTO", "UNICO", "WATER",
  "LAZARO", "RAIZ", "TREN", "NACION", "XENFOBICO", "RUIDO", "DIA", "MORADO", "HIERBA", "YOLO",
  "VELA", "QUERER", "WIFI", "PESO", "GALAXIA", "JABON", "CAMINO", "OVALO", "HUMO", "BESO"];

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



