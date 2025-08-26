import { Component, TemplateRef, ViewChild,OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogContent } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';

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
  report?: string;
}

interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status?: string;
}

interface Doctor {
  _id: string;
  name: string;
  email?: string;
  mobile?: string;
  specialization?: string;
  status?: string;
  workStatus?: string;
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
    MatDatepickerModule,
    MatPaginator,
    MatPaginatorModule
    ],
     providers: [provideNativeDateAdapter()],

})
export class ReceptionistportalComponent implements OnInit {
  showAddForm = false;
  showPatientTable = false;
  showBookingTable = false;
  showDoctorList = false;
  showAppointmentTable = false;

  // patient
  patients: Patient[] = [];
  patientDataSource = new MatTableDataSource<Patient>([]);
  @ViewChild(MatPaginator) patientPaginator!: MatPaginator;
  patientPage = 0;
  patientLimit = 10;
  totalPatientCount = 0;

  //doctor
  doctors: any[] = [];
  dataSource = new MatTableDataSource<Doctor>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  page = 0;
  sort = 0;
  limit = 10;
  totalDoctorCount = 0;

  //appointment
  appointments: any[] = [];
  appointmentsDataSource = new MatTableDataSource<Appointment>([]);
    @ViewChild(MatPaginator) appointmentsPaginator!: MatPaginator;
  
    appointmentsPage = 0;
    appointmentsLimit = 10;
    totalAppointmentsCount = 0;

  newPatient: Partial<Patient> = {};
  editingPatient: Patient | null = null;
  editingAppointment: any = {};

  selectedPatientForBooking: Patient | null = null;
  selectedDoctor: any = null;
  isTable:boolean = false;
  isTable1:boolean = false;
  bookingDate: string = '';
  bookingTime: string = '';

  uploadingPatientId: string | null = null;
  selectedReportFile: File | null = null;
  r: any;
  appointment: any = {};

  constructor(private auth: AuthService, private router: Router, private http: HttpClient, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  resetViews() {
    this.showAddForm = false;
    this.showPatientTable = false;
    this.showBookingTable = false;
    this.showDoctorList = false;
    this.showAppointmentTable = false;
    this.editingPatient = null;
    this.selectedPatientForBooking = null;
    this.selectedDoctor = null;
    this.bookingDate = '';
    this.bookingTime = '';
  }

  openPatientTable() {
    this.resetViews();
    this.showPatientTable = true;
    this.loadPatients();
  }

  openBookAppointment() {
    this.resetViews();
    this.showBookingTable = true;
    this.loadPatients();
  }

  openViewAppointments() {
    this.resetViews();
    this.showAppointmentTable = true;
    this.loadAppointments();
    this.loadPatients();
    this.loadActiveDoctors();
  }

   ngOnInit(): void {
  }


  // Logout method
  logout() {
    this.auth.setDoctorId('');
    localStorage.removeItem('doctorId');
    this.router.navigate(['/login']);
    localStorage.clear();

  }

  // patient model
  loadPatients() {
       const params = {
    skip: this.patientPage * this.patientLimit,
    limit: this.patientLimit
  };
    this.auth.getPatients(params).subscribe({
      next: (res) => {
        const result = res.showPatient?.[0];
        this.patients = result?.data || [];
        this.totalPatientCount = result?.count?.[0]?.['total count'] || 0;
        this.patientDataSource.data = this.patients;
        this.dialog.closeAll()
      },
      error: (err) => console.error('Failed to load patients:', err),
    });
  }

   onPagePatientChange(event: PageEvent) {
    this.patientPage = event.pageIndex;
    this.patientLimit = event.pageSize;
    this.loadPatients();
  }

  addPatient() {
    this.auth.addPatient(this.newPatient).subscribe({
      next: () => {
        this.loadPatients();
        this.showAddForm = false;
        this.newPatient = {};
        this.snackBar.open('Added successfully!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['login-success-snackbar']
          });
      },
      error: (err) => console.error('Failed to add patient:', err)
    });
  }

 openAddPatientForm(addpatientRef: TemplateRef<any>) {
    this.dialog.open(addpatientRef, {
      height: '500px',
      width: '600px'
    })
  }

  cancel() {
    this.dialog.closeAll()
  }

  editPatient(patient: Patient, editpatientRef: TemplateRef<any>) {
    this.editingPatient = { ...patient };
    this.dialog.open(editpatientRef, {
      height: '500px',
      width: '600px'
    })
  }

  updatePatient() {
    if (!this.editingPatient?._id) return;
    this.auth.updatePatient(this.editingPatient._id, this.editingPatient).subscribe({
      next: () => {
        this.editingPatient = null;
        this.loadPatients();
        this.dialog.closeAll();
          this.snackBar.open('Edited successfully!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['login-success-snackbar']
          });
      },
      error: (err) => console.error('Failed to update patient:', err),
    });
  }

  cancelEdit() {
    this.dialog.closeAll();
  }

  toggleUploadForm(patientId: string) {
    this.uploadingPatientId = this.uploadingPatientId === patientId ? null : patientId;
  }

  onReportFileChange(event: any) {
    this.selectedReportFile = event.target.files[0] || null;
  }

  uploadReport(patientId: string) {
    if (!this.selectedReportFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('report', this.selectedReportFile);

    this.auth.uploadPatientReport(patientId, formData).subscribe({
      next: () => {
        // alert("Report uploaded successfully.");
          this.snackBar.open('Uploaded successfully!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['login-success-snackbar']
          });
        this.selectedReportFile = null;
        this.uploadingPatientId = null;
        this.loadPatients();
      },
      error: (err) => {
        console.error("Upload failed:", err);
        alert("Upload failed");
      }
    });
  }

  download(fileUrl: string | undefined) {
    if (!fileUrl) {
      alert('No report available to download.');
      return;
    }

    const filename = fileUrl.split('\\').pop();
    if (filename) {
      this.auth.downloadPatientReport(filename);
    } else {
      alert('Invalid file path.');
    }
  }

  // appointment model
  selectPatient(patient: Patient) {
    this.isTable = true;
    this.isTable1 = true;
    this.selectedPatientForBooking = patient;
    this.bookingDate = '';
    this.bookingTime = '';
    this.showDoctorList = false;
    this.loadActiveDoctors();
  }
  selectDoctor(doctor: any) {
    this.selectedDoctor = doctor;
  }

  loadActiveDoctors() {
    let params = { skip: this.page * this.limit, limit: this.limit };

    this.auth.getDoctors(params).subscribe({
      next: (res: any) => {
        this.totalDoctorCount = res.totalCount || 0;

        let doctorArray: any[] = [];
        if (res?.showDoctor?.[0]?.data) doctorArray = res.showDoctor[0].data;
        else if (Array.isArray(res?.showDoctor)) doctorArray = res.showDoctor;
        else if (Array.isArray(res)) doctorArray = res;

        this.doctors = doctorArray;
        this.showDoctorList = true;
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
        this.doctors = [];
      }
    });
  }
  
    onPageChange(event: PageEvent) {
    console.log('Page changed:', event);
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.loadActiveDoctors();
  }

  addBtnDoctor(bookingRef: TemplateRef<any>, doctor: any) {
  if (!this.selectedPatientForBooking) {
    alert('Please select a patient first');
    return;
  }
  this.selectedDoctor = doctor;
  this.dialog.open(bookingRef, {
    height: '350px',
    width: '600px',
  })
}

confirmBooking() {
  if (!this.selectedPatientForBooking || !this.selectedDoctor || !this.bookingDate || !this.bookingTime) {
    return;
  }

  const appointment = {
    patientId: this.selectedPatientForBooking._id,
    doctorId: this.selectedDoctor._id,
    date: this.bookingDate,
    time: this.bookingTime,
  };

  this.auth.createAppointment(appointment).subscribe({
    next: () => {
      this.showDoctorList = false;
      this.selectedDoctor = null;
      this.selectedPatientForBooking = null;
      this.bookingDate = '';
      this.bookingTime = '';
      this.loadAppointments();
      this.snackBar.open('Booked successfully!', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['login-success-snackbar']
      });
    },
    error: (err) => {
      console.error('Booking failed:', err);
      alert('Booking failed: ' + err.error?.message || 'Unknown error');
    }
  });
}

loadAppointments() {
       const params = {
    skip: this.appointmentsPage * this.appointmentsLimit,
    limit: this.appointmentsLimit
  };
  this.auth.getAppointments(params).subscribe({
    next: (res: any) => {
      const result = res.data?.[0]
      this.appointments = res.data || [];
      this.totalAppointmentsCount = res.total || 0;
      this.dialog.closeAll();
    },
    error: (err) => {
      console.error('Failed to load appointments:', err);
      this.appointments = [];
    }
  });
}

  onPageAppointmentChange(event: PageEvent) {
    this.appointmentsPage = event.pageIndex;
    this.appointmentsLimit = event.pageSize;
    this.loadAppointments();
  }

 formatDateForInput(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  editAppointment(appopintment: Appointment, editappointmentRef: TemplateRef<any>) {
    this.editingAppointment = { ...appopintment };
    this.dialog.open(editappointmentRef, {
      height: '500px',
      width: '600px'
    })
  }

  cancelEditappointment() {
    this.dialog.closeAll();
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
        this.editingAppointment = null;
        this.loadAppointments();
        this.dialog.closeAll();
        this.snackBar.open('Edited successfully!', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['login-success-snackbar']
        });
      },
      error: (err) => console.error('Failed to update appointment:', err)
    });
  }
}
