
import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmbox',
  imports: [MatButtonModule, MatDialogModule, MatDialogContent],
  templateUrl: './confirmbox.component.html',
  styleUrl: './confirmbox.component.scss'
})
export class ConfirmboxComponent {
  constructor( public dialogRef: MatDialogRef<ConfirmboxComponent>,) {}
  save(){
    this.dialogRef.close(true);
  }
  close() {
    this.dialogRef.close(false);
  }

}
