import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminService } from '../services/admin-service/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = false;

  constructor(private admin: AdminService, private router: Router) {}

  submit(): void {
    this.error = false;
    if (this.admin.login(this.username, this.password)) {
      this.router.navigate(['/admin']);
    } else {
      this.error = true;
    }
  }
}
