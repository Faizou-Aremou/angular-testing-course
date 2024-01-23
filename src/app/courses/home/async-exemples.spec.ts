import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from 'rxjs/operators';

xdescribe("Describe async test example", () => {
  it("Asynchronous test example", (done) => {
    let test = false;
    setTimeout(() => {
      console.log("running assertions");
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it("Asynchronous test using setTimeout", fakeAsync(() => {
    let test = false;
    setTimeout(() => {});
    setTimeout(() => {
      console.log("running assertions");
      test = true;
    }, 1000);
    flush();
    expect(test).toBeTruthy();
  }));
  it("Asynchronous test example- plain example", fakeAsync(() => {
    let test = false;
    console.log("creating promise");
    Promise.resolve().then(() => {
      console.log("Promise evaluated successfully");
      test = true;
      return Promise.resolve().then(() => {
        console.log("Second then block Promise evaluated succesfully");
      });
    });
    flushMicrotasks();
    console.log("Running test assertions");
    expect(test).toBeTruthy();
  }));
  it("Asynchronous test example - Promise + setTimeout()", fakeAsync(() => {
    let counter = 0;
    Promise.resolve().then(() => {
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });
    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(11);
  }));

  it("test observables", fakeAsync(() => {
    let test = false;
    console.log("creating observable");
    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => {
      test = true;
    });
    console.log("running test assertions");
    tick(1000);
    expect(test).toBeTruthy();
  }));
});
