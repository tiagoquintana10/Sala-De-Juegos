import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Personaje } from '../models/personajes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonajesRYMService {

  constructor(private http: HttpClient) { }

  private apiUrl ='https://rickandmortyapi.com/api/character';

  getPersonajes(): Observable<{ results: Personaje[] }> {
    return this.http.get<{ results: Personaje[] }>(this.apiUrl);
  }
}