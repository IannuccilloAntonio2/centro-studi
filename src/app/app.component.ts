import { Component } from '@angular/core';
import {Subscription} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {PrimeNGConfig} from "primeng/api";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  lang: string = "it";
  subscription: Subscription;
  title = 'centro-studi';
  constructor(protected translate: TranslateService, protected config: PrimeNGConfig) {
    translate.addLangs(['it']);
    translate.setDefaultLang('it');

    const browserLang = translate.getBrowserLang();
    let lang = 'it';
    this.changeLang(lang);
    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }
}
