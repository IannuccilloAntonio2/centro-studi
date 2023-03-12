import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovoCorsoComponent } from './nuovo-corso.component';

describe('NuovoCorsoComponent', () => {
  let component: NuovoCorsoComponent;
  let fixture: ComponentFixture<NuovoCorsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuovoCorsoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuovoCorsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
