import { Routes } from '@angular/router';
import { MainGameComponent } from './main-game/main-game.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CreditsComponent } from './credits/credits.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminGuard } from './services/admin-service/admin.guard';

export const routes: Routes = [
    { path: '', component: MainGameComponent },
    { path: 'credits', component: CreditsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'login', component: AdminLoginComponent },
    { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard] },
    { path: '**', component: NotFoundComponent },
];
