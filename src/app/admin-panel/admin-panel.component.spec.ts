import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AdminPanelComponent } from './admin-panel.component';
import { TrainerService } from '../services/trainer-service/trainer.service';
import { AdminService } from '../services/admin-service/admin.service';

describe('AdminPanelComponent', () => {
  let component: AdminPanelComponent;
  let fixture: ComponentFixture<AdminPanelComponent>;
  let trainerService: TrainerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPanelComponent, TranslateModule.forRoot()],
      providers: [TrainerService, AdminService]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPanelComponent);
    component = fixture.componentInstance;
    trainerService = TestBed.inject(TrainerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemon and item options', () => {
    expect(component.allPokemons.length).toBeGreaterThan(0);
    expect(component.allItemsOptions.length).toBeGreaterThan(0);
  });

  it('should add pokemon from dropdown', () => {
    spyOn(trainerService, 'addToTeam');
    component.selectedPokemonForAdd = component.allPokemons[0];
    component.addPokemonFromDropdown();
    expect(trainerService.addToTeam).toHaveBeenCalled();
  });

  it('should make selected existing pokemon shiny', () => {
    spyOn(trainerService, 'makePokemonShiny');
    component.selectedExistingPokemon = component.allPokemons[0];
    component.makeShiny();
    expect(trainerService.makePokemonShiny).toHaveBeenCalledWith(component.selectedExistingPokemon);
  });

  it('should compute evolution options when pokemon can evolve', () => {
    component.selectedExistingPokemon = component.allPokemons.find(p => p.pokemonId === 1);
    component.onExistingPokemonSelect();
    // bulbasaur should have evolutions
    expect(component.evolutionOptions.length).toBeGreaterThan(0);
  });
});