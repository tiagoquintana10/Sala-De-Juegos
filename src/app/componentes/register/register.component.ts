import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { createClient,User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';
import { CommonModule } from '@angular/common';

const supabase = createClient(environment.apiUrl,environment.publicAnonKey)

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule,RouterLink,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
mail: string;
password: string;
name: string = '';
age: number = 0;
avatarFile: File | null = null;

constructor(private router: Router) {
  this.mail = '';
  this.password = '';
}

//Variable para que no aparezcan los campos marcados en rojo desde un principio
submitted: boolean = false;
errorMsg: string = '';


isValidEmail(email: string): boolean {
  // Validación de email
  return /\S+@\S+\.\S+/.test(email);
}

register() {
  this.submitted = true;
  this.errorMsg = '';

  // Validación manual
  if (!this.isValidEmail(this.mail) ||
      this.password.length < 6 ||
      this.name.trim() === '' ||
      this.age <= 0 || this.age > 110 ||
      !this.avatarFile) {
    
    this.errorMsg = 'Ingrese los datos correctamente';      
    return;
  }

  supabase.auth.signUp({
    email: this.mail,
    password: this.password,
  }).then(({ data, error }) => {
    if (error) {
      if (error.message.includes('already registered')) {
        console.error('Error:', error.message);
        this.errorMsg = 'Este correo ya está registrado';
      } 
      else{
          console.error('Error:', error.message);
          this.errorMsg = 'Error al registrar';
      }
    } 
    else {

      console.log('User registered:', data.user);
      this.saveUserData(data.user!);
      
    }
  }
  );

}

saveUserData(user: User) {

  const avatarUrl = this.saveFile().then((data) => {
    if (data) { 

  supabase.from('users-data').insert([
    { authId: user.id, name: this.name, age: this.age, avatarUrl: data.path  }
  ]).then(({ data, error }) => {
    if (error) {
      console.error('Error:', error.message);
    } else {
      this.router.navigate(['home']);
    }
  });
}
});

}

async saveFile() {
const { data, error } = await supabase
  .storage
  .from('images')
  .upload(`users/${this.avatarFile?.name}`, this.avatarFile!, {
    cacheControl: '3600',
    upsert: false
  });

  return data;
}

onFileSelected(event: any) {
  this.avatarFile = event.target.files[0];
}
}
