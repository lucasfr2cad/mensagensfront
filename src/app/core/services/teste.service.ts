import {Component, Inject, PLATFORM_ID, Injector} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { PushNotificationsService } from 'ng-push-ivy';


@Component({})
export class ExampleComponent {
    private _push:PushNotificationsService;

    constructor(
        @Inject(PLATFORM_ID) platformId: string,
        private injector: Injector,
    ) {
        if (isPlatformBrowser(platformId)) {
            //inject service only on browser platform
            this._push = this.injector.get(PushNotificationsService);
        }
    }
}
