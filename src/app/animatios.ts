import { trigger, transition, style, animate } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    style({ opacity: 0 }),
    animate('0.5s', style({ opacity: 1 }))
  ]),
]);

export const moveAnimation = trigger('moveAnimation', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('0.5s ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  ]),
]);
