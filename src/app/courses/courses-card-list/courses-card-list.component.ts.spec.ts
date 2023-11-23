import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";
import { DebugElement } from "@angular/core";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let debugElement: DebugElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
      });
  }));
  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    const coursesData = setupCourses();
    component.courses = coursesData;
    const cardElements = debugElement.queryAll(By.css(".course-card"));
    expect(cardElements).toBeTruthy("Could not find all card Element");
    expect(cardElements.length).toBe(coursesData.length, "unexpected number of courses");
  });

  it("should display the first course", () => {
    pending();
  });
});
