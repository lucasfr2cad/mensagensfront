import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { TabsModule } from './tabs/tabs.module';

import { ChatRoutingModule } from './chat-routing.module';

import { IndexComponent } from './index/index.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import {DevExtremeModule} from 'devextreme-angular';
import {DxPopupModule,
        DxLoadPanelModule
} from 'devextreme-angular';
import {  NgxEmojiPickerModule  } from 'ngx-emoji-picker';


@NgModule({
  declarations: [IndexComponent, ProfileDetailComponent],
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
  ],
  exports: [ProfileDetailComponent]
})
export class ChatModule { }
