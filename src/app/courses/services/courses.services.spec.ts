import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned");
      expect(courses.length).toBe(12, "incorrect number of courses");
      const course = courses.find((course) => course.id === 12);
      expect(course).toBeTruthy("course item 12 not returned");
    });
    const testReq = httpTestingController.expectOne("/api/courses");
    expect(testReq.request.method).toBe("GET");
    testReq.flush({ payload: Object.values(COURSES) });
  });
  it("Should find a course by id", () => {
    const id = 12;
    coursesService.findCourseById(id).subscribe((course) => {
      expect(course).toBeTruthy("No courses returned");
      expect(course.id).toBe(id, "incorrect id");
    });
    const testReq = httpTestingController.expectOne("/api/courses/" + id);
    expect(testReq.request.method).toBe("GET");
    testReq.flush(COURSES[12]);
  });

  it("Should save the course data", () => {
    const id = 12;
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };
    coursesService.saveCourse(id, changes).subscribe((course) => {
      expect(course).toBeTruthy("No course returned");
      expect(course.id).toBe(id, "incorrect id");
    });
    const testReq = httpTestingController.expectOne("/api/courses/" + id);
    expect(testReq.request.method).toBe("PUT");
    expect(testReq.request.body.titles.description).toBe(
      changes.titles.description
    );
    testReq.flush({...COURSES[12], titles:changes.titles});
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
