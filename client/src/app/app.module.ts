import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ValuesComponent } from './values/values.component';
import { ValueService } from './.core/services/value.service';


@NgModule({
  declarations: [
    AppComponent,
    ValuesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ValueService],
  bootstrap: [AppComponent]
})
export class AppModule { }
