import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRoster } from './course-roster';

describe('CourseRoster', () => {
  let component: CourseRoster;
  let fixture: ComponentFixture<CourseRoster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseRoster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseRoster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
