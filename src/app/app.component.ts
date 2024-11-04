import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { fadeAnimation } from './animatios';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    NgClass,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fadeAnimation]
})
export class AppComponent {
  title = 'Robots Revolution';
  audio = new Audio("/audio/stranger-things.mp3");

  // OnInit(){
  //   this.audio.play().catch(error =>{
  //     console.warn("El navegador no permite la reproducción automatica");
  //   });
  // }
  toggleAudio(){
    if(this.audio.paused){
      this.audio.play()
    } else {
      this.audio.pause()
    }
  }
}
