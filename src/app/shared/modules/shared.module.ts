import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { DetailsUserComponent } from '../components/details-user/details-user.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DatePickerComponent } from '../components/form_controls/datePicker/datePicker.component';
import { DetailTextComponent } from '../components/form_controls/detail-text/detail-text.component';
import { FormActionsComponent } from '../components/form_controls/form-actions/form-actions.component';
import { InputComponent } from '../components/form_controls/input/input.component';
import { SelectComponent } from '../components/form_controls/select/select.component';
import { TextareaComponent } from '../components/form_controls/textarea/textarea.component';
import { GridActionsRenderer } from '../components/grid/grid-actions/grid-actions.component';
import { GridLoaderComponent } from '../components/grid/grid-loader/grid-loader.component';
import { GridComponent } from '../components/grid/grid.component';
import { LoadingIconComponent } from '../components/loading-icon/loading-icon.component';
import { PageNotFoundComponent } from '../components/page-not-found/page.not.found.component';
import { FileExtensionDirective } from '../validators/file_extension.validator';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    NgSelectModule,
    AgGridModule,
    MaterialModule,
    AppRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [
    InputComponent,
    TextareaComponent,
    SelectComponent,
    DatePickerComponent,
    PageNotFoundComponent,
    FormActionsComponent,
    LoadingIconComponent,
    DetailTextComponent,
    DetailsUserComponent,
    GridComponent,
    GridLoaderComponent,
    GridActionsRenderer,
    DialogComponent,
    FileExtensionDirective,
  ],
  exports: [
    InputComponent,
    TextareaComponent,
    SelectComponent,
    DatePickerComponent,
    PageNotFoundComponent,
    FormActionsComponent,
    LoadingIconComponent,
    DetailTextComponent,
    DetailsUserComponent,
    GridComponent,
    GridLoaderComponent,
    GridActionsRenderer,
    DialogComponent,
  ],
})
export class SharedModule {}
