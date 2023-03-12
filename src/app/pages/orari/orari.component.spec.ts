import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrariComponent } from './orari.component';

describe('OrariComponent', () => {
  let component: OrariComponent;
  let fixture: ComponentFixture<OrariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrariComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
