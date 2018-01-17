import { RouterModule, Routes } from '@angular/router';
import { ValuesComponent } from "./values/values.component";
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { FormsComponent } from './forms/forms.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'values', component: ValuesComponent},
    { path: 'forms', component: FormsComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}