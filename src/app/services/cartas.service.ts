import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cartas } from '../models/cartas';

@Injectable({
  providedIn: 'root'
})
export class CartasService {

  private deckId: string = '';

  constructor(private http: HttpClient) { }

  crearMazo(){
    return this.http.get<{deck_id: string; remaining: number }>('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
  }

  setDeckId(id: string) {
    this.deckId = id;
  }

  getDeckId(): string {
    return this.deckId;
  }

  sacarCarta(){
    return this.http.get<{ cards: Cartas[]; remaining: number }>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`);    
  }
}
