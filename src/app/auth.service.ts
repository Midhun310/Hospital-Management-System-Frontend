import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Doctor interface
export interface Doctor {
  _id?: string;
  name: string;
  specialization: string;
  email: string;
  mobile: string;
  department?: string;
  role?: string;
  shift?: string;
  workStatus?: string;
}

// Receptionist interface
export interface Receptionist {
  _id?: string;
  name: string;
  email: string;
  mobile: string;
  shift?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/';
  private doctorId: string | null = null;

  constructor(private http: HttpClient) { }


setDoctorId(id: string) {
  this.doctorId = id;
  localStorage.setItem('doctorId', id);
}

getDoctorId(): string | null {
  return this.doctorId || localStorage.getItem('doctorId');
}

  // Multi-role login API (admin, doctor, receptionist)
  loginAllRoles(payload: any) {
    const adminLogin = this.http
      .post<any>(`${this.baseUrl}admin/loginadmin`, payload)
      .pipe(catchError(() => of(null)));
    const doctorLogin = this.http
      .post<any>(`${this.baseUrl}doctor/logindoctor`, payload)
      .pipe(catchError(() => of(null)));
    const receptionLogin = this.http
      .post<any>(`${this.baseUrl}receptionist/loginreceptionist`, payload)
      .pipe(catchError(() => of(null)));

    return forkJoin([adminLogin, doctorLogin, receptionLogin]);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  // Get user role
  getUserRole(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('role');
    }
    return null;
  }

  // Get all doctors
  getDoctors(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/getDoctor`);
  }

  // Update doctor
  updateDoctor(_id: string, updatedDoctor: Doctor): Observable<any> {
    return this.http.put(`${this.baseUrl}admin/updatedoctor`, updatedDoctor);
  }

  // Delete doctor
  deleteDoctor(_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}admin/deletedoctor/${_id}`);
  }

  // Add new doctor
  addDoctor(p0: string, newDoctor: Doctor): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/createdoctor`, newDoctor);
  }

  // Get all receptionists
  getReceptionists(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/getReceptionist`);
  }

  // Update receptionist
  updateReceptionist(_id: string, updatedReceptionist: Receptionist): Observable<any> {
    return this.http.put(`${this.baseUrl}admin/updatereceptionist`,updatedReceptionist);
  }

  // Add new receptionist
  addReceptionist(p0: string, newReceptionist: Receptionist): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/createreceptionist`, newReceptionist);
  }

  // Delete receptionist
  deleteReceptionist(_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}admin/deletereceptionist/${_id}`);
  }

  // Get all patients
  getPatients(): Observable<any> {
    return this.http.get(`${this.baseUrl}receptionist/getPatientList`);
  }

  // Add new patient
  addPatient(newPatient: any): Observable<any> {
    return this.http.post(`${this.baseUrl}receptionist/createpatient`, newPatient);
  }

  // Update patient
  updatePatient(_id: string, updatedPatient: any): Observable<any> {
    return this.http.put(`${this.baseUrl}receptionist/updatePatient`, updatedPatient);
  }

  //create appointment
  createAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}receptionist/createappointment`, appointment);
  }

  // Get all patients
  getAppointments(): Observable<any> {
    return this.http.get(`${this.baseUrl}receptionist/showAppointments`);
  }

  // update appointment
  updateAppointment(data: any) {
    return this.http.put(`${this.baseUrl}receptionist/updateAppointment`, data);
  }
}

