import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private loggedIn = false;
  private readonly USERNAME = 'igroda';
  private readonly PASSWORD = '1310';

  login(username: string, password: string): boolean {
    if (username === this.USERNAME && password === this.PASSWORD) {
      this.loggedIn = true;
      localStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('adminLoggedIn');
  }

  isLoggedIn(): boolean {
    if (this.loggedIn) {
      return true;
    }
    return localStorage.getItem('adminLoggedIn') === 'true';
  }
}
