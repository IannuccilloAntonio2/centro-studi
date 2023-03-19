import {Pipe, PipeTransform} from "@angular/core";
import {User} from "./user";


@Pipe({
  name: 'dateAlias'
})
export class datePipe implements PipeTransform {
    transform(id: number,) {
      let name = ''
      switch (id){
        case 1:
          name = 'Gennaio'
          break;
        case 2:
          name = 'Febbraio'
          break;
        case 3:
          name = 'Marzo'
          break;
        case 4:
          name = 'Aprile'
          break;
        case 5:
          name = 'Maggio'
          break;
        case 6:
          name = 'Giugno'
          break;
        case 7:
          name = 'Luglio'
          break;
        case 8:
          name = 'Agosto'
          break;
        case 9:
          name = 'Settembre'
          break;
        case 10:
          name = 'Ottobre'
          break;
        case 11:
          name = 'Novembre'
          break;
        case 12:
          name = 'Dicembre'
          break;
      }
      return name;
  }
}
