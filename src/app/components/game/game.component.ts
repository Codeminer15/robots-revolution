import { Component, ElementRef, inject, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { fadeAnimation, moveAnimation } from '../../animatios';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GAME_STATE } from '../../types';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    MatTooltip,
    MatIconModule,
    MatDialogModule,
    RouterLink
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [fadeAnimation, moveAnimation]
})
export class GameComponent {
  readonly dialog = inject(MatDialog);
  readonly snackbar = inject(MatSnackBar);

  @ViewChild('capsuleDiv', { static: true }) capsuleDiv!: ElementRef;
  @ViewChild('leftContainer', { static: true }) leftContainer!: ElementRef
  @ViewChild('rightContainer', { static: true }) rightContainer!: ElementRef
  @ViewChild('lab1', { static: true }) lab1!: ElementRef
  @ViewChild('lab2', { static: true }) lab2!: ElementRef
  @ViewChild('finishDialog') finishDialog!: TemplateRef<any>;

  scientistAndRobotsLeft: string[] = ['robot', 'robot', 'robot', 'scientist', 'scientist', 'scientist'];
  scientistAndRobotsRight: string[] = [];

  capsule: string[] = [];
  capsuleDirection: boolean = true; // true == Left and false == Right

  isMoving: boolean = false;
  counter: number = 0;
  gameState: GAME_STATE = 'running';
  dialogConfig: Object = {
    disableClose: true,
    closeOnNavigation: true,
    enterAnimationDuration: '250ms',
    exitAnimationDuration: '200ms',
  }

  constructor(private renderer: Renderer2) { }

  defineLost() {
    const robotsLeft = this.scientistAndRobotsLeft
      .filter((item: string)=> item === 'robot').length;
    const robotsRight = this.scientistAndRobotsRight
      .filter((item: string)=> item === 'robot').length;
    const scientistLeft = this.scientistAndRobotsLeft
      .filter((item: string)=> item === 'scientist').length;
    const scientistRight = this.scientistAndRobotsRight
      .filter((item: string)=> item === 'scientist').length;

    switch (this.capsuleDirection) {
      case true:
        if (robotsLeft > scientistLeft && scientistLeft > 0) {
          //console.log('The laboratory 1\'s scientist are low!');
          this.gameState = 'wasted';
          this.scientistAndRobotsLeft = this.scientistAndRobotsLeft
            .map((item: string)=> item === 'scientist' ? 'blood' : item);
          this.scientistAndRobotsRight = this.scientistAndRobotsRight
            .map((item: string)=> item === 'scientist' ? 'blood' : item);
          this.capsule = this.capsule
            .map((item: string)=> item === 'scientist' ? 'blood' : item);
          this.dialog.open(this.finishDialog, this.dialogConfig);
        }
        break;
      case false:
        if (robotsRight > scientistRight && scientistRight > 0) {
          //console.log('The laboratory 2\'s scientist are low!');
          this.gameState = 'wasted';
          this.scientistAndRobotsRight = this.scientistAndRobotsRight
            .map((item: string)=> item === 'scientist' ? 'blood' : item);
          this.scientistAndRobotsLeft = this.scientistAndRobotsLeft
            .map((item: string)=> item === 'scientist' ? 'blood' : item);
          this.capsule = this.capsule
            .map((item: string)=> item === 'scientist' ? 'blood' : item);
          this.dialog.open(this.finishDialog, this.dialogConfig);
        }
        break;
    }
  }

  defineWon() {
    if (this.scientistAndRobotsRight.length === 6
      && this.scientistAndRobotsLeft.length === 0
      && this.capsule.length === 0) {
      this.gameState = 'won';
      this.dialog.open(this.finishDialog,
        {
          disableClose: true,
          closeOnNavigation: true,
          enterAnimationDuration: '250ms',
          exitAnimationDuration: '200ms',
        }
      );
    }
  }

  dropLeft(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (this.capsuleDirection) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.container.data.length != 2) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      this.snackbar.open('¡Capacidad máxima de la cápsula alcanzada!', 'Aceptar', { duration: 1500 })
    }
  }

  dropRight(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (!this.capsuleDirection) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.defineWon();
  }

  moveTo() {
    if (this.capsule.length < 1) {
      this.snackbar.open('La cápsula no puede dirigirse hacia el otro laboratorio sin tripulantes.',
        'Aceptar', { duration: 2000 });
      return;
    }

    this.isMoving = true;

    const div = this.capsuleDiv.nativeElement;
    const target = (this.capsuleDirection) ? this.rightContainer.nativeElement : this.leftContainer.nativeElement;
    //const targetLab = (this.capsuleDirection) ? this.lab2.nativeElement : this.lab1.nativeElement;
    //const previousLab = (this.capsuleDirection) ? this.lab1.nativeElement : this.lab2.nativeElement;
    const animationClass = (this.capsuleDirection) ? 'move-to-right' : 'move-to-left';

    this.counter++;
    this.renderer.addClass(div, animationClass);
    setTimeout(() => {
      this.renderer.appendChild(target, div);
      this.renderer.removeClass(div, animationClass);
      this.capsuleDirection = !this.capsuleDirection;
      this.isMoving = false;
      //this.renderer.addClass(previousLab, 'inactive');
      //this.renderer.removeClass(targetLab, 'inactive');
      }, 500);
    this.defineLost();
  }

  resetGame() {
    const div = this.capsuleDiv.nativeElement;
    const target = this.leftContainer.nativeElement;

    this.renderer.appendChild(target, div);

    this.scientistAndRobotsLeft = ['robot', 'robot', 'robot', 'scientist', 'scientist', 'scientist'];
    this.scientistAndRobotsRight = [];
    this.capsule = [];
    this.capsuleDirection = true;
    this.isMoving = false;
    this.counter = 0;
    this.gameState = 'running';
  }
}
