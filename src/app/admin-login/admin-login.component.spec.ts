import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdminLoginComponent } from './admin-login.component';
import { AdminService } from '../services/admin-service/admin.service';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;
  let adminService: AdminService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdminLoginComponent, TranslateModule.forRoot()],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully with correct credentials', () => {
    spyOn(adminService, 'login').and.returnValue(true);
    component.username = 'igroda';
    component.password = '1310';
    component.submit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should show error with wrong credentials', () => {
    spyOn(adminService, 'login').and.returnValue(false);
    component.username = 'foo';
    component.password = 'bar';
    component.submit();
    expect(component.error).toBeTrue();
  });
});