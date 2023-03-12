import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrariComponent} from "./pages/orari/orari.component";
import {ListaCorsiComponent} from "./pages/lista-corsi/lista-corsi.component";
import {TasseComponent} from "./pages/tasse/tasse.component";

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
    path: 'tasse',
    component: TasseComponent

  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
