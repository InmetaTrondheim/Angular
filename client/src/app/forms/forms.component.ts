import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  regForm: FormGroup;
  isLinear = false;
  identityFormGroup: FormGroup;
  questionsFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.identityFormGroup = this._formBuilder.group({
      name: ['', Validators.required]
    });
    this.questionsFormGroup = this._formBuilder.group({
      food: ['', Validators.required]
    });

    this.regForm = this._formBuilder.group({
      identityFormGroup: this.identityFormGroup,
      questionsFormGroup: this.questionsFormGroup
    })
  }
}
