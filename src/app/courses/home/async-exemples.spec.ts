import { fakeAsync, flush, tick } from "@angular/core/testing";
import { doesNotReject } from "assert";

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
});
