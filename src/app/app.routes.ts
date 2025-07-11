import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminportalComponent } from './adminportal/adminportal.component';
import { ReceptionistportalComponent } from './receptionistportal/receptionistportal.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'adminportal', component: AdminportalComponent,
     canActivate: [AuthGuard, RoleGuard],
     data: { expectedRole: 'Admin' }},

  { path: 'receptionistportal', component: ReceptionistportalComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Receptionist' }},

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
