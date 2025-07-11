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
interface Patient {
  _id: string;
  name: string;
  email?: string;
  mobile: string
  age?: number;
  gender?: string;
  address?: string;
  patientSymptoms?: string;
  visit?: string;
}
@Component({
  selector: 'app-receptionistportal',
  standalone: true,
  templateUrl: './receptionistportal.component.html',
  styleUrls: ['./receptionistportal.component.scss'],
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
    MatSelectModule,
  ]
})
export class ReceptionistportalComponent {
  showAddForm = false;
  showPatientTable = false;
  showBookingTable = false;
  showDoctorList = false;
  showAppointmentTable = false;

  patients: Patient[] = [];
  doctors: any[] = [];
  appointments: any[] = [];

  newPatient: Partial<Patient> = {};
  editingPatient: Patient | null = null;
  editingAppointment: any = null;

  selectedPatientForBooking: Patient | null = null;
  selectedDoctor: any = null;
  bookingDate: string = '';
  bookingTime: string = '';

  constructor(private auth: AuthService, private router: Router) { }

  resetViews() {
    this.showAddForm = false;
    this.showPatientTable = false;
    this.showBookingTable = false;
    this.showDoctorList = false;
    this. showAppointmentTable = false;
    this.editingPatient = null;
    this.selectedPatientForBooking = null;
    this.selectedDoctor = null;
    this.bookingDate = '';
    this.bookingTime = '';
  }

  openAddPatientForm() {
    this.resetViews();
    this.showAddForm = true;
  }

  openPatientTable() {
    this.resetViews();
    this.showPatientTable = true;
    this.loadPatients();
  }

  openBookAppointment() {
    this.resetViews();
    this.showBookingTable = true;
    this.showAppointmentTable = false;
    this.loadPatients();
  }

  openViewAppointments() {
    this.resetViews();
    this.showAppointmentTable = true;
    this.loadAppointments();
    this.loadPatients();
    this.loadActiveDoctors();
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
        this.openPatientTable();
      },
      error: (err) => console.error('Failed to add patient:', err),
    });
  }

  cancelAdd() {
    this.newPatient = {};
    this.showAddForm = false;
  }

  editPatient(patient: Patient) {
    this.editingPatient = { ...patient };
    this.showPatientTable = true;
  }

  updatePatient() {
    if (!this.editingPatient?._id) return;
    this.auth.updatePatient(this.editingPatient._id, this.editingPatient).subscribe({
      next: (res) => {
        console.log('Updated patient:', res);
        this.editingPatient = null;
        this.loadPatients();
      },
      error: (err) => console.error('Failed to update patient:', err),
    });
  }

  cancelEdit() {
    this.editingPatient = null;
  }

  selectPatient(patient: Patient) {
    this.selectedPatientForBooking = patient;
    this.selectedDoctor = null;
    this.bookingDate = '';
    this.bookingTime = '';
    this.showDoctorList = false;
    this.loadActiveDoctors();
  }

  loadActiveDoctors() {
    this.auth.getDoctors().subscribe({
      next: (res: any) => {
        console.log('Doctors API Response:', res);
        let doctorArray: any[] = [];
        if (res?.showDoctor?.[0]?.data) {
          doctorArray = res.showDoctor[0].data;
        } else if (Array.isArray(res?.showDoctor)) {
          doctorArray = res.showDoctor;
        } else if (Array.isArray(res)) {
          doctorArray = res;
        }
        console.log('Extracted Doctors:', doctorArray);

        if (doctorArray) {
          this.doctors = doctorArray.filter((d: any) =>
            (d.status || d.workStatus || '').toLowerCase() === 'active');
          this.showDoctorList = true;
          console.log('Filtered Active Doctors:', this.doctors);
        } else {
          this.doctors = [];
          console.warn('Doctor list not in expected format');
        }
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
        this.doctors = [];
      }
    });
  }

  selectDoctor(doctor: any) {
    this.selectedDoctor = doctor;
  }

  confirmBooking() {
    if (!this.selectedPatientForBooking || !this.selectedDoctor || !this.bookingDate || !this.bookingTime) {
      alert('Please fill in all details.');
      return;
    }

    const appointment = {
      patientId: this.selectedPatientForBooking._id,
      doctorId: this.selectedDoctor._id,
      date: this.bookingDate,
      time: this.bookingTime,
    };

    this.auth.createAppointment(appointment).subscribe({
      next: (res) => {
        alert('Appointment Booked!');
        this.showDoctorList = false;
        this.selectedDoctor = null;
        this.selectedPatientForBooking = null;
        this.bookingDate = '';
        this.bookingTime = '';
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Booking failed:', err);
        alert('Booking failed: ' + err.error?.message || 'Unknown error');
      }
    });
  }

  loadAppointments() {
    this.auth.getAppointments().subscribe({
      next: (res: any) => {
        this.appointments = res.data || [];
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
