import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';
import { Router,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

const supabase = createClient(environment.apiUrl,environment.publicAnonKey)

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule,RouterLink,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  mail: string = "";
  password: string = "";

  constructor(private router : Router){

  } 
  
  submitted: boolean = false;
  incorrect: boolean = false;
  errorMsg : string = '';

  login(){
    this.submitted = true;
    this.errorMsg = '';
    
    if(this.mail.length == 0 ||
      this.password.length == 0)
    {
      this.errorMsg = 'Credenciales incorrectas';  
      return;
    }
    supabase.auth.signInWithPassword({
      email: this.mail,
      password: this.password,
    }).then(({data, error}) => {
      if(error){
        this.incorrect = true;
        this.errorMsg = 'Credenciales incorrectas';  
        console.error('Error:', error.message);
      }else{
        this.router.navigate(['home']);
      }
    });

  }
}

