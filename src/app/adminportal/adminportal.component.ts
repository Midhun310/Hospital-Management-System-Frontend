import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
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
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogContent, } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DeleteconfirmComponent } from '../deleteconfirm/deleteconfirm.component';

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

interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status?: string;
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
    MatSelectModule,
    MatDialogContent,
    MatPaginator,
    MatPaginatorModule
  ],
  templateUrl: './adminportal.component.html',
  styleUrls: ['./adminportal.component.scss'],
})
export class AdminportalComponent implements OnInit {

  // doctor
  doctors: Doctor[] = [];
  dataSource = new MatTableDataSource<Doctor>([]);

  displayedColumns: string[] = [
    'sno',
    'name',
    'email',
    'mobile',
    'department',
    'role',
    'shift',
    'workStatus',
    'actions',
  ];

  page = 0;
  sort = 0;
  limit = 10;
  totalDoctorCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  showDoctorTable = false;
  editingDoctor: Doctor | null = null;
  newDoctor: Partial<Doctor> = {};

  // receptionist
  receptionists: Receptionist[] = [];
  receptionistDataSource = new MatTableDataSource<Receptionist>([]);
  @ViewChild(MatPaginator) receptionistPaginator!: MatPaginator;
  receptionistColumns: string[] = [
    'sno',
    'name',
    'email',
    'mobile',
    'status',
    'shift',
    'actions',
  ];
  receptionistPage = 0;
  receptionistLimit = 10;
  totalReceptionistCount = 0;
  showReceptionistTable = false;
  newReceptionist: Partial<Receptionist> = {};
  editingReceptionist: Receptionist | null = null;

  // patient
  patients: Patient[] = [];
  patientDataSource = new MatTableDataSource<Patient>([]);
  @ViewChild(MatPaginator) patientPaginator!: MatPaginator;
  patientColumns: string[] = [
    'sno',
    'name',
    'mobile',
    'age',
    'gender',
    'patient symptoms',
    'visit',
    'actions',
  ];
  patientPage = 0;
  patientLimit = 10;
  totalPatientCount = 0;
  showPatientTable = false;
  newPatient: Partial<Patient> = {};
  editingPatient: Patient | null = null;

  //appointment
  appointments: any[] = [];
  appointmentsDataSource = new MatTableDataSource<Appointment>([]);
  @ViewChild(MatPaginator) appointmentsPaginator!: MatPaginator;

  appointmentsPage = 0;
  appointmentsLimit = 10;
  totalAppointmentsCount = 0;

  showAppointmentTable: boolean = false;
  editingAppointment: any = null;
  showAddForm = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Doctor Methods
  loadDoctors() {
    let params = { skip: this.page * this.limit, limit: this.limit };
    this.auth.getDoctors(params).subscribe({
      next: (res) => {
        const result = res.showDoctor?.[0];
        this.doctors = result?.data || [];
        this.dataSource.data = this.doctors;
        this.showDoctorTable = true;
        this.showReceptionistTable = false;
        this.showPatientTable = false;
        this.showAppointmentTable = false;
        this.totalDoctorCount = res.totalCount || 0;
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.loadDoctors();
  }

  addBtnDoctor(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      height: '500px',
      width: '600px',
    });
  }

  editDoctor(doctor: Doctor, editdoctorRef: TemplateRef<any>) {
    this.editingDoctor = { ...doctor };
    this.dialog.open(editdoctorRef, {
      height: '500px',
      width: '600px',
    });
  }

  cancelEdit() {
    this.dialog.closeAll();
  }

  addDoctor() {
    this.auth
      .addDoctor(this.newDoctor.email!, this.newDoctor as Doctor)
      .subscribe({
        next: (res: any) => {
          console.log('Doctor added:', res);
          this.loadDoctors();
          this.showAddForm = false;
          this.newDoctor = {};
          this.editingDoctor = null;
          this.dialog.closeAll();

          this.snackBar.open('Doctor added successfully!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['login-success-snackbar']
          });
        },

        error: (err: any) => {
          console.error('Failed to add doctor:', err);
        },
      });
  }

  
  cancel() {
    this.dialog.closeAll();
  }


  updateDoctor() {
    if (!this.editingDoctor || !this.editingDoctor._id) return;
    console.log('Submitting doctor data:', this.editingDoctor);
    this.auth
      .updateDoctor(this.editingDoctor._id, this.editingDoctor)
      .subscribe({
        next: (res) => {
          console.log('Update Success:', res);
          this.loadDoctors();
          this.editingDoctor = null;
          this.dialog.closeAll();

          this.snackBar.open('Edited successfully!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['login-success-snackbar']
          });
        },
        error: (err) => {
          console.error('Update Failed:', err);
        },
      });
  }

  deleteDoctor(id: string) {
    const dialog = this.dialog.open(DeleteconfirmComponent, {});
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.auth.deleteDoctor(id).subscribe(
          (res) => {
            console.log('Doctor deleted:', res);
            this.loadDoctors();
            this.snackBar.open('Deleted successfully!', '', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['login-success-snackbar']
            });
          },
          (err) => {
            console.error('Delete failed:', err);
          }
        );
      }
    });
  }

  // receptionist methods
  loadReceptionists() {
      const params = {
    skip: this.receptionistPage * this.receptionistLimit,
    limit: this.receptionistLimit
  };

    this.auth.getReceptionists(params).subscribe({
      next: (res: any) => {
        const result = res.getReception?.[0];
        this.receptionists = result?.data|| [];
        this.totalReceptionistCount = result?.count?.[0]?.totalCount || 0;

        this.showReceptionistTable = true;
        this.showDoctorTable = false;
        this.showPatientTable = false;
        this.showAppointmentTable = false;

        this.editingDoctor = null;
        console.log('Loaded Receptionists:', this.receptionists);
      },
      error: (err) => {
        console.error('Failed to load receptionists:', err);
      },
    });
  }


    onPageReceptionistChange(event: PageEvent) {

    this.receptionistPage = event.pageIndex;
    this.receptionistLimit = event.pageSize;
    this.loadReceptionists();
  }

  updateReceptionist() {
    if (!this.editingReceptionist || !this.editingReceptionist._id) return;
    console.log('Submitting receptionist data:', this.editingReceptionist);
    this.auth
      .updateReceptionist(
        this.editingReceptionist._id!,
        this.editingReceptionist
      )
      .subscribe({
        next: (res: any) => {
          console.log('Update Success:', res);
          this.loadReceptionists();
          this.dialog.closeAll();
          this.editingReceptionist = null;
          this.snackBar.open('Edited successfully!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['login-success-snackbar']
          });
        },
        error: (err: any) => {
          console.error('Update Failed:', err);
        },
      });
  }

  addReceptionist() {
    this.auth
      .addReceptionist(
        this.newReceptionist.email!,
        this.newReceptionist as Receptionist
      )
      .subscribe({
        next: (res: any) => {
          console.log('Receptionist added:', res);
          this.loadReceptionists();
          this.showAddForm = false;
          this.newReceptionist = {};
          this.dialog.closeAll();
          
          this.snackBar.open('Added successfully!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['login-success-snackbar']
          });
        },
        error: (err: any) => {
          console.error('Failed to add receptionist:', err);
        },
      });
  }

  addBtnReceptionist(addreceptionistRef: TemplateRef<any>) {
    const diaLog = this.dialog.open(addreceptionistRef, {
      height: '500px',
      width: '600px',
    });
    diaLog.afterClosed().subscribe((res) => {
      if (res) {
        this.addReceptionist();
        this.showAddForm = true;
      } else {
        this.showAddForm = false;
      }
    });
  };

  editReceptionist(
    receptionist: Receptionist,
    editreceptionistRef: TemplateRef<any>
  ) {
    this.editingReceptionist = { ...receptionist };
    this.dialog.open(editreceptionistRef, {
      height: '500px',
      width: '600px',
    });
  }

  cancelEditreceptionist() {
    this.dialog.closeAll();
  }

  deleteReceptionist(id: string) {
    const dialog = this.dialog.open(DeleteconfirmComponent, {});
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.auth.deleteReceptionist(id).subscribe({
          next: (res) => {
            console.log('Receptionist deleted:', res);
            this.loadReceptionists();
            this.snackBar.open('Deleted successfully!', '', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['login-success-snackbar']
            });
          },
          error: (err) => {
            console.error('Delete failed:', err);
          }
        });
      }
    });
  }

  //patient method
  loadPatients(showTable: boolean = true) {
      const params = {
    skip: this.patientPage * this.patientLimit,
    limit: this.patientLimit
  };

    this.auth.getPatients(params).subscribe({
      next: (res:any) => {
        const result = res.showPatient?.[0];
        console.log('Result:', result);
        this.patients = result?.data || [];
           this.totalPatientCount = result?.count?.[0]?.['total count'] || 0;
        console.log('Total Patients Count:', this.totalPatientCount);
        this.patientDataSource.data = this.patients;

        if (showTable) {
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
      },
    });
  }

  onPagePatientChange(event: PageEvent) {
    this.patientPage = event.pageIndex;
    this.patientLimit = event.pageSize;
    this.loadPatients();
  }

  addPatient() {
    this.auth.addPatient(this.newPatient).subscribe({
      next: (res: any) => {
        console.log('Patient added:', res);
        this.loadPatients();
        this.showAddForm = false;
        this.newPatient = {};
        this.dialog.closeAll();
        this.snackBar.open('Added successfully!', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['login-success-snackbar']
        });
      },
      error: (err: any) => {
        console.error('Failed to add patient:', err);
      },
    });
  }

  addBtnPatient(addpatientRef: TemplateRef<any>) {
    const diaLog = this.dialog.open(addpatientRef, {
      height: '500px',
      width: '600px',
    });
    diaLog.afterClosed().subscribe((res) => {
      if (res) {
        this.addPatient();
        this.showAddForm = true;
      } else {
        this.showAddForm = false;
      }
    });
  }

  editPatient(patient: Patient, editpatientRef: TemplateRef<any>) {
    this.editingPatient = { ...patient };
    this.dialog.open(editpatientRef, {
      height: '500px',
      width: '600px',
    });
  }

  updatePatient() {
    if (!this.editingPatient || !this.editingPatient._id) return;
    console.log('Submitting patient data:', this.editingPatient);
    this.auth
      .updatePatient(this.editingPatient._id!, this.editingPatient)
      .subscribe({
        next: (res: any) => {
          console.log('Update Success:', res);
          this.loadPatients();
          this.editingPatient = null;
          this.dialog.closeAll();
          this.snackBar.open('Edited successfully!', '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['login-success-snackbar']
          });
        },
        error: (err: any) => {
          console.error('Update Failed:', err);
        },
      });
  }

  cancelEditPatient() {
    this.dialog.closeAll();
  }

  // appointments method
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
    this.auth.getDoctors(
      ({ skip: 0, limit: 100 })
    ).subscribe({
      next: (res: any) => {
        const doctorsArray = res?.showDoctor?.[0]?.data || [];
        this.doctors = doctorsArray.filter(
          (doc: any) => (doc.workStatus || '').toLowerCase() === 'active'
        );
        console.log('Loaded Active Doctors:', this.doctors);
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
        this.doctors = [];
      },
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
        this.showAppointmentTable = true;
      },
      error: (err) => {
        console.error('Failed to load appointments:', err);
        this.appointments = [];
      },
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

  editAppointment(
    appopintment: Appointment,
    editappointmentRef: TemplateRef<any>
  ) {
    this.editingAppointment = { ...appopintment };
    this.dialog.open(editappointmentRef, {
      height: '500px',
      width: '600px',
    });
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
      status: this.editingAppointment.status || 'scheduled',
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
      error: (err) => console.error('Failed to update appointment:', err),
    });
  }
}
