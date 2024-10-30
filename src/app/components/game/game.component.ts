import { Component } from '@angular/core';
import { fadeAnimation } from '../../animatios';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [fadeAnimation]
})
export class GameComponent {

}
