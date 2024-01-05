import { fakeAsync, flush, flushMicrotasks } from "@angular/core/testing";

describe("Describe async test example", () => {
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
  fit("Asynchronous test example- plain example", fakeAsync(() => {
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
});
