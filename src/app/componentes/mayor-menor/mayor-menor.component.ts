import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent {

  constructor(private router: Router) {}

  ngOnInit(): void {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        this.router.navigate(['/login']);
      }else{
        
      }
    });
  }
}
