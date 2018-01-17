import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValueService } from '../../.core/services/value.service';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css'],
  providers: [ValueService]
})
export class DoneComponent implements OnInit {
  result: any;

  @Input() regForm: FormGroup;
  constructor(private _valueService: ValueService) { }

  ngOnInit() {
  }

  get name() {
    return this.regForm.get('identityFormGroup').get('name').value;
  }

  get food() {
    return this.regForm.get('questionsFormGroup').get('food').value;
  }

  sendForm(){
    this._valueService.send(this.regForm.value).subscribe(value => this.result = value);
  }

}
