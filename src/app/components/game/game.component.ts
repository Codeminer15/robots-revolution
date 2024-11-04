import { ChangeDetectionStrategy, Component, ElementRef, Inject, Renderer2, ViewChild,  inject } from '@angular/core';
import { fadeAnimation, moveAnimation } from '../../animatios';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

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
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [fadeAnimation, moveAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  dialog = inject(MatDialog)

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

  openDialog() {
    const dialogRef = this.dialog.open(DialogCustom,{
      disableClose: true, //evita que se cierre al hacer clic fuera de él
      panelClass: 'my-class' 
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result) this.resetGame()
      else    this.router.navigate(["../home"])
        
    })
  }

  constructor(private renderer: Renderer2, private router: Router) { }

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

@Component({
  selector: 'app-dialog',
  standalone: true,
  styleUrl:"./game.component.scss",
  template:  `
  <mat-dialog-content>
    @if (statusGame) {
      <h2 mat-dialog-title>¡HAZ GANADO!</h2>
    }@else {
      <h2 mat-dialog-title>¡HAZ PERDIDO!</h2>
    }
    <mat-dialog-actions>
      <button mat-button mat-dialog-close (click)="dialogRef.close(false)">
        <mat-icon>home</mat-icon>
        Volver al inicio
      </button>
      <button mat-button mat-dialog-close (click)="dialogRef.close(true)">
        <mat-icon>reset</mat-icon>
        Nueva Partida
      </button>
    </mat-dialog-actions>
    <mat-dialog-content>
  `,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule,MatIconModule],
  
})
export class DialogCustom {
  dialogRef = inject(MatDialogRef<DialogCustom>);

  statusGame : boolean = true
}

