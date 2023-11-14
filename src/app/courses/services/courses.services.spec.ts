import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { COURSES, LESSONS } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

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
    testReq.flush({ ...COURSES[12], titles: changes.titles });
  });

  it("should give an error if save course fails", () => {
    const id = 12;
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };
    coursesService.saveCourse(id, changes).subscribe(
      () => fail("the save course operation should have failed"),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const testReq = httpTestingController.expectOne("/api/courses/" + id);
    expect(testReq.request.method).toBe("PUT");
    testReq.flush("Save course fail", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });
  it("should find lesson in the course data", () => {
    const params = {
      courseId: 12,
      filter: "",
      sortOrder: "asc",
      pageNumber: 0,
      pageSize: 3,
    };

    const lessons = Object.values(LESSONS).filter(
      (lesson) => lesson.courseId === 12
    );
    coursesService.findLessons(params.courseId).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(lessons.length);
    });

    const testReq = httpTestingController.expectOne(
      "/api/lessons?courseId=12&filter=&sortOrder=asc&pageNumber=0&pageSize=3"
    );
    expect(testReq.request.method).toBe("GET");
    testReq.flush(lessons);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
});
