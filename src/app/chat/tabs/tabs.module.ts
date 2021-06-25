import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbAccordionModule, NgbModalModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OrderByPipe } from '../tabs/chats/order-by.pipe';


import { ProfileComponent } from './profile/profile.component';
import { ChatsComponent } from './chats/chats.component';
import { ContactsComponent } from './contacts/contacts.component';
import { GroupsComponent } from './groups/groups.component';
import { SettingsComponent } from './settings/settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxContextMenuModule, DxDropDownButtonModule, DxLoadPanelModule, DxMenuModule } from 'devextreme-angular';
import { PushNotificationsModule } from 'ng-push-ivy';
import { AngularPageVisibilityModule } from 'angular-page-visibility';
import {NgPipesModule} from 'ngx-pipes';




const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [ProfileComponent, ChatsComponent, ContactsComponent, GroupsComponent, SettingsComponent, OrderByPipe],
  imports: [
    CarouselModule,
    CommonModule,
    NgbDropdownModule,
    NgbAccordionModule,
    PerfectScrollbarModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbCollapseModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DxContextMenuModule,
    DxDropDownButtonModule,
    DxMenuModule,
    DxLoadPanelModule,
    PushNotificationsModule,
    AngularPageVisibilityModule,
    NgPipesModule
  ],
  exports: [ProfileComponent, ChatsComponent, ContactsComponent, GroupsComponent, SettingsComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class TabsModule { }
