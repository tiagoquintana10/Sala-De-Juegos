import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';
import { Message } from '../../models/messages';


const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

type MessageWithName = Message & { name: string };


interface UsersData {
    authId: string;
    name: string;
} 

@Component({
  selector: 'app-chat',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: MessageWithName[] = [];

  usersData: UsersData[] = [];
  newMessage: string = '';
  currentUserId: string | null = null;
  currentUserEmail: string | null = null;

  

  constructor(private router: Router) {}

  ngOnInit() {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        this.router.navigate(['/login']);
        return;
      }

      this.currentUserId = user.id;
      this.currentUserEmail = user.email ?? null;

    
      this.loadUsersData().then(() => {
        
        console.log('Usuarios en users_data:', this.usersData);
        this.loadMessages();
  
        supabase
          .channel('public:messages')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages' },
            (payload) => {
              
              const newMsg = payload.new as Message;

              
              const name = this.getUserName(newMsg.user_id);
              const messageWithName: MessageWithName = {
                ...newMsg,
                name
              };
              this.messages = [...this.messages, messageWithName];
            }
          )
          .subscribe();
      });
    });
  }

  loadMessages() {
    supabase
      .from('messages')
      .select('id, user_id, content, created_at')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
      if (!error && data) {
        console.log('messages:', data); // 🧪
        this.messages = data.map(msg => {
          const name = this.getUserName(msg.user_id);
          console.log(`user_id: ${msg.user_id}, name: ${name}`); // 🧪
          return {
            ...msg,
            name  
          };
        });
      }
    });
}

getUserName(userId: string): string {
  const user = this.usersData.find(u => String(u.authId) === String(userId));
  console.log('Buscando nombre para:', userId, 'Resultado:', user);
  return user ? user.name : 'Desconocido';
}

  loadUsersData() {
  return supabase
    .from('users-data')
    .select('authId, name')
    .then(({ data, error }) => {
      if (!error && data) {
        this.usersData = data;
        console.log('UsersData cargado:', this.usersData);
      } else {
          console.log('Error al cargar users-Data:',error);
        }
    });
}

  sendMessage() {
    if (!this.newMessage.trim()) return;

    supabase
      .from('messages')
      .insert({
        user_id: this.currentUserId,
        content: this.newMessage
      })
      .then(({ error }) => {
        if (error) {
          console.error('Error enviando mensaje:', error);
        } else {
          this.newMessage = '';
        }
      });
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(date));
  }

  isMyMessage(msg: Message): boolean {
    return msg.user_id === this.currentUserId;
  }
}