import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  LOCALE_ID,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ITasse} from "../../mock/tasse";
import {TasseService} from "../../services/tasse.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Corsi} from "../../mock/corsi";
import {CourseService} from "../../services/course-seervice.service";
import {NgxSpinnerService} from "ngx-spinner";
import {User} from "../../mock/user";
import {datePipe} from "../../mock/date-pipe.pipe";
import {DatePipe, DecimalPipe, registerLocaleData} from "@angular/common";
import {fadeInAnimation} from "../../animation/fade-in-animation";
import {TimeZoneMock} from "../../mock/timezone";
import localeEs from '@angular/common/locales/it';
import {Constants} from "../../constants/constants";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {Dialog} from "primeng/dialog";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {ICorsiTasse} from "../../mock/corsiTasse";

registerLocaleData(localeEs);
@Component({
  selector: 'app-tasse',
  templateUrl: './tasse.component.html',
  styleUrls: ['./tasse.component.scss'],
  providers: [datePipe, DatePipe, DecimalPipe, TranslateService, PrimeNGConfig, MessageService, DynamicDialogConfig],
  animations: [fadeInAnimation]
})
export class TasseComponent implements OnInit, AfterViewInit, OnChanges {

  scheduleOption: any;
  tasse: ITasse[];
  addTasse: boolean;
  formAddTasse: FormGroup
  cercaStudenti: string;
  newCourse: boolean;
  studenti: User[];
  supportSearch: User[];
  selectFrormSearch: boolean;
  utenti: User[]
  showStudentDialog: boolean;

  formTasse: FormGroup
  formStudenti:FormGroup
  corsoSelected:any;
  addStudenti:boolean;
  openSearch:boolean;

  editingTasse:boolean;


  selectedUser:User;
  proseguiSelected:boolean;
  clonedProducts: { [s: string]: ITasse; } = {};

  lang: string = "it";
  subscription: Subscription;
  fromList:boolean;
  @Output() showAddUser = new EventEmitter<boolean>();
  @Input() corso: ICorsiTasse = {
    id:0,
    tasse:[],
    utentiArray:[],
    name:'',
    dataFine:'',
    dataInizio:'',
    corsoIniziato:false,
    tassaMeseCorrente:[],
    semaforo:null,
    corsoConcluso:false,
    utenti:'',
    costo:''
  };
  @Output() displayAddUtente = new EventEmitter<boolean>();
  constructor(private tasseService: TasseService,
              private datePie: datePipe,
              private fb: FormBuilder,
              private corsiService: CourseService,
              public spinner: NgxSpinnerService,
              private config: PrimeNGConfig,
              private translate: TranslateService,
              private datePieAngular: DatePipe,
              private messageService: MessageService,

              ) {

    this.fromList = false;
    translate.addLangs(['it']);
    translate.setDefaultLang('it');

    const browserLang = translate.getBrowserLang();
    let lang = 'it';
    this.changeLang(lang);
    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
    this.proseguiSelected = false;
    this.selectedUser = {
      id:0,
      name:'',
      surname:'',
      email:'',
      tasse:[],

      totale:0,
      daVersare:0,
      versato:0

    }
    this.tasse = []
    this.editingTasse = false;
    this.openSearch = true;
    this.studenti = [];
    this.supportSearch = [];
    this.utenti = []
    this.showStudentDialog = false;
    this.selectFrormSearch = false;
    this.addStudenti = false
    this.addTasse = false;
    this.cercaStudenti = '';
    this.newCourse = false;
    this.formAddTasse = this.fb.group({
      nomeCorso: ['', Validators.required],
      dataInizio: [new Date(), Validators.required],
      dataFine: ['', Validators.required],
      costo: [ , Validators.required]
    })
    this.formTasse = this.fb.group({
      tasse: this.fb.array([])
    })
    this.formStudenti = this.fb.group({
      studenti: this.fb.array([])
    })
    this.studenti = [

    ]
    this.supportSearch = this.studenti;
    this.loadUtenti();
  }

  ngAfterViewInit(): void {
        console.log(this.corso)
    }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  ngOnInit(): void {
      console.log(this.corso)

  }



  selectUser(user:User){
    this.selectedUser = user;
    this.editingTasse = true
  }

  showDialogMaximized(dialog: Dialog) {
    dialog.maximize();
  }
  openSearchMod(){
    this.openSearch = !this.openSearch
    this.selectFrormSearch = true;
    this.addStudenti = false;
  }
  addStud(){
    this.addStudenti = !this.addStudenti
    this.selectFrormSearch = true;
    this.openSearch = false;
    this.studentiForm.controls = []
    this.addStudent()
  }

  salvaStudenti(){
    this.studentiForm.controls.forEach(c=>{
     let user: User = {
        name: c.get('name')?.value,
       surname:c.get('surname')?.value,
       email: c.get('email')?.value,
       aggiunto:true,
       id: 0,
       tasse: [],
       totale:0,
       daVersare:0,
       versato:0      }
      this.utenti.push(user);
    })
    this.addStudenti = false;
    this.studentiForm.clear()

  }
  loadUtenti() {

    this.spinner.show()
    this.corsiService.getAllUser().subscribe({
      next: (user: User[]) => {
        user.forEach(u=>{
          u.alias = u.name + ' ' + u.surname + ' - ' + u.email
          u.presente = false;
          u.tasse = []
        })
        this.studenti = user;
        this.supportSearch = user;
        this.spinner.hide();
      }, error: err => {
        console.log(err);
      }
    })
  }

  loadTasse() {

  }

  addTasseForm() {
    this.tasseForm.controls = []
    const numberMonth = this.monthDiff(new Date(this.formAddTasse.get('dataInizio')?.value), new Date(this.formAddTasse.get('dataFine')?.value))
    let costo = 0;
    for (let i = 0; i <= numberMonth; i++) {

      this.addSkills()

    }
    this.tasseForm.controls.forEach((c, index) => {
      var date = new Date(this.formAddTasse.get('dataInizio')?.value), y = date.getFullYear(),
        m = new Date(this.formAddTasse.get('dataInizio')?.value).getMonth() + index;

      let lastDay = new Date(y, m + 1, 0);
      c.get('numeroProgressivo')?.setValue((index + 1) + '/' + this.tasseForm.controls.length);



      if(index==numberMonth){
        c.get('scadenza')?.setValue(new Date(this.formAddTasse.get('dataFine')?.value));
      }else{
        c.get('scadenza')?.setValue(new Date(lastDay));
      }
      c.get('tassa')?.setValue(this.datePie.transform(c.get('scadenza')?.value.getMonth()+1) + ' ' + c.get('scadenza')?.value.getFullYear());
    })
    this.tasseForm.controls.forEach((c, index) => {
      costo = this.formAddTasse.get('costo')?.value / (this.tasseForm.controls.length)
      c.get('costoSingolo')?.setValue( parseFloat(costo.toString()).toFixed(2))
    })

    this.utenti.forEach(us=>{
      us.tasse = []
      us.tasse = this.formTasse.value.tasse
    })

    this.proseguiSelected = true;
    console.log(this.formTasse.value.tasse)

  }

  showHideInformation(tasse: any) {
    tasse.hidden = !tasse.hidden;
  }


  newCorso() {
    this.newCourse = !this.newCourse
    this.formAddTasse.reset()
    this.formAddTasse.get('dataInizio')?.setValue(new Date())
    this.corsoSelected = null
  }

  value:number = 100;
  searchCourse() {
    this.selectFrormSearch = false;
    this.studenti = this.supportSearch;
    this.studenti = this.studenti.filter(s=>{
      return s.alias!.toLocaleLowerCase().includes(this.cercaStudenti.toLocaleLowerCase());
    })
  }

  selectCorso(corso: Corsi) {
    this.utenti = corso.utenti;
    this.corsoSelected = corso;
    this.selectFrormSearch = true;
  }

  showStudent() {

    this.showStudentDialog = !this.showStudentDialog;
  }

  setDate() {
    const inizio = new Date(this.formAddTasse.get('dataInizio')?.value)
    this.formAddTasse.get('dataFine')?.setValue(inizio.setMonth(inizio.getMonth() + 1))
  }

  get tasseForm(): FormArray {
    return this.formTasse.get('tasse') as FormArray
  }

  get studentiForm(): FormArray {
    return this.formStudenti.get('studenti') as FormArray
  }

  newStudent(): FormGroup {
    return this.fb.group({
      name: ['',[Validators.required]],
      surname: ['',[Validators.required]],
      email: ['',[Validators.required,Validators.pattern(Constants.EMAIL_REGEX)]]
    })
  }

  newResources(): FormGroup {
    return this.fb.group({
      tassa: ['',],
      scadenza: ['',],
      costoSingolo: [0],
      numeroProgressivo: ['',  ]
    })
  }

  print() {
    console.log('clicco')
    console.log(this.formTasse.value.resources)
  }

  addSkills() {
    this.tasseForm.push(this.newResources());
  }

  addStudent() {
    this.studentiForm.push(this.newStudent());
  }

  removeStudent(i: number) {
    this.studentiForm.removeAt(i);
  }

  monthDiff(d1: Date, d2: Date) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }


  addTassa(){

    this.spinner.show()
    let idCorso = null;
    let nomeCorso =  this.formAddTasse.get('nomeCorso')?.value
    const tasse = {
      nomeCorso,
      users:this.utenti,
      dataInizio:new Date(this.formAddTasse.get('dataInizio')?.value),
      dataFine:new Date(this.formAddTasse.get('dataFine')?.value),
      costo:this.formAddTasse.get('costo')?.value,
      tasse: this.formTasse.value.tasse
    }

    console.log(tasse)
    this.tasseService.addTasse(tasse).subscribe({
      next:res=>{
        this.spinner.hide()
        if(res.statusCode=='OK')
          this.messageService.add({key: 'toastTasse', severity:'success', summary:'Aggiunto' , detail:  res.message});
        else
          this.messageService.add({key: 'toastTasse', severity:'error', summary:'Errore' , detail:res.message });
        this.proseguiSelected = false;
        this.resetVariables();
      }
    })
  }

  resetVariables(){

    this.tasseForm.reset()
    this.formAddTasse.reset()
    this.formStudenti.reset()
    this.studentiForm.reset()
    this.openSearch = true;
    this.selectFrormSearch = false;
    this.addStudenti = false
    this.showStudentDialog = false;
    this.cercaStudenti = ''
    this.addTasse = false;
    this.utenti = []
  }
  addSingleDayForSlot(evt: any) {
    if (!this.utenti.includes(evt)) {
      this.utenti.push(evt);
      this.utenti.forEach(user => {
        if (user.id == evt.id) {
          user.aggiunto = true;
        }
      })
    } else {
      let index = this.utenti.indexOf(evt);
      if (index > -1) {
        this.utenti.forEach(user => {
          if (user.id == evt.id) {
            user.aggiunto = false;
          }

        })
        this.utenti.splice(index, 1);
      }

    }
  }

  checkEmail(email:any){
    let exist = false;
    let userToAdd: any;
    let userDb:any
    userToAdd = this.utenti.find(u=>{
      return u.email.toLowerCase()===email.email.toLowerCase()
    })
    if(userToAdd)
      exist=true;
    else{
      userDb = this.studenti.find(u=>{
        return u.email.toLowerCase()===email.email.toLowerCase()
      })
      if(userDb)
        exist = true;
    }
    if(exist)
      this.studentiForm.setErrors({ 'invalid': true });
    return exist;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.corso)
    if(this.corso.id != 0){
      this.showStudentDialog = true;
      this.fromList = true;
      this.formAddTasse.get('dataInizio')?.setValue(new Date(this.corso.dataInizio))
      this.formAddTasse.get('dataFine')?.setValue(new Date(this.corso.dataFine))
      this.formAddTasse.get('costo')?.setValue(+this.corso.costo)
      console.log(this.formAddTasse.get('costo')?.value)
      console.log(this.formAddTasse.get('dataInizio')?.value)
      console.log(this.formAddTasse.get('dataFine')?.value)
      console.log(this.corso)
      this.corsiService.getAllUser().subscribe({
        next:res=>{
          this.studenti = []
          this.corso.utentiArray.forEach(us=> {
            res.forEach(user => {
              user.presente = user.id == us.id;

            })
          })
          this.studenti = res
          console.log(this.studenti)
        }
      })
    }
    console.log(this.studenti)
  }

  addUserToCourse(){
    this.spinner.show()
    const tasse = {
      users:this.utenti,
      tasse: this.formTasse.value.tasse,
      corsoId:this.corso.id
    }

    console.log(tasse)
    this.tasseService.addUserToCourse(tasse).subscribe({
      next:res=>{
        this.spinner.hide()
        this.showAddUser.emit(false)
        if(res.statusCode=='OK')
          this.messageService.add({key: 'toastTasse', severity:'success', summary:'Aggiunto' , detail:  res.message});
        else
          this.messageService.add({key: 'toastTasse', severity:'error', summary:'Errore' , detail:res.message });
        this.proseguiSelected = false;
        this.resetVariables();
      }
    })
  }
}
