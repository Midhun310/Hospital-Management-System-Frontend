import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  // ------------------ AUTH ------------------

  setDoctorId(id: string) {
    this.doctorId = id;
    localStorage.setItem('doctorId', id);
  }

  getDoctorId(): string | null {
    return this.doctorId || localStorage.getItem('doctorId');
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/registeradmin`, data);
  }

  loginAllRoles(payload: any): Observable<any[]> {
    const adminLogin = this.http.post<any>(`${this.baseUrl}admin/loginadmin`, payload)
      .pipe(catchError(() => of(null)));

    const doctorLogin = this.http.post<any>(`${this.baseUrl}doctor/logindoctor`, payload)
      .pipe(catchError(() => of(null)));

    const receptionLogin = this.http.post<any>(`${this.baseUrl}receptionist/loginreceptionist`, payload)
      .pipe(catchError(() => of(null)));

    return forkJoin([adminLogin, doctorLogin, receptionLogin]);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }



  // Send OTP to user
  sendOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/sendotp`, data);
  }

  // Verify OTP
  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/verifyotp`, data);
  }

  // Forgot Password - Reset
resetPassword(data: any) {
  return this.http.post(`${this.baseUrl}admin/reset-password`, data);
}

  // ------------------ DOCTOR ------------------

  getDoctors(params: { skip?: number; limit?: number } = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/getDoctor`, { params });
  }

  getDoctorPage(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/getDoctorPage`, { params: { page, limit } });
  }

  addDoctor(_: string, newDoctor: Doctor): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/createdoctor`, newDoctor);
  }

  updateDoctor(_id: string, updatedDoctor: Doctor): Observable<any> {
    return this.http.put(`${this.baseUrl}admin/updatedoctor`, updatedDoctor);
  }

  deleteDoctor(_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}admin/deletedoctor/${_id}`);
  }

  // ------------------ RECEPTIONIST ------------------

  getReceptionists(params: { skip?: number; limit?: number } = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/getReceptionist`, { params });
  }

  addReceptionist(_: string, newReceptionist: Receptionist): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/createreceptionist`, newReceptionist);
  }

  updateReceptionist(_id: string, updatedReceptionist: Receptionist): Observable<any> {
    return this.http.put(`${this.baseUrl}admin/updatereceptionist`, updatedReceptionist);
  }

  deleteReceptionist(_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}admin/deletereceptionist/${_id}`);
  }

  // ------------------ PATIENT ------------------

  getPatients(params: { skip?: number; limit?: number } = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}receptionist/getPatientList`, { params });
  }

  addPatient(newPatient: any): Observable<any> {
    return this.http.post(`${this.baseUrl}receptionist/createpatient`, newPatient);
  }

  updatePatient(_id: string, updatedPatient: any): Observable<any> {
    return this.http.put(`${this.baseUrl}receptionist/updatePatient`, updatedPatient);
  }

  // ------------------ APPOINTMENTS ------------------

  createAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}receptionist/createappointment`, appointment);
  }

  getAppointments(params: { skip?: number; limit?: number } = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}receptionist/showAppointments`, { params });
  }

  updateAppointment(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}receptionist/updateAppointment`, data);
  }

  // ------------------ REPORTS ------------------

  uploadPatientReport(patientId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}receptionist/uploadreport/${patientId}`, formData);
  }

  downloadPatientReport(fileName: string): void {
    if (!fileName) {
      alert('No report available to download.');
      return;
    }

    const url = `${this.baseUrl}receptionist/getReport/${fileName}`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
