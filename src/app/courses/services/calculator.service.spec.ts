import { CalculatorService } from "./calculator.service";
import { TestBed } from "@angular/core/testing";
import { LoggerService } from "./logger.service";
describe("CalculatorService", () => {
  let loggerSpy: any;
  let calculator: CalculatorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {
          provide: LoggerService,
          useValue: jasmine.createSpyObj("LoggerService", ["log"]), // another technique to create mock dependencies on spy context !
        },
      ],
    });
    loggerSpy = TestBed.inject(LoggerService);
    calculator = TestBed.inject(CalculatorService);
  });
  it("should add two numbers", () => {
    const result = calculator.add(2, 2);
    expect(result).toBe(4, "unexpected addition result");
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it("should subtract two numbers", () => {
    const result = calculator.subtract(2, 2);
    expect(result).toBe(0, "unexpected subtraction result");
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
