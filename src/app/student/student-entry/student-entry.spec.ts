import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEntry } from './student-entry';

describe('StudentEntry', () => {
  let component: StudentEntry;
  let fixture: ComponentFixture<StudentEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
