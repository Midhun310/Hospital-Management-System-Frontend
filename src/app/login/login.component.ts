import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatCardModule]
})

export class LoginComponent {
  register() {
    throw new Error('Method not implemented.');
  }
  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    const payload = { email: this.email, password: this.password };

    this.auth.loginAllRoles(payload).subscribe({
      next: ([adminRes, doctorRes, receptionRes]) => {
        console.log('Admin Response:', adminRes);
        console.log('Doctor Response:', doctorRes);
        console.log('Receptionist Response:', receptionRes);
        if (adminRes?.message?.toLowerCase() === 'login successful') {
      this.handleLogin(adminRes.token, 'Admin');
    } else if (doctorRes?.message?.toLowerCase() === 'login successful') {
      const doctorId = doctorRes?.doctor?._id;
      if(doctorId){
        this.auth.setDoctorId(doctorId);
      }
      this.handleLogin(doctorRes.token, 'Doctor');
    } else if (receptionRes?.message?.toLowerCase() === 'login successful') {
      this.handleLogin(receptionRes.token, 'Receptionist');
    } else {
      this.errorMessage = 'Invalid username or password.';
    }
  },
  error: (err) => {
    console.error('Login error:', err);
    this.errorMessage = 'Server error.';
  }
});
  }

  handleLogin(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);


    if (role === 'Doctor') {
       this.router.navigate(['/doctorportal']); // ✅ Set it here
    }else if (role === 'Admin') {
      this.router.navigate(['/adminportal']);
    } else if (role === 'Receptionist') {
      this.router.navigate(['/receptionistportal']);
    }
  }
}
