import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { combineLatest, of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";
import { map } from "rxjs/operators";
import { doesNotReject } from "assert";

const BEGINNER_COURSES = of(
  setupCourses().filter((course) => course.category === "BEGINNER")
);
const ADVANCED_COURSES = of(
  setupCourses().filter((course) => course.category === "ADVANCED")
);
describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let debugElement: DebugElement;
  let courseService: CoursesService;
  let courseServiceSpy: any;
  beforeEach(async(() => {
    courseServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);
    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: courseServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        courseService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    courseServiceSpy.findAllCourses.and.returnValue(BEGINNER_COURSES);
    fixture.detectChanges();
    const tabs = debugElement.queryAll(By.css(".mdc-tab__text-label"));
    expect(tabs.length).toBe(1, "unexpected number of tabs");
  });

  it("should display only advanced courses", () => {
    courseServiceSpy.findAllCourses.and.returnValue(ADVANCED_COURSES);
    fixture.detectChanges();
    const tabs = debugElement.queryAll(By.css(".mdc-tab__text-label"));
    expect(tabs.length).toBe(1, "unexpected number of tabs");
  });

  it("should display both tabs", () => {
    courseServiceSpy.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = debugElement.queryAll(By.css(".mdc-tab__text-label"));
    expect(tabs.length).toBe(2, "unexpected number of tabs");
  });

  it("should display advanced courses when tab clicked", (done) => {
    courseServiceSpy.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const advancedTabs = debugElement.queryAll(By.css(".mdc-tab__text-label"));
    advancedTabs[1].nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const advancedTabHeaders = debugElement.queryAll(
        By.css(".mat-mdc-tab-body-active .mat-mdc-card-header")
      );
      expect(advancedTabHeaders.length).toBeGreaterThan(0);
      expect(advancedTabHeaders[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
      done();
    });
  });
});
