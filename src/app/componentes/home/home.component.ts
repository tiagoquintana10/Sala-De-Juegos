import { Component, OnInit } from '@angular/core';
import { UserData } from '../../models/user-data';
import { environment } from '../../../environments/environment.prod';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { JuegosModule } from "../../juegos/juegos.module";


const supabase = createClient(environment.apiUrl,environment.publicAnonKey)

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [FormsModule, CommonModule, JuegosModule,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {


  constructor(private router : Router){

  } 
  usersdata: UserData  | null = null;

  ngOnInit(): void {
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
