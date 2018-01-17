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
    app.UseCors(builder => builder.WithOrigins("http://localhost:4200"));
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
