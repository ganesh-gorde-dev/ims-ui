import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagmentHomeComponent } from './role-managment-home.component';

describe('RoleManagmentHomeComponent', () => {
  let component: RoleManagmentHomeComponent;
  let fixture: ComponentFixture<RoleManagmentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleManagmentHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleManagmentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
