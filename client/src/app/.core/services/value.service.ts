import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class ValueService {

  constructor(private _http: HttpClient) { }

  GetValues(): Observable<string[]> {
    const url = environment.apiUrl + 'values';
    return this._http.get<string[]>(url);
  }
}
