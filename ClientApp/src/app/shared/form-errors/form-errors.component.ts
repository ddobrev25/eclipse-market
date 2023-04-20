import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-form-errors",
  templateUrl: "./form-errors.component.html",
  styleUrls: ["./form-errors.component.scss"],
})
export class FormErrorsComponent implements OnInit {
  @Input() control!: AbstractControl;
  @Input() controlName!: string;
  @Input() maxLength: string = '';
  @Input() minLength?: string ;
  @Input() maxValue?: number;
  @Input() minValue?: number ;
  @Input() format?: string;

  constructor() {}

  ngOnInit(): void {
  }
}
