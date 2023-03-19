import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTasseComponent } from './lista-tasse.component';

describe('ListaTasseComponent', () => {
  let component: ListaTasseComponent;
  let fixture: ComponentFixture<ListaTasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTasseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
