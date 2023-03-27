import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TasseService} from "../../services/tasse.service";
import {ICorsiTasse} from "../../mock/corsiTasse";
import {fadeInAnimation} from "../../animation/fade-in-animation";
import {DatePipe} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../mock/user";
import {CourseService} from "../../services/course-seervice.service";
import {ITasse} from "../../mock/tasse";
import {ConfirmationService, MessageService, PrimeNGConfig} from "primeng/api";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {datePipe} from "../../mock/date-pipe.pipe";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {Dialog} from "primeng/dialog";
import {IServiceResponse} from "../../mock/IServiceResponse";
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-lista-tasse',
  templateUrl: './lista-tasse.component.html',
  styleUrls: ['./lista-tasse.component.scss'],
  animations: [fadeInAnimation],
  providers: [DatePipe, MessageService, ConfirmationService, datePipe, DialogService]
})
export class ListaTasseComponent implements OnInit, AfterViewInit {

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
  showTassa: boolean;
  selectedUser: User;
  pagamento: number;
  tasseSuport: any[] = []
  addTasse: boolean;
  tasseAggiornate: boolean;
  sendEmailDialog: boolean;

  lang: string = "it";
  subscription: Subscription;
  ref!: DynamicDialogRef;
  showAddUser: boolean = false;
  emailNotification: {
    id: number,
    scadenza: string,
    nota: string
  }

  constructor(private tasseService: TasseService, public date: DatePipe, private fb: FormBuilder, private courseService: CourseService,
              private messageService: MessageService, private confirmationService: ConfirmationService, public spinner: NgxSpinnerService,
              private translate: TranslateService, private config: PrimeNGConfig, private datePie: datePipe, public dialogService: DialogService) {

    this.emailNotification = {
      id: 0,
      scadenza: '',
      nota: ''
    }

    this.sendEmailDialog = false;
    this.tasseAggiornate = false;
    this.spinner.show()
    translate.addLangs(['it']);
    translate.setDefaultLang('it');

    const browserLang = translate.getBrowserLang();
    let lang = 'it';
    this.changeLang(lang);
    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
    this.addTasse = false
    this.pagamento = 1;
    this.corsi = []
    this.utenti = []
    this.showTassa = false;
    this.showList = true;
    this.selectedUser = {
      id: 0,
      name: '',
      surname: '',
      email: '',
      tasse: [],


      totale: 0,
      daVersare: 0,
      versato: 0
    }
    //this.loadCorsi();
    this.formTasse = this.fb.group({
      tasse: this.fb.array([])
    })
    this.showHeared = false;
    this.courseService.getAllUser().subscribe({
      next: res => {
        res.forEach(user => {
          this.utenti.push(user)
        })
      }
    })
  }

  async loadAll(): Promise<boolean> {
    let result: IServiceResponse = <IServiceResponse>await this.load();
    if (result.statusCode == 'OK') {
      this.loadUser(result.option)
      return true
    }
    return false
  }


  removeTassa(i: number) {
    this.tasseForm.removeAt(i);
    this.tasseForm.controls.forEach((c, index) => {
      let lengh = this.tasseForm.controls.length + this.selectedUser.tasse!.length
      c.get('numeroProgressivo')?.setValue((index + this.selectedUser.tasse!.length + 1) + '/' + lengh);
    })
  }

  async change(event: any) {
    this.showAddUser = false;
    let result: IServiceResponse = <IServiceResponse>await this.load();
    console.log(result)
    await this.loadAll()
    this.selectCorso(this.corsoSelected)

  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  show() {
    this.showAddUser = true
  }

  salvaTasse() {

    this.spinner.show();
    let tasseAggiunte = 0
    this.tasseForm.controls.forEach(c => {
      tasseAggiunte = c.get('numeroProgressivo')?.value.toString().split('/')[1]
    })
    console.log(tasseAggiunte)
    console.log(this.formTasse.value.tasse)
    let tasse = {
      tasse: this.formTasse.value.tasse,
      corsoId: this.corsoSelected.id,
      userId: this.selectedUser.id
    }
    this.tasseService.addTasseForSpecificUser(tasse).subscribe({
      next: res => {
        console.log(res)
        this.spinner.hide();
        if (res.statusCode == 'OK') {
          this.messageService.add({key: 'myKey1', severity: 'success', summary: 'Confermato', detail: res.message});
          this.loadAll().then(s => {

            if (s) {
              this.spinner.hide()
              this.selectCorso(this.corsoSelected)
              this.selectUser(this.selectedUser)
            }

          })
        } else
          this.messageService.add({key: 'myKey1', severity: 'error', summary: 'Errore', detail: res.message});
      }, error: err => {
        this.messageService.add({key: 'myKey1', severity: 'error', summary: 'Errore', detail: err.error.message});
      }
    })
  }

  ngAfterViewInit(): void {
    console.log(this.corsi)


  }

  async ngOnInit(): Promise<void> {

    await this.loadAll()
    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
  }

  value: number = 50000

  selectUser(user: User) {
    this.showTassa = true;
    let totaleCosto = 0
    let totaleRimanenza = 0
    user.tasse?.forEach(t => {
      t.scadenzaDate = new Date(t.scadenza);
      t.editedDate = new Date(t.scadenza);
      totaleCosto = totaleCosto + +t.costo
      totaleRimanenza = totaleRimanenza + +t.rimanenza
    })
    user.totale = totaleCosto;
    user.daVersare = totaleRimanenza;
    user.versato = totaleCosto - totaleRimanenza;
    this.selectedUser = user;
  }

  load = () => {
    return new Promise((resolve, reject) => {
      this.spinner.show()
      this.corsi = []
      const today = new Date();
      this.tasseService.getCorsi().subscribe({
        next: corsi => {
          this.spinner.hide()
          //this.corsi =  this.loadUser(corsi)

          corsi.forEach(corso => {
            const inizio = new Date(corso.dataInizio);
            let semaforo = {
              id: 2,
              message: 'Da Pagare'
            };
            corso.semaforo = semaforo

            corso.tassaMeseCorrente = [];
            if (this.isGrather(this.date.transform(inizio, 'MM/yyyy')?.toLowerCase(),
              this.date.transform(today, 'MM/yyyy')) == ListaTasseComponent.DATA_UGUALE || this.isGrather(this.date.transform(inizio, 'MM/yyyy')?.toLowerCase(),
              this.date.transform(today, 'MM/yyyy')) == ListaTasseComponent.SECONDA_DATA_GRANDE) {


              corso.tasse.forEach(t => {
                t.modificata = false;
                t.scadenzaDate = new Date(t.scadenza);
                console.log(t.scadenzaDate)
                t.editedDate = new Date(t.scadenza);

                const scad = (new Date(t.scadenza))
                if (this.isGrather(this.date.transform(scad, 'MM/yyyy')?.toLowerCase(), this.date.transform(today, 'MM/yyyy')) == ListaTasseComponent.DATA_UGUALE
                ) {
                  t.iniziato = true;
                  corso.tassaMeseCorrente.push(t)

                } else {
                  console.log('entro nell esle delle cose correnti')
                  console.log(this.date.transform(inizio, 'MM/yyyy')?.toLowerCase())
                  console.log(this.date.transform(scad, 'MM/yyyy')?.toLowerCase())
                  if (this.isGrather(this.date.transform(inizio, 'MM/yyyy')?.toLowerCase(),
                    this.date.transform(scad, 'MM/yyyy')?.toLowerCase()) == ListaTasseComponent.DATA_UGUALE) {
                    console.log('sono entrato nella data pù grande')
                  }
                }

              })

            } else {

              corso.tasse.forEach(t => {
                t.modificata = false;
                t.scadenzaDate = new Date(t.scadenza);
                console.log(t.scadenzaDate)
                t.editedDate = new Date(t.scadenza);

                const scad = (new Date(t.scadenza))
                console.log(this.date.transform(inizio, 'MM/yyyy')?.toLowerCase())
                console.log(this.date.transform(scad, 'MM/yyyy')?.toLowerCase())
                if (this.isGrather(this.date.transform(inizio, 'MM/yyyy')?.toLowerCase(),
                  this.date.transform(scad, 'MM/yyyy')?.toLowerCase()) == ListaTasseComponent.DATA_UGUALE) {
                  t.iniziato = false;
                  corso.tassaMeseCorrente.push(t)
                }
              })
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


            let foundLastOnce = 'Non iniziato';
            console.log('mese')
            console.log(corso.tassaMeseCorrente)
            if (corso.tassaMeseCorrente) {
              corso.tassaMeseCorrente?.forEach(t => {
                console.log(t.iniziato + 'iniziato')
                if (t.stato == 1 && t.iniziato) {
                  foundLastOnce = 'Iniziato'
                } else if (t.stato == 2 && t.iniziato) {
                  foundLastOnce = 'Regolare'
                }

              })
              if (foundLastOnce.startsWith('Iniziato')) {
                semaforo = {
                  id: 2,
                  message: 'Da Pagare'
                }
              } else if (foundLastOnce.startsWith('Regolare')) {
                semaforo = {
                  id: 1,
                  message: 'Regolare'
                }
              }
              corso.semaforo = semaforo
            }


          })
          this.corsi = corsi;
          let value: IServiceResponse = {
            statusCode: 'ko',
            message: ''

          };
          if (this.corsi.length == corsi.length) {
            resolve(value = {
              option: this.corsi,
              statusCode: 'OK',
              message: 'ciao'
            })
          }
        }
      })
    })

  }

  showDialogMaximized(dialog: Dialog) {
    dialog.maximize();
  }

  loadUser(corsi: ICorsiTasse[]) {
    corsi.forEach(corso => {
      corso.utentiArray = []
      const utentiId = corso.utenti.split(',')
      console.log(utentiId)
      utentiId.forEach(u => {
        let users: User[] = []
        this.courseService.getAllUser().subscribe({
          next: res => {
            users = res;
            console.log('utenti array')
            console.log(res)
            res.forEach(us => {

              if (+u === us.id) {
                corso.utentiArray.push(us)
              }
            })

            corso.utentiArray.forEach(us => {
              console.log('tassa mese corrente')
              console.log(us.tassaMeseCorrente)
              us.tassaMeseCorrente = corso.tassaMeseCorrente?.find(t => us.id == t.userId)
            })
            corso.utentiArray.forEach(us => {
              us.tasse = corso.tasse?.filter(t => us.id == t.userId)
            })
          }


        })


      })
      console.log('utenti')
      console.log(corso.utentiArray)


      /*utentiId.forEach(u => {

        // @ts-ignore
        corso.utentiArray?.push(this.utenti.find(user =>
          +u === user.id
        ))


      })*/
      console.log(corso.tassaMeseCorrente)
      console.log(corso.utentiArray)

    })


  }

  onHide() {
    if (this.showAddUser) {
      this.loadAll().then(r => {
        this.selectCorso(this.corsoSelected)
      })
    } else {
      this.showList = true;
    }
  }

  aggiungiTasse() {
    this.tasseForm.controls = []
    this.addTasse = !this.addTasse
    this.addSkills();
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
      return ListaTasseComponent.DATA_UGUALE
    } else {
      if (primaData1 > secondaData1) {
        //Primo giorno grande
        return ListaTasseComponent.PRIMA_DATA_GRANDE;
      } else {
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
    this.tasseForm.controls.forEach((c, index) => {
      let lengh = this.tasseForm.controls.length + this.selectedUser.tasse!.length
      c.get('numeroProgressivo')?.setValue((index + this.selectedUser.tasse!.length + 1) + '/' + lengh);
      const ind = index + this.selectedUser.tasse!.length + 1
      let date = new Date();

      let y = 0;
      let m = 0;
      // @ts-ignore
      if (this.selectedUser!.tasse[this.selectedUser.tasse!.length - 1]) {
        // @ts-ignore
        date = new Date(this.selectedUser!.tasse[this.selectedUser.tasse!.length - 1].scadenza), y = date.getFullYear(),

          // @ts-ignore
          m = new Date(this.selectedUser!.tasse[this.selectedUser.tasse!.length - 1].scadenza).getMonth() + index + 1;
      }


      let lastDay = new Date(y, m + 1, 0);
      c.get('scadenza')?.setValue(lastDay)
      c.get('tassa')?.setValue(this.datePie.transform(c.get('scadenza')?.value.getMonth() + 1) + ' ' + c.get('scadenza')?.value.getFullYear());
    })

  }

  newResources(): FormGroup {
    return this.fb.group({
      tassa: ['', Validators.required],
      scadenza: ['', Validators.required],
      costoSingolo: [1, Validators.required],
      numeroProgressivo: ['',]
    })
  }

  get tasseForm(): FormArray {
    return this.formTasse.get('tasse') as FormArray
  }

  aggiornaPagamento() {
    let campi: any[] = []
    this.selectedUser.tasse?.forEach(t => {
      campi.push(+t.rimanenza)
      this.tasseSuport.push(+t.rimanenza)
    })
    let totaleCosto = 0
    let totaleRimanenza = 0

    console.log(this.substractArray(this.pagamento, campi));
    this.selectedUser.tasse?.forEach((tass: ITasse, index) => {
      tass.rimanenza = parseFloat(this.substractArray(this.pagamento, campi)[index] + '').toFixed(2)
      parseFloat(tass.costo).toFixed(2)
      if (tass.rimanenza != this.tasseSuport[index])
        tass.modificata = true
      totaleCosto = totaleCosto + +tass.costo
      totaleRimanenza = totaleRimanenza + +tass.rimanenza
    })
    this.selectedUser.totale = totaleCosto;
    this.selectedUser.daVersare = totaleRimanenza;
    this.selectedUser.versato = totaleCosto - totaleRimanenza;
    this.tasseAggiornate = true;
    this.messageService.add({
      detail: 'Clicca su salva in basso a destra per apportare le modifiche',
      summary: 'Attenzione!',
      severity: 'warn',
      key: 'info'
    })
  }

  substractArray(amount: any, items: any) {
    return items.map(function (item: any) {
      item = item - amount;
      amount = (-1) * item;
      if (item < 0) {
        item = 0;
      }
      if (amount < 0) {
        amount = 0;
      }
      return item;
    })
  }

  substractVariables(amount: any, ...args: any[]) {
    var items = Array.prototype.slice.call(arguments, 1);
    return this.substractArray(amount, items)

  }

  aggiornaTasse() {
    const tasse = {
      tasse: this.selectedUser.tasse
    }
    this.tasseService.updateTasse(tasse).subscribe({
      next: res => {
        console.log(res)
        this.pagamento = 1
        if (res.statusCode == 'OK') {
          this.loadAll().then(s => {

            if (s) {
              this.spinner.hide()
              this.selectCorso(this.corsoSelected)
              this.selectUser(this.selectedUser)
            }

          })
          this.messageService.add({key: 'myKey1', severity: 'success', summary: 'Confermato', detail: res.message});
        } else
          this.messageService.add({key: 'myKey1', severity: 'error', summary: 'Errore', detail: res.message});
      }
    })
  }

  annullaPagamento() {
    this.tasseAggiornate = false;
    this.pagamento = 1;
    this.messageService.clear()
    this.selectedUser.tasse?.forEach((tass: ITasse, index) => {
      if (tass.modificata) {
        console.log(this.tasseSuport[index])
        tass.rimanenza = this.tasseSuport[index] + ''
        tass.modificata = false
      }
    })
  }

  deleteCorsiTasse(id: number) {
    this.messageService.clear();

    this.tasseService.deleteCorsi(id).subscribe({
      next: response => {
        this.spinner.hide()
        this.messageService.clear('c');
        if (response.statusCode == 'OK') {

          this.messageService.add({
            key: 'myKey1',
            severity: 'success',
            summary: 'Confermato',
            detail: response.message
          });
          this.loadAll().then(s => {

            console.log('entro' + s)
            if (s) {
              this.spinner.hide()
            }
          })
        } else
          this.messageService.add({key: 'myKey1', severity: 'error', summary: 'Errore', detail: response.message});
      }, error: err => {
        this.spinner.hide()
      }
    })
  }

  deleteuserFromCourse(id: number) {
    this.messageService.clear();
    const u = this.corsoSelected.utenti.split(',')

    let index = u.indexOf(id + '');
    if (index > -1) {
      u.splice(index, 1);
    }
    const data = {
      userId: id,
      courseId: this.corsoSelected.id,
      utenti: u.join(',')
    }
    this.tasseService.removeUserFromCorso(data).subscribe({
      next: response => {
        this.spinner.hide()
        this.messageService.clear('user');
        if (response.statusCode == 'OK') {

          this.messageService.add({
            key: 'myKey1',
            severity: 'success',
            summary: 'Confermato',
            detail: response.message
          });
          this.loadAll().then(s => {

            console.log('entro' + s)
            if (s) {
              this.spinner.hide()
              this.selectCorso(this.corsoSelected)
            }
          })
        } else
          this.messageService.add({key: 'myKey1', severity: 'error', summary: 'Errore', detail: response.message});
        console.log(response)
      }, error: err => {
        this.spinner.hide()
      }
    })
  }

  onReject() {
    this.spinner.hide()
    this.messageService.clear();
  }

  deleteTassa(id: number) {
    this.spinner.show()
    this.messageService.clear();

    this.tasseService.deleteTassa(id).subscribe({
      next: response => {
        this.spinner.hide()
        console.log(response)
        this.messageService.clear('tassa');
        if (response.statusCode == 'OK') {
          this.corsi = []
          this.loadAll().then(s => {

            console.log('entro' + s)
            if (s) {
              this.spinner.hide()
              this.selectCorso(this.corsoSelected)
              this.selectUser(this.selectedUser)
            }
          })
          this.messageService.add({
            key: 'myKey1',
            severity: 'success',
            summary: 'Confermato',
            detail: response.message
          });
        } else
          this.messageService.add({key: 'myKey1', severity: 'error', summary: 'Errore', detail: response.message});
      }, error: err => {
        this.spinner.hide()
      }
    })
  }

  showConfirm(data: any, key: string, info: string) {
    this.spinner.show()
    this.messageService.clear();
    this.messageService.add({
      key: key,
      sticky: true,
      severity: 'warn',
      summary: 'Attenzione!',
      detail: 'Sei sicuro di voler eliminare ' + info + ' ' + data + '?'
    });

  }

  updateTassa(tassa: ITasse) {

    this.spinner.show()
    tassa.scadenza = tassa.scadenzaDate.toDateString()
    const data = {
      scadenza: tassa.scadenza,
      id: tassa.id
    }
    this.tasseService.updateTassa(tassa).subscribe({
      next: res => {
        console.log(res)
        this.spinner.hide()
        if (res.statusCode == 'OK') {

          this.corsi = []
          this.loadAll().then(s => {

            console.log('entro' + s)
            if (s) {
              this.spinner.hide()
              this.selectCorso(this.corsoSelected)
              this.selectUser(this.selectedUser)
            }
          })


          /*this.selectedUser.tasse?.forEach(t=>{
            t.scadenzaDate = new Date(t.scadenza);
            console.log(t.scadenzaDate)
            t.editedDate = new Date(t.scadenza);
          })*/

          this.messageService.add({
            key: 'myKey1',
            severity: 'success',
            summary: 'Confermato',
            detail: res.message
          });
        } else
          this.messageService.add({key: 'myKey1', severity: 'error', summary: 'Errore', detail: res.message});
      }
    })
  }


  showEnvelopeEmail(tassa: ITasse) {
    this.sendEmailDialog = true;
    this.emailNotification = {
      id: tassa.id,
      scadenza: new Date(tassa.scadenza).toLocaleString('it-IT', {
        timeZone: 'Europe/Rome',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      nota: ''
    }


  }

  sendEmail() {
    //this.spinner.show()

    this.tasseService.sendEmailNotification(this.emailNotification).subscribe({
      next: async res => {
        this.sendEmailDialog = false;
        if (res.statusCode == 'OK') {

          this.loadAll().then(s => {

            if (s) {
              this.spinner.hide()
              this.selectCorso(this.corsoSelected)
            }

          })


          this.messageService.add({
            key: 'myKey1', severity: 'success', summary: 'Confermato', detail: res.message
          });
        } else
          this.messageService.add({key: 'myKey1', severity: 'error', summary: 'Errore', detail: res.message});
      }
    })
  }

  showStampaRicevuta() {
    this.spinner.show()
    this.messageService.clear();
    this.messageService.add({
      key: 'ricevuta',
      sticky: true,
      severity: 'warn',
      summary: 'Attenzione!',
      detail: 'Vuoi stampare una ricevuta di pagamento?'
    });
  }

  stampaRicevuta() {
    var element = document.getElementById('print');
    console.log(element)
    var opt = {

      filename: 'ciao.pdf',
      image: {type: 'jpeg', quality: 0.98},
      jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    };
    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }


  exportToPDF() {
    let sales: any[] = [];
    let userToAdd: any[] = [];
    this.selectedUser.tasse?.forEach(t => {
        let stato = ''
        if (t.stato == 2) {
          stato = 'Pagato'
        } else {
          stato = 'Da pagare'
        }
        const utente = {
          NumeroProgressivo: t.numeroProgressivo,
          Tassa: t.tassa,
          Scadenza: new Date(t.scadenza).toLocaleString('it-IT', {
            timeZone: 'Europe/Rome',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          Costo: t.costo + '€',
          Rimanenza: t.rimanenza + '€',
          Stato: stato
        }
        userToAdd.push(utente);
      }
    )
    const columns = [
      {title: "Numero Progressivo", dataKey: "NumeroProgressivo"},
      {title: "Tassa", dataKey: "Tassa"},
      {title: "Scadenza", dataKey: "Scadenza"},
      {title: "Costo", dataKey: "Costo"},
      {title: "Rimanenza", dataKey: "Rimanenza"},
      {title: "Stato", dataKey: "Stato"},

    ];
    const user = [
      {title: "Numero Progressivo", dataKey: "NumeroProgressivo"},
      {title: "Tassa", dataKey: "Tassa"},
      {title: "Scadenza", dataKey: "Scadenza"},
      {title: "Costo", dataKey: "Costo"},
      {title: "Rimanenza", dataKey: "Rimanenza"},
      {title: "Stato", dataKey: "Stato"},

    ];
    const doc = new jsPDF('p', 'pt');
    doc.text('Ricevuta pagamento studente: ' + this.selectedUser.name + ' ' + this.selectedUser.surname, 40, 20);
    doc.setFontSize(14);
    doc.setTextColor('red')
    doc.text('Pagamento effettuato: ' + this.pagamento +'€', 40, 50);
    doc.setTextColor('black')
    doc.setFontSize(12);

    doc.text('Totale: ' + this.selectedUser.totale +'€', 40, 80);
    doc.text('Da versare: ' + this.selectedUser.daVersare+'€', 40, 100);
    doc.text('Versato: ' + this.selectedUser.versato+'€', 40, 120);
    autoTable(doc, {
      body: userToAdd,
      columns:columns,
      startY: 130,
      didDrawPage: (dataArg: { settings: { margin: { top: any; }; }; }) => {

      }
    });


    const today = new Date();
    const total = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear()
    doc.save('Pagamento_' + this.selectedUser.name + ' ' + this.selectedUser.surname + '_' + total + '.pdf');


    console.log(sales)


  }
}

