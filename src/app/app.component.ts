import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public translate: TranslateService) {
    translate.addLangs(['ptbr', 'en', 'es', 'it', 'ru', 'de']);
    translate.setDefaultLang('ptbr');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/ptbr|en|it|es|ru|de/) ? browserLang : 'ptbr');
  }
}
