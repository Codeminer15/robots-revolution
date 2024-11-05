import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    MatTooltip,
    MatIconModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [fadeAnimation, moveAnimation]
})
export class GameComponent {
  @ViewChild('capsuleDiv', { static: true }) capsuleDiv!: ElementRef;
  @ViewChild('leftContainer', { static: true }) leftContainer!: ElementRef
  @ViewChild('rightContainer', { static: true }) rightContainer!: ElementRef
  @ViewChild('lab1', { static: true }) lab1!: ElementRef
  @ViewChild('lab2', { static: true }) lab2!: ElementRef

  scientistAndRobotsLeft: string[] = ['robot', 'robot', 'robot', 'scientist', 'scientist', 'scientist'];
  scientistAndRobotsRight: string[] = [];

  capsule: string[] = [];
  capsuleDirection: boolean = true; // true == Right and false == Left

  isMoving: boolean = false;
  counter: number = 0;

  constructor(private renderer: Renderer2) { }

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
  }

  moveTo() {
    if (this.capsule.length < 1) return;

    this.isMoving = true;

    const div = this.capsuleDiv.nativeElement;
    const target = (this.capsuleDirection) ? this.rightContainer.nativeElement : this.leftContainer.nativeElement;
    //const targetLab = (this.capsuleDirection) ? this.lab2.nativeElement : this.lab1.nativeElement;
    //const previousLab = (this.capsuleDirection) ? this.lab1.nativeElement : this.lab2.nativeElement;
    const animationClass = (this.capsuleDirection) ? 'move-to-right' : 'move-to-left';

    this.renderer.addClass(div, animationClass);
    setTimeout(() => {
      this.renderer.appendChild(target, div);
      this.renderer.removeClass(div, animationClass);
      this.capsuleDirection = !this.capsuleDirection;
      this.isMoving = false;
      this.counter++;
      //this.renderer.addClass(previousLab, 'inactive');
      //this.renderer.removeClass(targetLab, 'inactive');
      }, 500);
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
  }
}
