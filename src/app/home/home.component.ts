import { NgForOf } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";

export interface Demo {
  name: string;
  routerLink: string;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  imports: [RouterModule, NgForOf],
})
export class HomeComponent {
  demos: Demo[];

  constructor(router: Router) {
    this.demos = router.config
      .filter((r) => r.data && r.data.demo)
      .map((r) => ({
        name: r.data.name,
        routerLink: r.path,
      }));
  }
}
