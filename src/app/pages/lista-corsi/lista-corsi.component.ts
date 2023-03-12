import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Corsi} from "../../mock/corsi";
import {simpleFadeAnimation} from "../../animation/simple-fade-animation";
import {fadeInAnimation} from "../../animation/fade-in-animation";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CourseService} from "../../services/course-seervice.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmationService, MessageService} from "primeng/api";
import {TitleCasePipe} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../../mock/user";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"
import {UserAliasPipe} from "../../mock/user-aslias.pipe";
import {PresenzeService} from "../../services/presenze.service";
import {PresenzeToShow} from "../../mock/presenze";
import {PresenzaToAdd} from "../../mock/presenzaToAdd";
const fs= require('fs');
// @ts-ignore
import telefoni from '../../../../src/telefoni.json';
@Component({
  selector: 'app-lista-corsi',
  templateUrl: './lista-corsi.component.html',
  styleUrls: ['./lista-corsi.component.scss'],
  providers: [MessageService, ConfirmationService, TitleCasePipe, UserAliasPipe],

  animations: [simpleFadeAnimation, fadeInAnimation]
})
export class ListaCorsiComponent implements OnInit, AfterViewInit {

  corsi: Corsi[];
  formNewCorso: FormGroup
  display: boolean;
  displayModalList: boolean;
  corsoSelected: Corsi;
  singleDayToAdd: any[];
  displayModalAddPresenza: boolean;
  user: User[];
  todayDate: Date;
  multipleInsert: boolean;
  presenzeDay: PresenzeToShow[];
  displayMultiple: boolean;
  userMultipleInsert: User[];

  startFineDefault: Date;
  inizio: Date;
  fine: Date;

  selectedAll: boolean = false;
  removedAll: boolean = true;

  invalidHour: boolean;

  filteredPresenze: PresenzeToShow[] ;
  dateSelectedToFilter: Date;

  constructor(private fb: FormBuilder,
              private courseService: CourseService,
              private spinner: NgxSpinnerService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private pipe: UserAliasPipe,
              private presenzaService: PresenzeService) {

    this.filteredPresenze = [];
    this.inizio = new Date()
    this.fine = new Date()
    this.dateSelectedToFilter = new Date();

    this.inizio.setHours(0)
    this.inizio.setMinutes(0)
    this.fine.setHours(0)
    this.fine.setMinutes(0)
    this.invalidHour = true;
    this.startFineDefault = new Date();
    this.todayDate = new Date();
    this.todayDate.setHours(0)
    this.todayDate.setMinutes(0)
    this.startFineDefault.setHours(this.todayDate.getHours() + 1)
    this.startFineDefault.setMinutes(this.todayDate.getMinutes())
    this.singleDayToAdd = [];
    this.displayMultiple = false;
    this.userMultipleInsert = [];
    this.multipleInsert = false;
    this.presenzeDay = []
    this.spinner.show();
    this.formNewCorso = this.fb.group({
      name: ['', Validators.required],

    })
    this.displayModalList = false;
    this.displayModalAddPresenza = false;
    this.display = false;
    this.corsi = [{
      id: 0,
      name: '',
      utenti: [{
        id: 0,
        name: '',
        surname: '',
        email: ''
      }],
      presenze: []
    }]


    this.corsoSelected = {
      id: 0,
      name: '',
      utenti: [{
        id: 0,
        name: '',
        surname: '',
        email: ''
      }]
    }
    this.loadCorsi()
    this.user = [{
      id: 0,
      name: '',
      surname: '',
      email: '',
      courseId: 0
    }]

  }

  ngOnInit(): void {

  }

  resetVariables() {
    this.corsi = [];
    this.presenzeDay = []
    this.userMultipleInsert = [];
    this.user = []
    this.displayModalList = false;
  }

  loadCorsi() {
    this.resetVariables();
    this.courseService.getAllCourse().subscribe(res => {
      console.log(res)
      this.corsi = res;

      this.spinner.hide();
    })

  }

  stampaRegistro(id: number) {
    console.log('stampa registro in pdf')
  }

  infoCorso(id: number) {
    this.corsoSelected = {
      id: 0,
      name: '',
      utenti: [{
        id: 0,
        name: '',
        surname: '',
        email: ''
      }]
    }
    this.spinner.show();
    console.log(id)
    this.courseService.getAllUser().subscribe(res => {
      this.user.pop();
      this.user = res;
      for (let i = 0; i < res.length; i++) {
        this.user[i].alias = this.user[i].name + ' ' + this.user[i].surname;
      }

      this.courseService.getCourse(id).subscribe(res => {
        console.log(res)
        this.corsoSelected = res;
        // @ts-ignore
        this.filteredPresenze = this.corsoSelected!.presenze;

        // @ts-ignore
        //this.corsoSelected.presenze = this.corsoSelected.presenze.sort(function(a, b) {
        //return a.date - b.date;
        //});
        if (this.corsoSelected.presenze) {

          this.corsoSelected.presenze = this.corsoSelected.presenze.sort((obj1, obj2) => {
            if (obj1.date < obj2.date) {
              return 1;
            }

            if (obj1.date > obj2.date) {
              return -1;
            }

            return 0;
          });
        }
        this.displayModalList = true;
        this.spinner.hide();
        console.log(res)
        console.log(this.corsoSelected)
      })
    })
  }

  ngAfterViewInit(): void {
  }

  displayModal() {
    this.display = true;
  }

  addCorso() {
    this.spinner.show()

    this.display = false;
    console.log(this.formNewCorso.get('name')?.value);
    this.courseService.generateCourse(this.formNewCorso.get('name')?.value).subscribe(res => {
      console.log(res)
      this.loadCorsi();
      this.spinner.hide()
    })
    console.log('aggiunto')
  }

  delete(event: Event, id: number) {
    this.confirmationService.confirm({
      // @ts-ignore
      target: event.target,
      message: 'Sicuro di voler eliminare il corso?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Conferma',
      rejectLabel: 'Annulla',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.spinner.show();
        this.courseService.deleteCourse(id).subscribe(response => {
          this.loadCorsi();
          this.spinner.hide();

          this.messageService.add({
            severity: 'success',
            summary: '',
            detail: response.message,
          });
        }, (errorResponse: HttpErrorResponse) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'danger',
            summary: '',
            detail: errorResponse.error.message,
          });
        })
      },
      reject: () => {
        //reject action

      }
    });
  }

  // @ts-ignore
  today(today: string): boolean {
    console.log(today + 'da');
    const day = new Date()
    const monthSupport = day.getMonth() + 1
    const month = (monthSupport <= 9 ? '0' : '') + monthSupport
    const data = (day.getDate() <= 9 ? '0' : '') + day.getDate()
    let date = day.getFullYear() + '-' + month + '-' + data
    console.log(today.search(date) + date)

    return today.includes(date);
  }

  test(name: string) {
    console.log(name)
  }


  addCourseForSpecificUser(calendar: any) {
    this.userMultipleInsert = [];
    this.todayDate = calendar.value;
    this.spinner.show();
    if (!this.multipleInsert) {
      this.displayModalAddPresenza = true;
      this.displayModalList = false;
    } else {
      this.displayMultiple = true;
    }

    const month = this.todayDate.getMonth() + 1;
    const dateToShow = this.todayDate.getFullYear() + '-' +
      (month <= 9 ? '0' : '') + month + '-' +
      (this.todayDate.getDate() <= 9 ? '0' : '') + this.todayDate.getDate()

    this.showPresenze(dateToShow);

  }

  showPresenze(dateToShow: any) {
    this.userMultipleInsert = [];
    this.presenzaService.findPresenzaForSpecificDay(dateToShow).subscribe({
      next: presenze => {

        this.courseService.findUserByCourse(this.corsoSelected.id).subscribe({
          next: users => {
            this.userMultipleInsert = users
            this.userMultipleInsert.forEach(us => {
              us.presente = false;
              us.aggiunto = false;
            })
            if (presenze.length > 0) {
              presenze.forEach(presenza => {
                this.userMultipleInsert.forEach(user => {
                  if (user.id === presenza!.utenti!.id) {
                    console.log('trovato')
                    user.presente = true;
                  }
                  user.aggiunto = false;
                })
              })
            } else {
              this.userMultipleInsert.forEach(us => {
                us.presente = false;
                us.aggiunto = false;
              })
            }
            console.log(users)
            console.log(this.userMultipleInsert)
            this.spinner.hide();
          }

        })

        this.presenzeDay = presenze
        console.log(presenze);
      }
    })
  }

  childToParent(name: any) {
    this.displayModalAddPresenza = true;
    this.displayModalList = false;
    this.todayDate = new Date();
  }

  deleteUser(event: Event, id: number) {
    this.confirmationService.confirm({
      // @ts-ignore
      target: event.target,
      message: 'Sicuro di voler eliminare lo studente selezionato?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Conferma',
      rejectLabel: 'Annulla',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.spinner.show();
        this.courseService.deleteUser(id).subscribe(response => {
          this.loadCorsi();
          this.spinner.hide();

          this.messageService.add({
            severity: 'success',
            summary: '',
            detail: response.message,
          });
        }, (errorResponse: HttpErrorResponse) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'danger',
            summary: '',
            detail: errorResponse.error.message,
          });
        })
      },
      reject: () => {
        //reject action

      }
    });
  }


  deletePresenza(event: Event, id: number) {
    console.log(id)
    this.messageService.clear();
    this.confirmationService.confirm({
      // @ts-ignore
      target: event.target,
      message: 'Sicuro di voler eliminare la presenza selezionata?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Conferma',
      rejectLabel: 'Annulla',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.spinner.show();
        this.courseService.deletePresenza(id).subscribe(response => {
          if (this.displayMultiple) {
            const month = this.todayDate.getMonth() + 1;
            const dateToShow = this.todayDate.getFullYear() + '-' +
              (month <= 9 ? '0' : '') + month + '-' +
              (this.todayDate.getDate() <= 9 ? '0' : '') + this.todayDate.getDate()
            this.showPresenze(dateToShow)
          } else {

            this.infoCorso(this.corsoSelected.id);
          }
          this.spinner.hide();

          this.messageService.add({
            severity: 'success',
            summary: '',
            detail: response.message,
            key:'modal'
          });
        }, (errorResponse: HttpErrorResponse) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'danger',
            summary: '',
            detail: errorResponse.error.message,
          });
        })
      },
      reject: () => {
        //reject action

      }
    });
  }

  addSingleDayForSlot(evt: any) {
    if (!this.singleDayToAdd.includes(evt)) {
      this.singleDayToAdd.push(evt);
      this.userMultipleInsert.forEach(user => {
        if (user.id == evt.id) {
          user.aggiunto = true;
        }
      })
    } else {
      let index = this.singleDayToAdd.indexOf(evt);
      if (index > -1) {
        this.userMultipleInsert.forEach(user => {
          if (user.id == evt.id) {
            user.aggiunto = false;
          }

        })
        this.singleDayToAdd.splice(index, 1);
      }

    }
    console.log(this.singleDayToAdd)
  }

  filterPresenze(){
    this.filteredPresenze = [];
    // @ts-ignore
    this.filteredPresenze = this.corsoSelected.presenze;
    console.log(this.dateSelectedToFilter);
    this.filteredPresenze = this.corsoSelected!.presenze!.filter(c => {
      const month = this.dateSelectedToFilter.getMonth() + 1;
      const dateToShow = this.dateSelectedToFilter.getFullYear() + '-' +
        (month <= 9 ? '0' : '') + month + '-' +
        (this.dateSelectedToFilter.getDate() <= 9 ? '0' : '') + this.dateSelectedToFilter.getDate()
     return c.date.includes(dateToShow)});
  }

  onClearSearch(){
    // @ts-ignore
    this.filteredPresenze = this.corsoSelected.presenze;
  }
  checkHour() {
    console.log('ci vado')

    this.fine.setHours(this.inizio.getHours() + 1)
    this.fine.setMinutes(this.inizio.getMinutes())
  }

  addPresenzeMultiple() {
    const hoursEntrata = this.inizio.getHours();
    const minutesEntrata = this.inizio.getMinutes();

    const hoursUscita = this.fine.getHours();
    const minutesUscita = this.fine.getMinutes();
    const entrata = (hoursEntrata <= 9 ? '0' : '') + hoursEntrata + ':' + (minutesEntrata <= 9 ? '0' : '') + minutesEntrata;
    const uscita = (hoursUscita <= 9 ? '0' : '') + hoursUscita + ':' + (minutesUscita <= 9 ? '0' : '') + minutesUscita;

    let userSupport: User [] = []
    this.userMultipleInsert.forEach(us => {
      if (us.aggiunto) {
        userSupport.push(us);
      }
    })
    this.courseService.findUserByCourse(this.corsoSelected.id).subscribe({
      next: user => {
        console.log(user)
        let userToSave = {
          name: '',
          surname: '',
          email: ''
        }
        const month = this.todayDate.getMonth() + 1;
        const presenzaToSave: PresenzaToAdd = {
          userDto: userToSave,
          initialHour: entrata,
          finalHour: uscita,
          users: userSupport,
          courseId: this.corsoSelected.id,
          date:
            this.todayDate.getFullYear() + '-' +
            (month <= 9 ? '0' : '') + month + '-' +
            (this.todayDate.getDate() <= 9 ? '0' : '') + this.todayDate.getDate()


        }
        console.log(presenzaToSave);
        //this.displayModalAddPresenza.emit(false);
        //this.displayModalList.emit(true);
        this.presenzaService.addPresenzaList(presenzaToSave).subscribe(res => {
          console.log(res)
          this.displayMultiple = false;
          this.infoCorso(this.corsoSelected.id);
          this.messageService.add({
            severity: 'success',
            summary: '',
            detail: 'Presenze aggiunte correttamente',
          });
        })

      }
    })


  }


  closeInfo() {
    this.loadCorsi()
  }

  filtra(){

  }
  checkFinalHour() {

    const oraInizio = this.inizio.getHours();
    const minutiInizio = this.inizio.getMinutes();

    const oraFine = this.fine.getHours();
    const minutiFine = this.fine.getMinutes();
    if(oraInizio!=0){
      if (oraInizio > oraFine) {
        this.invalidHour = true;
      } else {
        if (minutiInizio > minutiFine) {
          this.invalidHour = true;
        } else if (minutiInizio <= minutiFine) {
          this.invalidHour = false;
        }
      }
      if(oraInizio==oraFine && minutiInizio == minutiFine){
        this.invalidHour = true;
      }
    }else{
      this.invalidHour = true;
    }
      console.log(this.invalidHour)
  }


  exportToPDF(id: number) {
    let sales: any[] = [];
    let userToAdd: any[] = [];
    this.courseService.getAllUser().subscribe(res => {
      this.user.pop();
      this.user = res;
      for (let i = 0; i < res.length; i++) {
        this.user[i].alias = this.user[i].name + ' ' + this.user[i].surname;
      }
      this.courseService.getCourse(id).subscribe(res => {
        res.presenze = res.presenze!.sort((obj1, obj2) => {
          if (obj1.date < obj2.date) {
            return 1;
          }

          if (obj1.date > obj2.date) {
            return -1;
          }

          return 0;
        });
        res.utenti = res.utenti!.sort((obj1, obj2) => {
          if (obj1.name > obj2.name) {
            return 1;
          }

          if (obj1.name < obj2.name) {
            return -1;
          }

          return 0;
        });
        res.utenti.forEach(utenti => {
          const utente = {
            Nome: utenti.name.toLocaleUpperCase(),
            Cognome: utenti.surname.toUpperCase(),
            Email: utenti.email
          }
          userToAdd.push(utente);
        })
        res.presenze?.forEach((presenze, index) => {
            // @ts-ignore
            if (res.presenze[index - 1] != undefined && res.presenze[index] != undefined) {

              // @ts-ignore
              if (!res.presenze[index].date.includes(res.presenze[index - 1].date)) {
                const presenza = {
                  Giorno: '',
                  Studente: '',
                  Entrata: '',
                  Uscita: ''
                }
                sales.push(presenza);
              }
            }
            const presenza = {
              Giorno: presenze.date,
              Studente: this.pipe.transform(presenze.userId, this.user),
              Entrata: presenze.initialHour,
              Uscita: presenze.finalHour
            }
            sales.push(presenza);
          }
        )
        const columns = [
          {title: "Giorno", dataKey: "Giorno"},
          {title: "Studente", dataKey: "Studente"},
          {title: "Entrata", dataKey: "Entrata"},
          {title: "Uscita", dataKey: "Uscita"}

        ];
        const user = [
          {title: "Nome", dataKey: "Nome"},
          {title: "Cognome", dataKey: "Cognome"},
          {title: "Email", dataKey: "Email"},

        ];
        const doc = new jsPDF('p', 'pt');
        autoTable(doc, {
          columns: user,
          body: userToAdd,
          didDrawPage: (dataArg: { settings: { margin: { top: any; }; }; }) => {
            doc.text('Corso: ' + res.name, dataArg.settings.margin.top, 20);
          }
        });
        autoTable(doc, {
          columns: columns,
          body: sales,

        });
        doc.save('Presenze_Corso_' + res.name + '.pdf');

      })
    })
    console.log(sales)


  }

  ese() {

    const user = {
      name: 'aa',
      surname: 'boh',
      email: 'antonio@gmail.com',
      password: 'Ciao'
    }
    // vado a vedere se ci sono utenti nello storage con la funzione localStorage.getItem("utenti")
    // la funzione JSON.parse serve solo per far capire che stiamo lavorando su un array di json
    let utentiSalvati = JSON.parse(localStorage.getItem("utenti")|| '[]');
    //Faccio un controllo, se nello storage non ho nessun utente inserito creo l'array che ha come chiave "utenti"
    if(utentiSalvati.length===0){
      //setItem serve per settare lo storage, in questo caso inseriamo un json nell'array con la funzione JSON.stringify([this.user]) ci sono le parentesi quadre perchè è un array
      //AL POSTO DI USER DEVI METTE this.user il mio era con un esempio
      localStorage.setItem("utenti", JSON.stringify([user]));
      //invece se c'è almeno un elemento nello storage
    }else{
      //aggiungo l'utente inserito in fase di registrazione nell'array di utenti dello storage
      //AL POSTO DI USER DEVI METTE this.user il mio era con un esempio
      utentiSalvati.push(user);
      // e poi setto di nuovo il localstorage con la stessa chiave ma con il nuovo array di utenti
      localStorage.setItem("utenti", JSON.stringify(utentiSalvati));
    }


    console.log(JSON.parse(localStorage.getItem("utenti")|| '[]'))


//...
    // @ts-ignore
  }

  email:string = '';
  password:string='';
  login() {
    let utenti = JSON.parse(localStorage.getItem("utenti") || '[]');
    //sono campi fasulli tu metti dove sta ion input al posto di ngModel fai [(ngModel)]="email" e per password [(ngModel)]="password"
    this.email = 'antonio@gmail.com'
    this.password = 'Ciao'
    utenti.forEach((utente:any)=>{
      if((utente.email === this.email) && (utente.password === this.password)){
        //TU METTI IL ROTING
        console.log('LOGIN')
      }else{
        console.log('errate credenziali')
      }
    })
  }
}

