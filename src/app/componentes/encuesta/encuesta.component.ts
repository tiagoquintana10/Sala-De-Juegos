import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.prod';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

const supabase = createClient(environment.apiUrl,environment.publicAnonKey)

@Component({
  selector: 'app-encuesta',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})
export class EncuestaComponent implements OnInit{

  usuarioId: string ='';
  usuarioNombre: string ='';


  form!: FormGroup;
  enviado = false;

  constructor(private router: Router){}

  ngOnInit(): void {
    this.form = new FormGroup({
      nombreApellido: new FormControl('', Validators.required),
      edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(99)]),
      telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]),
      experiencia: new FormControl('', Validators.required),
      juegoGusto: new FormControl('', Validators.required),
      juegosIncorporar: new FormArray([], Validators.required)
    });

    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        this.router.navigate(['/login']);
      }else{  
        this.usuarioId = user.id;
        supabase.from('users-data').select('name').eq('authId',this.usuarioId).single()
        .then(({data,error}) => {
          this.usuarioNombre = data?.name || 'Desconocido';
        })        
      }
    });
  }

  
  get nombreApellido() { return this.form.get('nombreApellido'); }
  get edad() { return this.form.get('edad'); }
  get telefono() { return this.form.get('telefono'); }
  get experiencia() { return this.form.get('experiencia'); }
  get juegoGusto() { return this.form.get('juegoGusto'); }
  get juegosIncorporar() { return this.form.get('juegosIncorporar') as FormArray; }

  // Maneja los cambios de estado en los checkbox
  CheckboxChange(e: any) {
    const checkArray = this.juegosIncorporar;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      const index = checkArray.controls.findIndex(ctrl => ctrl.value === e.target.value);
      if (index >= 0) checkArray.removeAt(index);
    }
  }

enviarForm() {
  this.enviado = true;
  if (this.form.valid) {
    const formValue = this.form.value;

    supabase.from('encuestas').insert([{
      user_id: this.usuarioId,
      name: formValue.nombreApellido,
      age: formValue.edad,
      telefono: formValue.telefono,
      experiencia: formValue.experiencia,
      juego_gusto: formValue.juegoGusto,
      juegos_incorporar: formValue.juegosIncorporar,
      fecha: new Date().toISOString()
    }]).then(({ error }) => {
      if (error) {
        console.error('Error al guardar la encuesta:', error.message);
      } else {
        console.log('Encuesta guardada con éxito.');
      }
    });

    this.juegosIncorporar.clear();
    this.form.reset();
    this.enviado = false;
    this.navigateToHome();
  }
}


  navigateToHome() {
    this.router.navigate(['/home']);
  }  

}