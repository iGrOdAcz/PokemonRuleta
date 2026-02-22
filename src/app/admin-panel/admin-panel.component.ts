import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TrainerService } from '../services/trainer-service/trainer.service';
import { AdminService } from '../services/admin-service/admin.service';
import { PokemonItem } from '../interfaces/pokemon-item';
import { ItemItem } from '../interfaces/item-item';
import { PokemonService } from '../services/pokemon-service/pokemon.service';
import { ItemsService } from '../services/items-service/items.service';
import { EvolutionService } from '../services/evolution-service/evolution.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  team: PokemonItem[] = [];
  stored: PokemonItem[] = [];
  items: ItemItem[] = [];

  allPokemons: PokemonItem[] = [];
  allItemsOptions: ItemItem[] = [];

  // add-by-dropdown fields
  selectedPokemonForAdd?: PokemonItem;
  newPokemonId?: number;
  newPokemonText = '';
  newPokemonPower: 1 | 2 | 3 | 4 | 5 = 1;
  newPokemonShiny = false;
  newPokemonFill = 'grey';

  selectedItemToAdd?: ItemItem;

  // edit existing
  selectedExistingPokemon?: PokemonItem;
  evolutionOptions: PokemonItem[] = [];
  selectedEvolution?: PokemonItem;

  newItemName = '';

  constructor(
    private trainer: TrainerService,
    private admin: AdminService,
    private router: Router,
    private pokemonService: PokemonService,
    private itemsService: ItemsService,
    private evolutionService: EvolutionService
  ) {}

  ngOnInit(): void {
    this.team = this.trainer.getTeam();
    this.stored = this.trainer.getStored();
    this.items = this.trainer.getItems();

    this.allPokemons = this.pokemonService.getAllPokemon();
    this.allItemsOptions = this.itemsService.getAllItems();

    this.trainer.getTeamObservable().subscribe(t => {
      this.team = t;
      this.stored = this.trainer.getStored();
    });
    this.trainer.getItemsObservable().subscribe(i => (this.items = i));
  }

  addPokemon(): void {
    if (this.newPokemonId && this.newPokemonText) {
      const pokemon: PokemonItem = {
        text: this.newPokemonText,
        pokemonId: this.newPokemonId,
        fillStyle: this.newPokemonFill,
        weight: 1,
        power: this.newPokemonPower,
        shiny: this.newPokemonShiny,
        sprite: null
      } as PokemonItem;
      this.trainer.addToTeam(pokemon);
      this.resetAddPokemonFields();
    }
  }

  resetAddPokemonFields(): void {
    this.newPokemonId = undefined;
    this.newPokemonText = '';
    this.newPokemonPower = 1;
    this.newPokemonShiny = false;
    this.newPokemonFill = 'grey';
  }

  removeFromTeam(p: PokemonItem): void {
    this.trainer.removeFromTeam(p);
    this.stored = this.trainer.getStored();
    if (this.selectedExistingPokemon === p) {
      this.selectedExistingPokemon = undefined;
    }
  }

  removeItem(item: ItemItem): void {
    this.trainer.removeItem(item);
  }

  addItem(): void {
    if (this.newItemName) {
      const item: ItemItem = {
        text: this.newItemName,
        name: this.newItemName as any,
        sprite: '',
        fillStyle: 'grey',
        weight: 1,
        description: ''
      };
      this.trainer.addToItems(item);
      this.newItemName = '';
    }
  }

  addItemFromDropdown(): void {
    if (this.selectedItemToAdd) {
      this.trainer.addToItems(this.selectedItemToAdd);
    }
  }

  onPokemonForAddChange(): void {
    if (this.selectedPokemonForAdd) {
      this.newPokemonId = this.selectedPokemonForAdd.pokemonId;
      this.newPokemonText = this.selectedPokemonForAdd.text;
      this.newPokemonFill = this.selectedPokemonForAdd.fillStyle;
    }
  }

  addPokemonFromDropdown(): void {
    if (this.selectedPokemonForAdd) {
      // clone to avoid referencing same object
      const clone = structuredClone(this.selectedPokemonForAdd) as PokemonItem;
      this.trainer.addToTeam(clone);
    }
  }

  onExistingPokemonSelect(): void {
    this.evolutionOptions = [];
    this.selectedEvolution = undefined;
    if (this.selectedExistingPokemon && this.evolutionService.canEvolve(this.selectedExistingPokemon)) {
      this.evolutionOptions = this.evolutionService.getEvolutions(this.selectedExistingPokemon);
    }
  }

  makeShiny(): void {
    if (this.selectedExistingPokemon) {
      this.trainer.makePokemonShiny(this.selectedExistingPokemon);
    }
  }

  prepareEvolution(): void {
    this.onExistingPokemonSelect();
  }

  evolvePokemon(): void {
    if (this.selectedExistingPokemon && this.selectedEvolution) {
      this.trainer.replaceForEvolution(this.selectedExistingPokemon, this.selectedEvolution);
      this.onExistingPokemonSelect();
    }
  }

  logout(): void {
    this.admin.logout();
    this.router.navigate(['/']);
  }

  updateTeam(): void {
    this.trainer.updateTeam();
  }
}
