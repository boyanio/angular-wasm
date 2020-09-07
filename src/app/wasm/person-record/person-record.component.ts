import { Component } from "@angular/core";
import { EmscriptenWasmComponent } from "../emscripten-wasm.component";

interface PersonalInfo {
  name: string;
  age: number;
}

interface Body {
  height: number;
  weight: number;
}

interface PersonRecord {
  id: number;
  avatar: string;
  personalInfo: PersonalInfo;
  body: Body;
}

interface MyEmscriptenModule extends EmscriptenModule {
  createRecord(personalInfo: PersonalInfo, body: Body): PersonRecord;
}

@Component({
  templateUrl: "./person-record.component.html",
  styleUrls: ["./person-record.component.css"],
})
export class WasmPersonRecordComponent extends EmscriptenWasmComponent<MyEmscriptenModule> {
  model: {
    personalInfo: PersonalInfo;
    body: Body;
  };
  record?: PersonRecord;

  constructor() {
    super("PersonRecordModule", "person-record.js");

    this.resetModel();
  }

  createRecord() {
    this.record = this.module.createRecord(this.model.personalInfo, this.model.body);
    this.resetModel();
  }

  private resetModel() {
    this.model = {
      personalInfo: {
        name: null,
        age: null,
      },
      body: {
        height: null,
        weight: null,
      },
    };
  }
}
