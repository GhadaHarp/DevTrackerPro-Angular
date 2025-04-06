// import { Routes } from '@angular/router';
// import { SignupComponent } from './components/signup/signup.component';
// import { LoginComponent } from './components/login/login.component';
// import { HomeComponent } from './components/home/home.component';
// import { ErrorPageComponent } from './components/error-page/error-page.component';
// import { AllTasksComponent } from './components/all-tasks/all-tasks.component';
// import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
// import { HeaderComponent } from './components/header/header.component';
// import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

// export const routes: Routes = [
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: 'home', component: HomeComponent },
//   { path: 'signup', component: SignupComponent },

//   { path: 'login', component: LoginComponent },
//   { path: 'all-tasks', component: AllTasksComponent },
//   { path: 'error', component: ErrorPageComponent },
//   { path: '**', component: PageNotFoundComponent },
// ];
import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'all-tasks',
    loadComponent: () =>
      import('./components/all-tasks/all-tasks.component').then(
        (m) => m.AllTasksComponent
      ),
  },

  {
    path: 'error',
    loadComponent: () =>
      import('./components/error-page/error-page.component').then(
        (m) => m.ErrorPageComponent
      ),
  },

  { path: '**', component: PageNotFoundComponent },
];
