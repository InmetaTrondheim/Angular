import { Component, OnInit } from '@angular/core';
import { ValueService } from '../.core/services/value.service'

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css'],
  providers: [ValueService]
})
export class ValuesComponent implements OnInit {
  values: string[];

  constructor(private _valueService: ValueService) { }

  ngOnInit() {
    this._valueService.GetValues().subscribe(val => this.values = val);
    console.log(this.values)
  }

}
