import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

import { TabsModule } from './tabs/tabs.module';

import { ChatRoutingModule } from './chat-routing.module';

import { IndexComponent } from './index/index.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import {DevExtremeModule, DxDropDownButtonModule, DxScrollViewModule} from 'devextreme-angular';
import {DxPopupModule,
        DxLoadPanelModule
} from 'devextreme-angular';
import {  NgxEmojiPickerModule  } from 'ngx-emoji-picker';
import { HoldableDirective } from './index/holdable.directive';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AngularInputFocusModule } from 'angular-input-focus';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  declarations: [IndexComponent, ProfileDetailComponent, HoldableDirective],
  imports: [
    FormsModule,
    PerfectScrollbarModule,
    NgbAccordionModule,
    CommonModule,
    ChatRoutingModule,
    TabsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    TranslateModule,
    DevExtremeModule,
    DxPopupModule,
    DxLoadPanelModule,
    NgxEmojiPickerModule,
    DxDropDownButtonModule,
    ClipboardModule,
    NgxSpinnerModule,
    AngularInputFocusModule,
    DxScrollViewModule
  ],
  exports: [ProfileDetailComponent, HoldableDirective],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ChatModule { }
