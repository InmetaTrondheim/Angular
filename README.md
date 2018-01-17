# Angular
This project is intended to be a learning platform for Angular web solutions.

# Steps
## 1 Clone GIT repository (I'm using the Desktop GitHub app)
## 2 Instantiate a new angular application
```console
ng new client
cd client
ng s
```
Open `localhost:4200` in preffered web browser.

## 3 Instantiate a new DotNet Core web-api application.

Go up to the root directory `cd ..`

Create a new web-api project with the following code
```console
mkdir webapi
cd webapi
dotnet new webapi
```
Press `F5` in studio code.

Select .NET Core

Press `F5` again.

Navigate to `http://localhost:5000/api/values`
It should read: `["value1","value2"]`

For simplicity we shall install dotnet watch, so our app will recompile on filechange simular to `ng serve`.
### Add a `Microsoft.DotNet.Watcher.Tools` package reference to the .csproj file:


```xml
<ItemGroup>
    <DotNetCliToolReference Include="Microsoft.DotNet.Watcher.Tools" Version="2.0.0" />
</ItemGroup> 
```
### Install the `Microsoft.DotNet.Watcher.Tools` package by running the following command:
```console
dotnet restore
```
### Execute the command by running
```console
dotnet watch run
```
Everytime a dotnet project file is changed, webapi will recompile for you.

# Lets start by reading data from webapi to Angular.
For this we will create a new service to read and write data to a webapi controller.

We will create a new component to show the data.

While the watch command is running, open a new command window in Visual Studio Code.
Start Angular:
```console
ng s
```
Open another command window.
```console
cd client
ng generate component values
ng generate service .core/services/value
```

Import ValueService and add it as provider. It can be added as a global provider in `app.module.ts` if you need to share the instance between components.
```javascript
import { ValueService } from '../.core/services/value.service'

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css'],
  providers: [ValueService]
})
```
Inject the service in the controller.
```javascript
constructor(private _valueService: ValueService) { }
```

In ngOnInit instantiate a call to the service for the values:
```javascript
  ngOnInit() {
    this._valueService.GetValues().subscribe(val => this.values = val);
  }
```
Create this.values property.

The final code will look like this:
```javascript
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
  }

}
```

Add apiUrl to environments (would not recommend this in production, but for this scenario its ok).
Do it to both environment files. They should be under a folder named environments
```javascript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/'
};
```

For the service to work, we must inject HttpClient and call the correct url: `http://localhost:5000/api/values`, the value.service.ts file should look like this:
```javascript
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
```

We need to tell Angular that ValueService is providing a service for us; getting data. To do that we must add ValueService as a provider in `app.module.ts`.

Before we can use HttpClient, we must import the HttpModule into our application.
The `app.module.ts` should look like this:
```javascript
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

```

# Presenting data from the webapi
Delete everything in `app.component.html` and just add reference to our Value.component.html view `<app-values></app-values>`.
The file should look like this:
```html
<app-values></app-values>
```
When you save now the website should say `values works!`.

But we want to see the values.
To get data from a `component.ts` model we're using mustache brackets `{{ data }}`. Our backend model is a list of strings named values, so we need to traverse that list and print out each element. To iterate in Angular we must call a directive named `*ngIf`.

In `values.component.html` remove existing code (if you like) and paste in the following
```html
<p *ngFor="let value of values">{{ value }}</p>
```
> **INFO** *If you haven't already, you must close `ng s` and start it again after adding a new property to the `environment.ts` file. The Webapi will also not like to recieve calls from an unknown entity (our angular app), so we must enable CORS for our site `(http://localhost:4200)`.*

### To add CORS to the webapi project open `Startup.cs` and add `AddCors()` in `ConfigureServices()`
```Csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc();
    services.AddCors();
}
```
And allow `http://localhost:4200` with `app.UseCors(builder => builder.WithOrigins("http://localhost:4200"));`
```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    app.UseCors(builder => builder.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod());
    app.UseMvc();
}
```

# Lets route this application up!
From now on the examples will be in bigger chunks.
Lets create a nav bar where all our functionality is available in a drop down menu 🤗

### Step 1 - install Angular Materials
Install Angular Materials with animation.
```console
npm install --save @angular/material @angular/cdk
npm install --save @angular/animations
```
### Step 2 - Import Materials component modules
```javascript
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [MatToolbarModule, BrowserAnimationsModule, MatButtonModule],
  ...
})
export class AppModule { }
```
### Step 3 - Include a material theme
Add this to our `styles.css`
```css
@import "~@angular/material/prebuilt-themes/pink-bluegrey.css";
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
```
Style our `style.css`
```css
...
.example-fill-remaining-space {
    flex: 1 1 auto;
}

body {
    margin:0;
    font-family: 'Roboto', sans-serif;
    background: #fafafa;
}
```

### Step 4 - Include material icons
Add `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">` To `index.html`.

### Step 5 - Create our navbar in `app.component.ts`:
```html
<mat-toolbar color="primary">
    <span>Angular learning app</span>
    <span class="example-fill-remaining-space"></span>
    <a mat-button>Values</a>
</mat-toolbar>
```
### Step 6 - Create a homecomponent
```console
ng generate component home -skip-import
```
Add it to `app.module.ts`
```javascript
...
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [HomeComponent],
    ...
})
export class AppModule { }

```
### Step 7 - Add routing functionality
Create a new file inside app `app.routing.module.ts`
```javascript
import { RouterModule, Routes } from '@angular/router';
import { ValuesComponent } from "./values/values.component";
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'values', component: ValuesComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}
```
Import `AppRoutingModule` to `app.module.ts`
```javascript
...
import { AppRoutingModule } from './app.routing.module';

@NgModule({
    ...
    imports: [AppRoutingModule]
    ...
})
export class AppModule { }
```

### Step 8 - Update `app.module.html`
```html
<mat-toolbar color="primary">
    <span>Angular learning app</span>

    <!-- This fills the remaining space of the current row -->
    <span class="example-fill-remaining-space"></span>

    <a mat-button [routerLink]="['/']">Home</a>
    <a mat-button [routerLink]="['/values']">Values</a>
</mat-toolbar>
<router-outlet></router-outlet>
```

# Lets form this app up
## Forms intro
### 1 - Create a new form component and add it to `app.module.ts`
```console
ng generate component form
```
### 2 - Import Angular forms modules
My prefered flavor is reactive forms, so let import modules for that into `app.module.ts`
```javascript
...
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  ...
  imports: [FormsModule, ReactiveFormsModule ]
  ...
})
export class AppModule { }
```
### 3 - Import Formbuilder into `form.component.ts`
Import the formbuilder and build up your form. We're starting with five simple input directives.
```javascript
...
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
...
```
And the `form.component.html`
```html
<div class="container">
    <mat-card>
        <mat-card-content>
            <form [formGroup]="ourFormGroup" class="example-full-width">
              <mat-form-field class="example-form">
                <input matInput type="text" formControlName="firstName" placeholder="First name">
              </mat-form-field>
              <mat-form-field class="example-form">
                <input matInput type="text" formControlName="lastName" placeholder="Sur name">
              </mat-form-field>
              <mat-form-field class="example-form">
                <input matInput type="text" formControlName="address" placeholder="Street Adress">
              </mat-form-field>
              <mat-form-field class="example-form">
                <input matInput type="text" formControlName="country" placeholder="Country of residency">
              </mat-form-field>
              <mat-form-field class="example-form">
                <input matInput type="text" formControlName="favorite_food" placeholder="Your favorite food">
              </mat-form-field>
              </form>
        </mat-card-content>
    </mat-card>
</div>
```
## More complex form
Create a new component named `forms` and add it to `app.module.ts`.
Add it to routes.
```javascript
const appRoutes: Routes = [
   ...
    { path: 'forms', component: FormsComponent}
   ...
]
```
Add router link in navbar:
```html
    <a mat-button [routerLink]="['/forms']">Forms</a>
```

Import `MatStepperModule` and `MatCardModule`.

```javascript
...
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  ...
  imports: [MatStepperModule, MatCardModule, MatInputModule]
})
export class AppModule { }
```

Create two new components inside `forms` and import them into `app.module.ts`
```console
ng generate component forms/food -skip-import
ng generate component forms/name -skip-import
ng generate component forms/done -skip-import
```

#### `forms.component.html`
```html
<div class="container">
    <button mat-raised-button (click)="isLinear = true" id="toggle-linear">Enable linear mode</button>

  <mat-horizontal-stepper [linear]="isLinear">
      <mat-step [stepControl]="identityFormGroup">
        <ng-template matStepLabel>Fill out your name</ng-template>
        <app-name [identityFormGroup]="identityFormGroup"></app-name>
      </mat-step>
      <mat-step [stepControl]="questionsFormGroup">
        <ng-template matStepLabel>Fill out your favorite food</ng-template>
        <app-food [questionsFormGroup]="questionsFormGroup"></app-food>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Done</ng-template>
        <app-done [regForm]="regForm"></app-done>
      </mat-step>
    </mat-horizontal-stepper>
</div>
```
#### `forms.component.ts`
```javascript
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
```
#### `name.component.html`
```html
<form [formGroup]="identityFormGroup">
    <mat-form-field>
      <input matInput placeholder="First name" formControlName="name" required>
    </mat-form-field>
    <div>
      <button mat-button matStepperNext>Next</button>
    </div>
  </form>
```
#### `name.component.ts`
```javascript
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css']
})
export class NameComponent implements OnInit {

  @Input() identityFormGroup: FormGroup
  constructor() { }

  ngOnInit() {
  }

}
```
#### `food.component.html`
```html
<form [formGroup]="questionsFormGroup">
    <mat-form-field>
      <input matInput placeholder="Food" formControlName="food" required>
    </mat-form-field>
    <div>
      <button mat-button matStepperPrevious>Back</button>
      <button mat-button matStepperNext>Next</button>
    </div>
  </form>
```
#### `food.component.ts`
```javascript
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  @Input() questionsFormGroup: FormGroup
  constructor() { }

  ngOnInit() {
  }

}
```
#### `done.component.html`
```html
You are now done.

<p>
    <b>Name: </b> {{ name }}
</p>
<p>
    <b>Food: </b> {{ food }}
</p>
<pre>{{ regForm.value | json }}</pre>
<div>
  <button mat-button (click)="sendForm()">Send</button>
</div>

<div *ngIf="result">
  <pre>{{ result | json }}</pre>
</div>
```
#### `done.component.ts`
```javascript
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
```

#### `value.service.ts`
```javascript
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

  send(form: any): Observable<any> {
    const url = environment.apiUrl + 'values';
    return this._http.post<any>(url, form);
  }
}
```

#### `ValuesController.cs`
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public IActionResult Post([FromBody]ValuesDto values)
        {
            values.IdentityFormGroup.Name = values.IdentityFormGroup.Name.ToUpper();
            values.QuestionsFormGroup.Food = values.QuestionsFormGroup.Food.ToUpper();
            return Ok(values);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
    public class ValuesDto{
        public IdentityFormGroup IdentityFormGroup {get;set;}
        public QuestionsFormGroup QuestionsFormGroup {get;set;}
    }
    public class IdentityFormGroup{
        public string Name {get;set;}
    }
    public class QuestionsFormGroup{
            public string Food {get;set;}
        }
}
```