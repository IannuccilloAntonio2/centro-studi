import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrariComponent } from './pages/orari/orari.component';
import { NuovoCorsoComponent } from './pages/nuovo-corso/nuovo-corso.component';
import { ListaCorsiComponent } from './pages/lista-corsi/lista-corsi.component';
import {RouterModule} from "@angular/router";
import {ChartModule} from "primeng/chart";
import {DividerModule} from "primeng/divider";
import {TableModule} from "primeng/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {MultiSelectModule} from "primeng/multiselect";
import {DialogModule} from "primeng/dialog";
import {NgxSpinnerModule} from "ngx-spinner";
import {MessagesModule} from "primeng/messages";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastModule} from "primeng/toast";
import {InputMaskModule} from "primeng/inputmask";
import {AccordionModule} from "primeng/accordion";
import {CheckboxModule} from "primeng/checkbox";
import {ChipModule} from "primeng/chip";
import {BadgeModule} from "primeng/badge";
import {FileUploadModule} from "primeng/fileupload";
import {ColorPickerModule} from "primeng/colorpicker";
import {InputNumberModule} from "primeng/inputnumber";
import {PasswordModule} from "primeng/password";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {MessageModule} from "primeng/message";
import {StepsModule} from "primeng/steps";
import {TagModule} from "primeng/tag";
import {DataViewModule} from "primeng/dataview";
import {OrderListModule} from "primeng/orderlist";
import {TooltipModule} from "primeng/tooltip";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import {MarkAsteriskDirective, MarkAsteriskDirectiveModule} from "./mark-asterisk.directive";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {AutoCompleteModule} from "primeng/autocomplete";
import {UserAliasPipe} from "./mock/user-aslias.pipe";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { TasseComponent } from './pages/tasse/tasse.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {datePipe} from "./mock/date-pipe.pipe";
import { ListaTasseComponent } from './pages/lista-tasse/lista-tasse.component';
import {registerLocaleData} from "@angular/common";
import it from '@angular/common/locales/it';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {KnobModule} from "primeng/knob";

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [
    AppComponent,
    OrariComponent,
    NuovoCorsoComponent,
    ListaCorsiComponent,
    UserAliasPipe,
    TasseComponent,
    DashboardComponent,
    datePipe,
    ListaTasseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    DividerModule,
    TableModule,
    TagModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    MarkAsteriskDirectiveModule,
    InputTextModule,
    CalendarModule,
    MultiSelectModule,
    DialogModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MessagesModule,
    ProgressSpinnerModule,
    ToastModule,
    InputMaskModule,
    ConfirmPopupModule,
    CheckboxModule,
    ChipModule,
    AccordionModule,
    BadgeModule,
    MessageModule,
    FileUploadModule,
    ColorPickerModule,
    InputNumberModule,
    PasswordModule,
    HttpClientModule,
    //RxReactiveFormsModule,
    StepsModule,
    DataViewModule,
    OrderListModule,
    TooltipModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    BrowserAnimationsModule,
    DividerModule,
    OverlayPanelModule, RippleModule, ToastModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), KnobModule
  ],
  providers: [TranslateService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
