import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { APIService } from '../../services/API.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, UpperCasePipe, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  tokrn = localStorage.getItem('token') || '';
  userId = localStorage.getItem('userID') || '';
  user: any;
  constructor(private apiService: APIService) {}
  ngOnInit(): void {
    this.apiService.getUser(this.userId).subscribe(
      (res) => {
        this.user = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  faRightFromBracket = faRightFromBracket;
  router = inject(Router);

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    this.router.navigate(['/login']);
  }
}
