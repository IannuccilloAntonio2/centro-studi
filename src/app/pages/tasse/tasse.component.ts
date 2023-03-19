import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {ITasse} from "../../mock/tasse";
import {TasseService} from "../../services/tasse.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Corsi} from "../../mock/corsi";
import {CourseService} from "../../services/course-seervice.service";
import {NgxSpinnerService} from "ngx-spinner";
import {User} from "../../mock/user";
import {datePipe} from "../../mock/date-pipe.pipe";
import {DatePipe, DecimalPipe} from "@angular/common";
import {fadeInAnimation} from "../../animation/fade-in-animation";
import {TimeZoneMock} from "../../mock/timezone";

@Component({
  selector: 'app-tasse',
  templateUrl: './tasse.component.html',
  styleUrls: ['./tasse.component.scss'],
  providers: [datePipe, DatePipe, DecimalPipe],
  animations: [fadeInAnimation]
})
export class TasseComponent implements OnInit {

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
  clonedProducts: { [s: string]: ITasse; } = {};
  constructor(private tasseService: TasseService,
              private datePie: datePipe,
              private fb: FormBuilder,
              private corsiService: CourseService,
              public spinner: NgxSpinnerService,
              private datePipeAngular: DatePipe,
              private decimalPipe: DecimalPipe,

              ) {
    this.selectedUser = {
      id:0,
      name:'',
      surname:'',
      email:'',
      tasse:[],

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
    this.loadTasse();
    this.addTasse = false;
    this.cercaStudenti = '';
    console.log(this.cercaStudenti)
    this.newCourse = false;
    this.formAddTasse = this.fb.group({
      nomeCorso: ['', Validators.required],
      dataInizio: [new Date(), Validators.required],
      dataFine: ['', Validators.required],
      costo: [ , Validators.required]
    })
    //this.loadUtenti();
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

  ngOnInit(): void {
  }


  selectUser(user:User){
    this.selectedUser = user;
    this.editingTasse = true
  }


  openSearchMod(){
    this.openSearch = !this.openSearch
    this.selectFrormSearch = true;
  }
  addStud(){
    this.addStudenti = !this.addStudenti
    this.selectFrormSearch = true;
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
       tasse: []
      }
      this.utenti.push(user);
    })
    console.log(this.utenti)
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
        console.log(user)
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


      c.get('tassa')?.setValue(this.datePie.transform(m + 1) + ' ' + y);
      if(index==numberMonth){
        c.get('scadenza')?.setValue(new Date(this.formAddTasse.get('dataFine')?.value));
      }else{
        c.get('scadenza')?.setValue(new Date(lastDay));
      }
    })
    this.tasseForm.controls.forEach((c, index) => {
      costo = this.formAddTasse.get('costo')?.value / (this.tasseForm.controls.length)
      c.get('costoSingolo')?.setValue( parseFloat(costo.toString()).toFixed(2))
    })

    this.utenti.forEach(us=>{
      us.tasse = []
      us.tasse = this.formTasse.value.tasse
    })

    console.log(this.utenti)

  }

  showHideInformation(tasse: any) {
    tasse.hidden = !tasse.hidden;
  }

  onRowEditInit(prod:any){
      this.clonedProducts[prod.id] = {...prod};
  }

  newCorso() {
    this.newCourse = !this.newCourse
    this.formAddTasse.reset()
    this.formAddTasse.get('dataInizio')?.setValue(new Date())
    this.corsoSelected = null
  }

  searchCourse() {
    this.utenti = []
    this.selectFrormSearch = false;
    console.log(this.cercaStudenti)
    this.studenti = this.supportSearch;
    this.studenti = this.studenti.filter(s=>{
      console.log(s.alias)
      return s.alias!.toLocaleLowerCase().includes(this.cercaStudenti.toLocaleLowerCase());
    })
  }

  selectCorso(corso: Corsi) {
    this.utenti = corso.utenti;
    this.corsoSelected = corso;
    console.log(corso)
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
      name: ['',],
      surname: ['',],
      email: ['']
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

    let idCorso = null;
    let nomeCorso =  this.formAddTasse.get('nomeCorso')?.value
    const tasse = {
      nomeCorso,
      users:this.utenti,
      dataInizio:new Date(this.formAddTasse.get('dataInizio')?.value),
      dataFine:new Date(this.formAddTasse.get('dataFine')?.value),
      tasse: this.formTasse.value.tasse
    }

    console.log(tasse)
    this.tasseService.addTasse(tasse).subscribe({
      next:res=>{
        console.log(res);
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
    this.cercaStudenti = ''
    this.addTasse = false;
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
}
