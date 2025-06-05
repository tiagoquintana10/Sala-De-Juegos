import { Component, OnInit } from '@angular/core';
import { UserData } from '../../models/user-data';
import { environment } from '../../../environments/environment.prod';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { JuegosModule } from "../../juegos/juegos.module";
import { filter } from 'rxjs';


const supabase = createClient(environment.apiUrl,environment.publicAnonKey)

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [FormsModule, CommonModule, JuegosModule,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  rutaActual: string = '';

  constructor(private router : Router){}

  navigateToChat() {
    this.router.navigate(['/home/chat']);
  }

  navigateTologin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  mostrarBotonHome(): boolean {
    return this.rutaActual !== '/home'&& this.rutaActual !== '/home/juegos';
  }

  
  usersdata: UserData  | null = null;

  ngOnInit(): void {
    this.rutaActual = this.router.url;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.rutaActual = event.url;
    });

    this.getUserData();
  }

  getUserData(){
    supabase.auth.getUser().then(({data,error}) => {
      if(error){
        console.error('Error:',error.message);
        return;
      }        
      const userId = data.user.id;
      supabase.from('users-data').select('*').eq('authId',userId).single().then(({data,error}) => {
        
      if(error){
        console.error('Error al obtener usuario:', error.message);
        return;
      }  
      console.log('Data:',data);
      this.usersdata = data; 
      })
      
    });
  }

  getAvatarUrl(avatarUrl: string) {
    return supabase.storage.from('images').getPublicUrl(avatarUrl).data.publicUrl;
  }

  logout(){
    supabase.auth.signOut();
    this.router.navigate(['/login']);
  }
 
  mostrarDatos(): boolean {
    const url = this.router.url;
    return url === '/home' || url === '/home/juegos';
  }
}
