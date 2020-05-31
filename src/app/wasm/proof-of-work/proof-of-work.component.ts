import { Component, NgZone, AfterViewInit, OnDestroy } from "@angular/core";
import { EmscriptenWasmComponent } from "../emscripten-wasm.component";

export interface Proof {
  success: boolean;
  iterations: number;
  hash: string;
}

export interface StatisticsItem {
  timeTaken: number;
  iterations: number;
  leadingZeros: number;
}

const sortStatisticsItems = (a: StatisticsItem, b: StatisticsItem) => a.leadingZeros - b.leadingZeros;

@Component({
  templateUrl: "./proof-of-work.component.html",
  styleUrls: ["./proof-of-work.component.css"],
})
export class WasmProofOfWorkComponent extends EmscriptenWasmComponent implements AfterViewInit, OnDestroy {
  input: string;
  leadingZeros: number;
  proof: Proof;
  error: string;
  isWorking: boolean;
  statisticsItems: StatisticsItem[];
  private startTime: number;

  constructor(private ngZone: NgZone) {
    super("ProofOfWorkModule", "proof-of-work.js");

    this.leadingZeros = 1;
    this.statisticsItems = [];

    this.moduleDecorator = (mod) => {
      mod.printErr = (what: string) => {
        if (what && what.startsWith && !what.startsWith("WARNING")) {
          ngZone.run(() => (this.error = what));
        }

        console.log(what);
      };
    };
  }

  ngAfterViewInit() {
    // This will be called from our Emscripten injected library
    window["onProofOfWorkDone"] = (result: number, iterations: number, hash: string) => {
      this.ngZone.run(() => this.onProofOfWorkDone(result, iterations, hash));
    };
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    delete window["onProofOfWorkDone"];
  }

  get canFindSolution() {
    return this.leadingZeros >= 1 && this.leadingZeros <= 9 && !!this.input;
  }

  findSolution() {
    if (!this.canFindSolution) {
      return;
    }

    this.proof = null;
    this.isWorking = true;
    this.startTime = performance.now();
    this.module.ccall("do_proof_of_work", null, ["string", "number"], [this.input, this.leadingZeros], { async: true });
  }

  private onProofOfWorkDone(result: number, iterations: number, hash: string) {
    this.isWorking = false;
    this.proof = { success: !result, iterations, hash };

    const endTime = performance.now();
    const timeTaken = endTime - this.startTime;

    this.statisticsItems.push({ leadingZeros: this.leadingZeros, iterations, timeTaken });
    this.statisticsItems.sort(sortStatisticsItems);
  }
}
