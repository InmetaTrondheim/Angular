import { RouterModule, Routes } from '@angular/router';
import { ValuesComponent } from "./values/values.component";
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { FormsComponent } from './forms/forms.component';
import { FormComponent } from './form/form.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'values', component: ValuesComponent },
    { path: 'forms', component: FormsComponent },
    { path: 'form', component: FormComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}