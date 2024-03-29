import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { FormErrorsComponent } from "./form-errors/form-errors.component";
import { ClaimAccessDirective } from "../core/directives/claim-access.directive";
import { StepsModule } from "primeng/steps";
import { CardModule } from "primeng/card";
import { TooltipModule } from "primeng/tooltip";
import { FileUploadModule } from "primeng/fileupload";
import { TabMenuModule } from "primeng/tabmenu";
import { DataViewModule } from "primeng/dataview";
import { ChipModule } from "primeng/chip";
import { ProgressBarModule } from "primeng/progressbar";
import { PasswordModule } from "primeng/password";
import { InputTextareaModule } from "primeng/inputtextarea";
import { AutoCompleteModule } from "primeng/autocomplete";
import { InputSwitchModule } from "primeng/inputswitch";
import { ToggleButtonModule } from "primeng/togglebutton";
import { CalendarModule } from "primeng/calendar";
import { LengthPipe } from "../core/pipes/length.pipe";
import { TreeSelectModule } from "primeng/treeselect";

@NgModule({
  declarations: [FormErrorsComponent, ClaimAccessDirective, LengthPipe],
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    CascadeSelectModule,
    BreadcrumbModule,
    DropdownModule,
    ToolbarModule,
    StepsModule,
    CardModule,
    TooltipModule,
    FileUploadModule,
    TabMenuModule,
    DataViewModule,
    ChipModule,
    ProgressBarModule,
    PasswordModule,
    InputTextareaModule,
    AutoCompleteModule,
    InputSwitchModule,
    ToggleButtonModule,
    CalendarModule,
    TreeSelectModule,
  ],

  exports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    CascadeSelectModule,
    BreadcrumbModule,
    DropdownModule,
    ToolbarModule,
    FormErrorsComponent,
    ClaimAccessDirective,
    StepsModule,
    CardModule,
    TooltipModule,
    FileUploadModule,
    TabMenuModule,
    DataViewModule,
    ChipModule,
    ProgressBarModule,
    PasswordModule,
    InputTextareaModule,
    AutoCompleteModule,
    InputSwitchModule,
    ToggleButtonModule,
    CalendarModule,
    LengthPipe,
    TreeSelectModule,
  ],
})
export class SharedModule {}
