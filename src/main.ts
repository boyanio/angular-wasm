import { enableProdMode, importProvidersFrom } from "@angular/core";

import { environment } from "./environments/environment";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";
import { routes } from "./app/routes";
import { LaddaModule } from "angular2-ladda";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      LaddaModule.forRoot({
        style: "zoom-in",
        spinnerSize: 30,
      })
    ),
  ],
}).catch((err) => console.log(err));
