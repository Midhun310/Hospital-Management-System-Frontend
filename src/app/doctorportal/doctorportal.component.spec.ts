import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorportalComponent } from './doctorportal.component';

describe('DoctorportalComponent', () => {
  let component: DoctorportalComponent;
  let fixture: ComponentFixture<DoctorportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorportalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
