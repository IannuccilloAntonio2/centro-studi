import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrariComponent} from "./pages/orari/orari.component";
import {ListaCorsiComponent} from "./pages/lista-corsi/lista-corsi.component";
import {TasseComponent} from "./pages/tasse/tasse.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {ListaTasseComponent} from "./pages/lista-tasse/lista-tasse.component";

const routes: Routes = [
  {
    path: '',
    component: OrariComponent

  },
  {
    path: 'corsi',
    component: ListaCorsiComponent

  },
  {
    path: 'nuova-tassa',
    component: TasseComponent

  },
  {
    path: 'tasse',
    component: ListaTasseComponent

  },
  {
    path: 'dashboard',
    component: DashboardComponent

  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
