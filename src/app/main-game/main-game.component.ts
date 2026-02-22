import { Component, OnInit } from '@angular/core';
import { NgbCollapseModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrainerTeamComponent } from "../trainer-team/trainer-team.component";
import { ItemsComponent } from "../items/items.component";
import { GameStateService } from '../services/game-state-service/game-state.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItemItem } from '../interfaces/item-item';
import { RestartGameButtonComponent } from "../restart-game-buttom/restart-game-buttom.component";
import { TrainerService } from '../services/trainer-service/trainer.service';
import { AnalyticsService } from '../services/analytics-service/analytics.service';
import { NgIconsModule } from '@ng-icons/core';
import { DarkModeService } from '../services/dark-mode-service/dark-mode.service';
import { Observable } from 'rxjs';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { RouletteContainerComponent } from './roulette-container/roulette-container.component';
import { SettingsButtonComponent } from '../settings-button/settings-button.component';
import { CreditsButtonComponent } from './credits-button/credits-button.component';
import { RareCandyService } from '../services/rare-candy-service/rare-candy.service';
import { AdminService } from '../services/admin-service/admin.service';

@Component({
  selector: 'app-main-game',
  imports: [
    CommonModule,
    RouterModule,
    RouletteContainerComponent,
    SettingsButtonComponent,
    CreditsButtonComponent,
    TrainerTeamComponent,
    ItemsComponent,
    RestartGameButtonComponent,
    NgIconsModule,
    NgbCollapseModule,
    LanguageSelectorComponent
  ],
  templateUrl: './main-game.component.html',
  styleUrl: './main-game.component.css'
})
export class MainGameComponent implements OnInit {
  admin: AdminService;

  constructor(
    private darkModeService: DarkModeService,
    private gameStateService: GameStateService,
    private trainerService: TrainerService,
    private modalService: NgbModal,
    private analyticsService: AnalyticsService,
    private rareCandyService: RareCandyService,
    admin: AdminService) {
      this.darkMode = this.darkModeService.darkMode$;
      this.admin = admin;
  }

  wheelSpinning: boolean = false;

  ngOnInit(): void {
    this.analyticsService.trackEvent('main-game-loaded', 'Main Game Loaded', 'user acess');

    this.gameStateService.wheelSpinningObserver.subscribe(state => {
      this.wheelSpinning = state;
    });
  }
  
  darkMode!: Observable<boolean>;
  mapIsCollapsed: boolean = true;

  resetGameAction(): void {
    this.resetGame();
    this.modalService.dismissAll();
  }

  rareCandyInterrupt(rareCandy: ItemItem): void {
    if(this.wheelSpinning){
      return;
    }

    this.rareCandyService.triggerRareCandyEvolution(rareCandy);
  }

  resetGame(): void {
    this.trainerService.resetTrainer();
    this.trainerService.resetTeam();
    this.trainerService.resetItems();
    this.trainerService.resetBadges();
    this.gameStateService.resetGameState();
  }
}
