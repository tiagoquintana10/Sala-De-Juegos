import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { ErrorComponent } from './componentes/error/error.component';
import { Component } from '@angular/core';
import { RegisterComponent } from './componentes/register/register.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';
import { ChatComponent } from './componentes/chat/chat.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {
                path: '',
                redirectTo: 'juegos',
                pathMatch: 'full' // ⬅️ redirige /home → /home/juegos
            },
            {
                path: 'juegos',  // Aquí cargamos el módulo de juegos
                loadChildren: () => import('./juegos/juegos.module').then(m => m.JuegosModule),
            },
            {
                path: 'chat',
                component: ChatComponent,
            },
            {
                path: 'quien-soy',
                component: QuienSoyComponent,
            },
    ],
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: '**',
        component: ErrorComponent,
    }
];
