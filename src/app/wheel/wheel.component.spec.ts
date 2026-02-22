import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelComponent } from './wheel.component';
import { TrainerService } from '../services/trainer-service/trainer.service';
import { BehaviorSubject } from 'rxjs';

describe('WheelComponent', () => {
  let component: WheelComponent;
  let fixture: ComponentFixture<WheelComponent>;

  // provide a fake TrainerService so we can control difficulty
  class FakeTrainerService {
    private diff$ = new BehaviorSubject<'easy'|'normal'|'hard'>('normal');
    setDifficulty(d: 'easy'|'normal'|'hard') { this.diff$.next(d); }
    getDifficulty() { return this.diff$.asObservable(); }
    getPlayerName() { return this.diff$.asObservable(); }
  }

  let fakeTrainer: FakeTrainerService;

  beforeEach(async () => {
    fakeTrainer = new FakeTrainerService();

    await TestBed.configureTestingModule({
      imports: [WheelComponent],
      providers: [{ provide: TrainerService, useValue: fakeTrainer }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a fair distribuition of chances', () => {
    const numRuns = 10000;
    const tolerance = 0.01;
    const expectedProbability = 1 / 8;

    component.items = [
      { text: '1', weight: 1, fillStyle: 'red' },
      { text: '2', weight: 1, fillStyle: 'green' },
      { text: '3', weight: 1, fillStyle: 'blue' },
      { text: '4', weight: 1, fillStyle: 'yellow' },
      { text: '5', weight: 1, fillStyle: 'orange' },
      { text: '6', weight: 1, fillStyle: 'black' },
      { text: '7', weight: 1, fillStyle: 'purple' },
      { text: '8', weight: 1, fillStyle: 'pink' }
    ];
    fixture.detectChanges();

    const results: number[] = new Array(component.items.length).fill(0);

    for (let i = 0; i < numRuns; i++) {
      const result = component.getRandomWeightedIndex();
      results[result]++;
    }

    const probabilities = results.map(result => result / numRuns);

    for (let i = 0; i < probabilities.length; i++) {
      expect(Math.abs(probabilities[i] - expectedProbability)).toBeLessThan(tolerance);
    }
  });

  it('should have a fair distribuition for large numbers of elements', () => {
    const numRuns = 100000;
    const tolerance = 0.01;
    const expectedProbability = 1 / 150;

    component.items = [];
    const possibleColors = ['red', 'green', 'blue', 'yellow', 'orange', 'black', 'purple', 'pink'];

    for (let i = 1; i <= 150; i++) {
      const color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
      component.items.push({ text: `${i}`, weight: 1, fillStyle: color });
    }
    fixture.detectChanges();

    const results: number[] = new Array(component.items.length).fill(0);
    const occurrences: number[] = new Array(component.items.length).fill(0);

    for (let i = 0; i < numRuns; i++) {
      const result = component.getRandomWeightedIndex();
      results[result]++;
      occurrences[result]++;
    }

    const probabilities = results.map(result => result / numRuns);

    const meanProbability = probabilities.reduce((sum, probability) => sum + probability, 0) / probabilities.length;
    console.log(`Mean probability: ${(meanProbability * 100).toFixed(2)}%`);
    expect(Math.abs(meanProbability - expectedProbability)).toBeLessThan(tolerance);

    for (let i = 0; i < probabilities.length; i++) {
      expect(Math.abs(probabilities[i] - expectedProbability)).toBeLessThan(tolerance);
    }
  });

  it('the distribuition should respect the weight', () => {
    const numRuns = 10000;
    const tolerance = 0.01;
    const expectedForLower = 1 / 14;
    const expectedForHigher = 1 / 2;

    component.items = [
      { text: '1', weight: 7, fillStyle: 'red' },
      { text: '2', weight: 1, fillStyle: 'green' },
      { text: '3', weight: 1, fillStyle: 'blue' },
      { text: '4', weight: 1, fillStyle: 'yellow' },
      { text: '5', weight: 1, fillStyle: 'orange' },
      { text: '6', weight: 1, fillStyle: 'black' },
      { text: '7', weight: 1, fillStyle: 'purple' },
      { text: '8', weight: 1, fillStyle: 'pink' }
    ];
    fixture.detectChanges();

    const results: number[] = new Array(component.items.length).fill(0);

    for (let i = 0; i < numRuns; i++) {
      const result = component.getRandomWeightedIndex();
      results[result]++;
    }

    const probabilities = results.map(result => result / numRuns);

    expect(Math.abs(probabilities[0] - expectedForHigher)).toBeLessThan(tolerance);

    for (let i = 1; i < probabilities.length; i++) {
      expect(Math.abs(probabilities[i] - expectedForLower)).toBeLessThan(tolerance);
    }
  });

  it('should allow manual choice when enabled', () => {
    component.items = [
      { text: 'A', weight: 1, fillStyle: 'red' },
      { text: 'B', weight: 1, fillStyle: 'green' }
    ];
    component.allowManualSelection = true;
    fixture.detectChanges();

    // force a manual selection
    component.chooseItem(1);
    // after manual selection the internal flag should be cleared and winningNumber updated
    expect((component as any).manualChoiceIndex).toBeNull();
    expect(component.winningNumber).toBe(1);
  });

  it('equalizeWeights input should make distribution uniform regardless of original weight', () => {
    const numRuns = 10000;
    const tolerance = 0.01;

    component.items = [
      { text: 'high', weight: 10, fillStyle: 'red' },
      { text: 'low', weight: 1, fillStyle: 'blue' }
    ];
    component.equalizeWeights = true;
    fixture.detectChanges();

    const results: number[] = [0, 0];
    for (let i = 0; i < numRuns; i++) {
      const r = component.getRandomWeightedIndex();
      results[r]++;
    }
    const probs = results.map(r => r / numRuns);
    expect(Math.abs(probs[0] - 0.5)).toBeLessThan(tolerance);
    expect(Math.abs(probs[1] - 0.5)).toBeLessThan(tolerance);
  });

  it('should adjust weight impact when difficulty changes', () => {
    const numRuns = 20000;
    const tolerance = 0.02;

    // larger weight difference; on easy difficulty probabilities should be closer
    component.items = [
      { text: 'heavy', weight: 100, fillStyle: 'red' },
      { text: 'light', weight: 1, fillStyle: 'blue' }
    ];
    fixture.detectChanges();

    // normal difficulty uses sqrt, heavy should have some advantage
    fakeTrainer.setDifficulty('normal');
    fixture.detectChanges();

    const resultsNorm = [0, 0];
    for (let i = 0; i < numRuns; i++) {
      const r = component.getRandomWeightedIndex();
      resultsNorm[r]++;
    }

    // easy difficulty uses cbrt, so distribution should be more balanced
    fakeTrainer.setDifficulty('easy');
    fixture.detectChanges();

    const resultsEasy = [0, 0];
    for (let i = 0; i < numRuns; i++) {
      const r = component.getRandomWeightedIndex();
      resultsEasy[r]++;
    }

    const probNormHeavy = resultsNorm[0] / numRuns;
    const probEasyHeavy = resultsEasy[0] / numRuns;
    expect(probEasyHeavy).toBeLessThan(probNormHeavy + tolerance);
  });
});
