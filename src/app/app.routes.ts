import { Routes } from '@angular/router';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { RegisterPageComponent } from '../pages/register-page/register-page.component';
import { SchedulesPageComponent } from '../pages/schedules-page/schedules-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginPageComponent, title: 'Fit Arena Login' },
    { path: 'register', component: RegisterPageComponent, title: 'Fit Arena Register' },
    { path: 'schedules', component: SchedulesPageComponent, title: 'Fit Arena Schedules' },
];