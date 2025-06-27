import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-receptionistportal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './receptionistportal.component.html',
  styleUrls: ['./receptionistportal.component.scss']
})
export class ReceptionistportalComponent {
  showAddForm = false;
  showPatientTable = false;

  patients: Patient[] = [];
  newPatient: Partial<Patient> = {};
  editingPatient: Patient | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  openAddPatientForm() {
    this.showAddForm = true;
    this.showPatientTable = false;
  }

  openPatientTable() {
    this.showPatientTable = true;
    this.showAddForm = false;
    this.loadPatients();
  }

  loadPatients() {
    this.auth.getPatients().subscribe({
      next: (res) => {
        const result = res.showPatient?.[0];
        this.patients = result?.data || [];
        console.log('Loaded Patients:', this.patients);
      },
      error: (err) => console.error('Failed to load patients:', err),
    });
  }

  submitAddPatient() {
    this.auth.addPatient(this.newPatient).subscribe({
      next: (res) => {
        console.log('Patient added:', res);
        this.newPatient = {};
        this.loadPatients();
        this.showAddForm = false;
        this.showPatientTable = true;
      },
      error: (err) => console.error('Failed to add patient:', err),
    });
  }

  editPatient(patient: Patient) {
    debugger
    this.editingPatient = { ...patient };
    this.showPatientTable = true;
  }

  updatePatient() {
    debugger

    if (!this.editingPatient?._id) return;

    this.auth.updatePatient(this.editingPatient._id, this.editingPatient).subscribe({
      next: (res) => {
        console.log('Updated patient:', res);
        this.editingPatient = null;
        this.loadPatients();
        this.showPatientTable = true;
      },
      error: (err) => console.error('Failed to update patient:', err),
    });
  }

  cancelEdit() {
    this.editingPatient = null;
    this.showPatientTable = true;
  }

  cancelAdd() {
    this.newPatient = {};
    this.showAddForm = false;
  }
}

interface Patient {
  _id: string;
  name: string;
  email?: string;
  mobile: string;
  age?: number;
  gender?: string;
  address?: string;
  patientSymptoms?: string;
  visit?: string;
}
