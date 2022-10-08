import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss']
})
export class FormErrorsComponent implements OnInit {
  @Input() control!: AbstractControl;
  @Input() controlName!: string;
  @Input() max: string = '100';
  @Input() min: string = '3';


  constructor() { }

  ngOnInit(): void {
  }

}
