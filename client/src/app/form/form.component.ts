import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  ourFormGroup: FormGroup;
  panelOpenState: boolean = false;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.ourFormGroup = this._fb.group({
      firstName: [''],
      lastName: [''],
      address: [''],
      country: [''],
      favorite_food: ['']
    })
  }

}
