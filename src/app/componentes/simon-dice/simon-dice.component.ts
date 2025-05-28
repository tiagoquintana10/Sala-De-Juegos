import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Component({
  selector: 'app-simon-dice',
  standalone: false,
  templateUrl: './simon-dice.component.html',
  styleUrl: './simon-dice.component.scss'
})
export class SimonDiceComponent {

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
