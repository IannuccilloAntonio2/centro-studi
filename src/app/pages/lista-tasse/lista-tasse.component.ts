import {Component, OnInit} from '@angular/core';
import {TasseService} from "../../services/tasse.service";
import {ICorsiTasse} from "../../mock/corsiTasse";
import {fadeInAnimation} from "../../animation/fade-in-animation";
import {DatePipe} from "@angular/common";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {User} from "../../mock/user";
import {CourseService} from "../../services/course-seervice.service";

@Component({
  selector: 'app-lista-tasse',
  templateUrl: './lista-tasse.component.html',
  styleUrls: ['./lista-tasse.component.scss'],
  animations: [fadeInAnimation],
  providers: [DatePipe]
})
export class ListaTasseComponent implements OnInit {

  public static readonly PRIMA_DATA_GRANDE = 1
  public static readonly SECONDA_DATA_GRANDE = 2
  public static readonly DATA_UGUALE = 3
  corsi: ICorsiTasse[];
  showList: boolean;
  corsoSelected!: ICorsiTasse
  formTasse: FormGroup;
  today: Date = new Date();
  utenti: User[]
  showHeared: boolean;

  constructor(private tasseService: TasseService, public date: DatePipe, private fb: FormBuilder, private courseService: CourseService) {
    this.corsi = []
    this.utenti = []
    this.showList = true;
    //this.loadCorsi();
    this.formTasse = this.fb.group({
      tasse: this.fb.array([])
    })
    this.load()
    this.showHeared = false;
    this.courseService.getAllUser().subscribe({
      next: res => {
        res.forEach(user => {
          this.utenti.push(user)
        })
      }
    })
  }

  ngOnInit(): void {
  }



  load() {
    this.courseService.getAllUser().subscribe({
      next: res => {
        res.forEach(user => {
          this.utenti.push(user)
        })
      }
    })
    const today = new Date();
    this.tasseService.getCorsi().subscribe({
      next: corsi => {
        corsi.forEach(corso => {

          const inizio = new Date(corso.dataInizio);
          let semaforo = {
            id: 2,
            message: 'Da Pagare'
          };
          corso.semaforo = semaforo



          if (this.isGrather(this.date.transform(inizio, 'MM/yyyy')?.toLowerCase(),
            this.date.transform(today, 'MM/yyyy')) == ListaTasseComponent.DATA_UGUALE || this.isGrather(this.date.transform(inizio, 'MM/yyyy')?.toLowerCase(),
            this.date.transform(today, 'MM/yyyy')) == ListaTasseComponent.SECONDA_DATA_GRANDE) {
            console.log('qua')

            corso.tassaMeseCorrente = [];

            corso.tasse.forEach(t => {
              const scad = (new Date(t.scadenza))
              if (this.isGrather(this.date.transform(scad, 'MM/yyyy')?.toLowerCase(), this.date.transform(today, 'MM/yyyy')) == ListaTasseComponent.DATA_UGUALE) {
                corso.tassaMeseCorrente?.push(t)

              }
            })

          } else {
            semaforo = {
              id: 4,
              message: 'Non ancora iniziato'
            }
            corso.semaforo = semaforo

          }
          const fine = new Date(corso.dataFine);
          if (this.isGrather(this.date.transform(fine, 'MM/yyyy')?.toLowerCase(), this.date.transform(today, 'MM/yyyy')) == ListaTasseComponent.SECONDA_DATA_GRANDE) {
            semaforo = {
              id: 3,
              message: 'Concluso'
            }
            corso.semaforo = semaforo
          }
          const utentiId = corso.utenti.split(',')
          corso.utentiArray = []
          utentiId.forEach(u => {
            let us = this.utenti.find(user =>
              +u === user.id
            )
            if (us)
              corso.utentiArray?.push(us)

          })
          corso.utentiArray.forEach(us=>{
            us.tassaMeseCorrente = corso.tassaMeseCorrente?.find(t=>us.id==t.userId)
          })

          let foundLastOnce = false;
          if(corso.tassaMeseCorrente){
            corso.tassaMeseCorrente?.forEach(t=>{
              console.log('entro')
              if (t.stato == 1) {
                foundLastOnce= true
              } /*else {
                  semaforo = {
                    id: 1,
                    message: 'Regolare'
                  }
                }*/

            })
            if(foundLastOnce){
              semaforo = {
                id: 2,
                message: 'Da Pagare'
              }
            }else{
              semaforo = {
                id: 1,
                message: 'Regolare'
              }
            }
            corso.semaforo = semaforo
          }

          this.corsi.push(corso)
        })

        console.log(corsi)
      }

    })
  }

  storeUser(utentiPaganti: string[] | undefined, utentiNonPaganti: string[] | undefined) {
    let userToStorePag: User = {
      id: 0,
      name: '',
      surname: '',
      email: '',
      pagato: true
    }
    let utentiToAdd: User[] = []
    if (utentiPaganti) {
      utentiPaganti.forEach(up => {
        console.log(up + 'OP')
        const utente = this.utenti.find(utente => {
          return utente.id === +up
        })
        utente!.pagato = true;
        if (utente)
          utentiToAdd.push(utente)
      })
    }
    if (utentiNonPaganti) {
      utentiNonPaganti.forEach(uNP => {
        const utente = this.utenti.find(utente => {
          return utente.id === +uNP
        })
        utente!.pagato = false;
        if (utente)
          utentiToAdd.push(utente)
      })
    }

    return utentiToAdd;
  }

  getSemaforoColor(id: number): string {
    if (id == 1) {
      return 'success'
    } else if (id == 2) {
      return 'danger'
    } else if (id == 3) {
      return 'info'
    } else {
      return 'warning'
    }
  }

  showHideInformation(tassa: any) {
    this.showHeared = !this.showHeared;
    tassa.hidden = !tassa.hidden;
  }

  isGrather(primaData: any, secondaData: any) {
    let primaDataSupp = primaData.split("/");
    let primaData1 = new Date(primaDataSupp[1], (+primaDataSupp[0] - 1));

    let secondaDataSupp = secondaData.split("/");
    let secondaData1 = new Date(secondaDataSupp[1], (+secondaDataSupp[0] - 1));
    if (primaDataSupp.toString().startsWith(secondaDataSupp.toString())) {
      console.log(1)
      return ListaTasseComponent.DATA_UGUALE
    } else {
      if (primaData1 > secondaData1) {
        console.log(2)
        //Primo giorno grande
        return ListaTasseComponent.PRIMA_DATA_GRANDE;
      } else {
        console.log(3)
        //Secondo giorno grande
        return ListaTasseComponent.SECONDA_DATA_GRANDE;
      }
    }

  }

  selectCorso(corso: ICorsiTasse) {
    this.corsoSelected = corso
    this.showList = false;
  }

  addSkills() {
    this.tasseForm.push(this.newResources());
  }

  newResources(): FormGroup {
    return this.fb.group({
      tassa: ['',],
      scadenza: ['',],
      costoSingolo: [0],
      numeroProgressivo: ['',]
    })
  }

  get tasseForm(): FormArray {
    return this.formTasse.get('tasse') as FormArray
  }
}
