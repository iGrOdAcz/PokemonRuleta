import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AdminService } from './services/admin-service/admin.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'pokemon-roulette';
  admin?: AdminService;

  constructor(private translate: TranslateService, admin: AdminService) {
    this.admin = admin;
    const savedLanguage = localStorage.getItem('language') || 'en';
    // include all supported languages here
    this.translate.addLangs(['en', 'fr', 'es', 'pt', 'cs']);
    this.translate.setDefaultLang('en');
    this.translate.use(savedLanguage);
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}
