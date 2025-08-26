import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatCardModule],
})
export class LoginComponent {
  isSignupMode = false;
  showResetForm = false;
  isLogin = true;
  isLoginMode = true;

  isOtpVerified = false;
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  mobile = '';
  errorMessage = '';

  signupEmail = '';
  signupOtpSent = false;
  signupOtpVerified = false;
  signupEnteredOtp = '';
  signupPassword = '';

  isForgotPassword = false;
  resetEmail = '';
  enteredOtp = '';
  newPassword = '';
  confirmPassword = '';
  isOtpSent = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.email = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.mobile = '';
    this.signupOtpSent = false;
    this.signupOtpVerified = false;
  }

  onLogin() {
    this.isForgotPassword = false;
    this.isLogin = true;
  }

  backToLogin() {
    this.isForgotPassword = false;
    this.isLogin = true;
    this.isLoginMode = true;
    this.errorMessage = '';
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      form.controls['email']?.markAsTouched();
      form.controls['password']?.markAsTouched();
      return;
    }

    if (this.isLoginMode) {
      this.login();
    } else {
      if (!this.signupOtpVerified) {
        this.errorMessage = 'Please verify OTP before registering.';
        return;
      }
      this.signupAdmin();
    }
  }

  openForgotPassword() {
    this.isForgotPassword = true;
    this.errorMessage = '';
    this.isLogin = false;
  }

  generateOTP() {
    if (!this.resetEmail || !this.resetEmail.trim()) {
      this.errorMessage = 'Enter your Email...';
      return;
    }

    const data = { email: this.resetEmail };
    this.auth.sendOtp(data).subscribe({
      next: () => {
        this.isOtpSent = true;
        this.showResetForm = false;
        this.errorMessage = '';
        this.snackBar.open('OTP sent to your Email', '', { duration: 3000 });
      },
      error: () => {
        this.errorMessage = 'Failed to send OTP';
      }
    });
  }

  sendSignupOtp() {
    if (!this.signupEmail.trim()) {
      this.errorMessage = 'Enter your email';
      return;
    }

    const data = { email: this.signupEmail };
    this.auth.sendOtp(data).subscribe({
      next: () => {
        this.signupOtpSent = true;
        this.errorMessage = '';
        this.snackBar.open('Signup OTP sent', '', { duration: 3000 });
      },
      error: () => {
        this.errorMessage = 'Failed to send OTP for signup';
      }
    });
  }

  verifySignupOtp() {
    if (!this.signupEnteredOtp.trim()) {
      this.errorMessage = 'Enter the OTP sent to your email';
      return;
    }

    const data = {
      email: this.signupEmail,
      otp: this.signupEnteredOtp
    };

    this.auth.verifyOtp(data).subscribe({
      next: () => {
        this.signupOtpVerified = true;
        this.errorMessage = '';
        this.snackBar.open('Signup OTP verified', '', { duration: 3000 });
      },
      error: () => {
        this.errorMessage = 'Invalid or expired OTP';
        this.signupOtpVerified = false;
      }
    });
  }

  verifyOtp() {
    if (!this.enteredOtp.trim()) {
      this.errorMessage = 'Enter your OTP';
      return;
    }

    const data = { email: this.resetEmail, otp: this.enteredOtp };
    this.auth.verifyOtp(data).subscribe({
      next: () => {
        this.isOtpVerified = true;
        this.errorMessage = '';
        this.snackBar.open('OTP verified successfully', '', { duration: 3000 });
      },
      error: (err) => {
        const backendMessage = err?.error?.message || 'Invalid OTP or OTP expired.';
        this.errorMessage = backendMessage;
        this.snackBar.open(backendMessage, '', { duration: 3000 });
        this.isOtpVerified = false;
      }
    });
  }

  resetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Enter your new and confirm password';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const data = {
      email: this.resetEmail,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.auth.resetPassword(data).subscribe({
      next: () => {
        this.snackBar.open('Password reset successful', '', { duration: 3000 });
        this.isForgotPassword = false;
        this.isLogin = true;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Password reset failed';
      }
    });
  }

  login() {
    const payload = { email: this.email, password: this.password };

    this.auth.loginAllRoles(payload).subscribe({
      next: ([adminRes, doctorRes, receptionRes]) => {
        const adminMsg = adminRes?.message?.toLowerCase();
        const doctorMsg = doctorRes?.message?.toLowerCase();
        const receptionMsg = receptionRes?.message?.toLowerCase();

        if (adminMsg === 'login successful') {
          this.handleLogin(adminRes.token, 'Admin');
        } else if (doctorMsg === 'login successful') {
          const doctorId = doctorRes?.doctor?._id;
          if (doctorId) this.auth.setDoctorId(doctorId);
          this.handleLogin(doctorRes.token, 'Doctor');
        } else if (receptionMsg === 'login successful') {
          this.handleLogin(receptionRes.token, 'Receptionist');
        } else {
          const allMessages = [adminMsg, doctorMsg, receptionMsg];

          if (allMessages.includes('user not found')) {
            this.errorMessage = 'Account not found';
            setTimeout(() => {
              this.isLoginMode = false;
              this.errorMessage = '';
            }, 1000);
          } else if (allMessages.includes('invalid password')) {
            this.errorMessage = 'Invalid password';
          } else {
            this.errorMessage = 'Login failed';
          }
        }
      },
      error: () => {
        this.errorMessage = 'Server error during login.';
      }
    });
  }

  signupAdmin() {
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.signupEmail,
      password: this.signupPassword,
      mobile: this.mobile
    };

    this.auth.registerUser(userData).subscribe({
      next: () => {
        this.errorMessage = '';
        this.toggleMode();
        this.snackBar.open('Signup Successfully', '', { duration: 3000 });
      },
      error: () => {
        this.errorMessage = 'Server error during registration.';
      }
    });
  }

  handleLogin(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (role === 'Doctor') {
      this.router.navigate(['/doctorportal']);
    } else if (role === 'Admin') {
      this.router.navigate(['/adminportal']);
    } else if (role === 'Receptionist') {
      this.router.navigate(['/receptionistportal']);
    }
  }
}
