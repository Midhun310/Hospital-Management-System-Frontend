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

// Interfaces
interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  email: string;
  password: string;
  mobile: string;
  department?: string;
  role?: string;
  shift?: string;
  workStatus?: string;
}

interface Receptionist {
  _id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  status: string;
  shift: string;
}

interface Patient {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  age?: number;
  gender?: string;
  address?: string;
  patientSymptoms?: string;
  visit?: string;
}
@Component({
  selector: 'app-adminportal',
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
  templateUrl: './adminportal.component.html',
  styleUrls: ['./adminportal.component.scss']
})
export class AdminportalComponent {
  // Doctor properties
  doctors: Doctor[] = [];
  displayedColumns: string[] = ['sno', 'name', 'email', 'mobile', 'department', 'role', 'shift', 'workStatus', 'actions'];
  showDoctorTable = false;
  editingDoctor: Doctor | null = null;
  newDoctor: Partial<Doctor> = {};

  // Receptionist properties
  receptionists: Receptionist[] = [];
  receptionistColumns: string[] = ['sno', 'name', 'email', 'mobile', 'status', 'shift', 'actions'];
  showReceptionistTable = false;
  newReceptionist: Partial<Receptionist> = {};
  editingReceptionist: Receptionist | null = null;

  // Patient properties
  patients: Patient[] = [];
  patientColumns: string[] = ['sno', 'name', 'mobile', 'age', 'gender', 'patient symptoms', 'visit', 'actions'];
  newPatient: Partial<Patient> = {};
  showPatientTable = false;
  editingPatient: Patient | null = null;

  //appointment property
  appointments: any[] = [];
  showAppointmentTable: boolean = false;
  editingAppointment: any = null;
 
  // Common UI flags
  showAddForm = false;
  constructor(private auth: AuthService, private router: Router) { }

  // Doctor Methods
  loadDoctors() {
    this.auth.getDoctors().subscribe({
      next: (res) => {
        const result = res.showDoctor?.[0];
        this.doctors = result?.data || [];
        this.showDoctorTable = true;
        this.showReceptionistTable = false;
        this.showPatientTable = false;
        this.showAppointmentTable = false;
        console.log('Loaded Doctors:', this.doctors);
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
      }
    });
  }

  editDoctor(doctor: Doctor) {
    this.editingDoctor = { ...doctor };
  }

  cancelEdit() {
    this.editingDoctor = null;
  }

  addDoctor() {
    this.auth.addDoctor(this.newDoctor.email!, this.newDoctor as Doctor).subscribe({
      next: (res: any) => {
        console.log('Doctor added:', res);
        this.loadDoctors();
        this.showAddForm = false;
        this.newDoctor = {};
        this.editingDoctor = null;
      },
      error: (err: any) => {
        console.error('Failed to add doctor:', err);
      }
    });
  }

  updateDoctor() {
    if (!this.editingDoctor || !this.editingDoctor._id) return;
    console.log('Submitting doctor data:', this.editingDoctor);
    this.auth.updateDoctor(this.editingDoctor._id, this.editingDoctor).subscribe({
      next: (res) => {
        console.log('Update Success:', res);
        this.loadDoctors();
        this.editingDoctor = null;
      },
      error: (err) => {
        console.error('Update Failed:', err);
      }
    });
  }

  deleteDoctor(id: string) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.auth.deleteDoctor(id).subscribe({
        next: (res) => {
          console.log('Doctor deleted:', res);
          this.loadDoctors();
        },
        error: (err) => {
          console.error('Delete failed:', err);
        }
      });
    }
  }

  // Receptionist Methods
  loadReceptionists() {
    this.auth.getReceptionists().subscribe({
      next: (res: { getReception: any[] }) => {
        const result = res.getReception?.[0];
        this.receptionists = result?.data || [];
        this.showReceptionistTable = true;
        this.showDoctorTable = false;
        this.showPatientTable = false;
        this.showAppointmentTable = false;
        this.editingDoctor = null;
        console.log('Loaded Receptionists:', this.receptionists);
      },
      error: (err) => {
        console.error('Failed to load receptionists:', err);
      }
    });
  }

  updateReceptionist() {
    if (!this.editingReceptionist || !this.editingReceptionist._id) return;
    console.log('Submitting receptionist data:', this.editingReceptionist);
    this.auth.updateReceptionist(this.editingReceptionist._id!, this.editingReceptionist).subscribe({
      next: (res: any) => {
        console.log('Update Success:', res);
        this.loadReceptionists();
        this.editingReceptionist = null;
      },
      error: (err: any) => {
        console.error('Update Failed:', err);
      }
    });
  }

  addReceptionist() {
    this.auth.addReceptionist(this.newReceptionist.email!, this.newReceptionist as Receptionist).subscribe({
      next: (res: any) => {
        console.log('Receptionist added:', res);
        this.loadReceptionists();
        this.showAddForm = false;
        this.newReceptionist = {};
      },
      error: (err: any) => {
        console.error('Failed to add receptionist:', err);
      }
    });
  }

  editReceptionist(receptionist: Receptionist) {
    this.editingReceptionist = { ...receptionist };
  }

   cancelEditreceptionist() {
    this.editingReceptionist = null;
  }

  deleteReceptionist(id: string) {
    if (confirm('Are you sure you want to delete this receptionist?')) {
      this.auth.deleteReceptionist(id).subscribe({
        next: (res) => {
          console.log('Receptionist deleted:', res);
          this.loadReceptionists();
        },
        error: (err) => {
          console.error('Delete failed:', err);
        }
      });
    }
  }

  loadPatients(showTable: boolean = true) {
    this.auth.getPatients().subscribe({
      next: (res) => {
        const result = res.showPatient?.[0];
        this.patients = result?.data || [];
        if(showTable){
        this.showPatientTable = true;
        this.showDoctorTable = false;
        this.showReceptionistTable = false;
        this.showAppointmentTable = false;
        this.editingDoctor = null;
        }
        console.log('Loaded Patients:', this.patients);
      },
      error: (err) => {
        console.error('Failed to load patients:', err);
        this.patients = [];
      }
    });
  }

  addPatient() {
    this.auth.addPatient(this.newPatient).subscribe({
      next: (res: any) => {
        console.log('Patient added:', res);
        this.loadPatients();
        this.showAddForm = false;
        this.newPatient = {};
      },
      error: (err: any) => {
        console.error('Failed to add patient:', err);
      }
    });
  }

  updatePatient() {
    if (!this.editingPatient || !this.editingPatient._id) return;
    console.log('Submitting patient data:', this.editingPatient);
    this.auth.updatePatient(this.editingPatient._id!, this.editingPatient).subscribe({
      next: (res: any) => {
        console.log('Update Success:', res);
        this.loadPatients();
        this.editingPatient = null;
      },
      error: (err: any) => {
        console.error('Update Failed:', err);
      }
    });
  }

  editPatient(patient: Patient) {
    this.editingPatient = { ...patient };
  }

  cancelEditPatient() {
    this.editingPatient = null;
  }

  // appointments model
  resetViews() {
    this.showDoctorTable = false;
    this.showReceptionistTable = false;
    this.showPatientTable = false;
    this.showAppointmentTable = true;
    this.editingDoctor = null;
    this.editingReceptionist = null;
    this.editingPatient = null;
    this.editingAppointment = null;
    this.showAddForm = false;
  }

  openViewAppointments() {
    this.resetViews();
    this.showAppointmentTable = true;
    this.loadAppointments();
    this.loadPatients(false);
    this.loadActiveDoctors();
  }

  loadActiveDoctors() {
    this.auth.getDoctors().subscribe({
      next: (res: any) => {
        const doctorsArray = res?.showDoctor?.[0]?.data || [];
        this.doctors = doctorsArray.filter((doc: any) =>
          (doc.workStatus || '').toLowerCase() === 'active'
        );
        console.log('Loaded Active Doctors:', this.doctors);
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
        this.doctors = [];
      }
    });
  }

loadAppointments() {
    this.auth.getAppointments().subscribe({
      next: (res: any) => {
        this.appointments = res.data || [];
        this.showAppointmentTable=true;
        console.log('Loaded Appointments:', this.appointments);
      },
      error: (err) => {
        console.error('Failed to load appointments:', err);
        this.appointments = [];
      }
    });
  }

  formatDateForInput(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  editAppointment(appointment: any) {
    this.editingAppointment = {
      _id: appointment._id,
      patientId: appointment.patient?._id || appointment.patientId,
      doctorId: appointment.doctor?._id || appointment.doctorId,
      date:  this.formatDateForInput(appointment.appointment?.date || appointment.date),
      time: appointment.appointment?.time || appointment.time,
      status: appointment.appointment?.status || 'scheduled'
    };
  }

    cancelEditappointment() {
    this.editingAppointment = null;
  }

  updateAppointment() {
    if (!this.editingAppointment?._id) return;
    const updatedData = {
      appointmentId: this.editingAppointment._id,
      doctorId: this.editingAppointment.doctorId,
      patientId: this.editingAppointment.patientId,
      date: this.editingAppointment.date,
      time: this.editingAppointment.time,
      status: this.editingAppointment.status || 'scheduled'
    };

    this.auth.updateAppointment(updatedData).subscribe({
      next: (res) => {
        alert('Appointment updated');
        this.editingAppointment = null;
        this.loadAppointments();
      },
      error: (err) => console.error('Failed to update appointment:', err)
    });
  }
}
