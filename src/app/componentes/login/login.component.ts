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
    this.loadRegisteredEmails();
  } 
  
  submitted: boolean = false;
  incorrect: boolean = false;
  errorMsg : string = '';

  registeredEmails: string[] = [];
  filteredEmails: string[] = [];
  showSuggestions = false;

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

  loadRegisteredEmails() {
    supabase
      .from('users-data')
      .select('authId(id), authId:users(id,email)') 
      .then(({ data, error }) => {
        if (error) {
          console.error('Error cargando emails:', error.message);
          return;
        }
        this.registeredEmails = (data || [])
          .map((item: any) => item.authId?.email)
          .filter((email: string) => !!email);
      });
  }

  selectEmail(selectedEmail: string) {
    this.mail = selectedEmail;
    this.password = '';
  }
}

