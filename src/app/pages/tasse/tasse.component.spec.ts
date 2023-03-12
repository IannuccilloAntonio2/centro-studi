import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasseComponent } from './tasse.component';

describe('TasseComponent', () => {
  let component: TasseComponent;
  let fixture: ComponentFixture<TasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
