import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistportalComponent } from './receptionistportal.component';

describe('ReceptionistportalComponent', () => {
  let component: ReceptionistportalComponent;
  let fixture: ComponentFixture<ReceptionistportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionistportalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionistportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
