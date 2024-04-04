import { Routes } from '@angular/router';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { RegisterPageComponent } from '../pages/register-page/register-page.component';
import { SchedulesPageComponent } from '../pages/schedules-page/schedules-page.component';
import { InfoPageComponent } from '../pages/info-page/info-page.component';
import { SettingsPageComponent } from '../pages/settings-page/settings-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginPageComponent, title: 'Fit Arena Login' },
    { path: 'register', component: RegisterPageComponent, title: 'Fit Arena Register' },
    { path: 'schedules', component: SchedulesPageComponent, title: 'My Schedules' },
    { path: 'info/:value', component: InfoPageComponent, title: 'Info' },
    { path: 'settings', component: SettingsPageComponent, title: 'Settings' },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];