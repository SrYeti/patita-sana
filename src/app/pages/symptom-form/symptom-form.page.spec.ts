import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SymptomFormPage } from './symptom-form.page';

describe('SymptomFormPage', () => {
  let component: SymptomFormPage;
  let fixture: ComponentFixture<SymptomFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SymptomFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
