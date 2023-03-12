import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {PresenzeService} from "../../services/presenze.service";
import {Corsi} from "../../mock/corsi";
import {CourseService} from "../../services/course-seervice.service";
import {simpleFadeAnimation} from "../../animation/simple-fade-animation";
import {User} from "../../mock/user";
import {PresenzaToAdd} from "../../mock/presenzaToAdd";
import {UserDto} from "../../mock/userDto";
import {HttpErrorResponse} from "@angular/common/http";
import {PresenzeToShow} from "../../mock/presenze";

@Component({
  selector: 'app-new-user',
  templateUrl: './orari.component.html',
  styleUrls: ['./orari.component.scss'],
  providers: [MessageService],
  animations: [simpleFadeAnimation]
})
export class OrariComponent implements OnInit {


  corsi: Corsi[] ;
  user: User[];
  filteredUser: User[];
  numbers: string[] = ['onne','two','three','four','five','six','seven','eight','nine','ten'];
  output: string[] = [];
  filterCourse: Corsi[];
  formNewUser: FormGroup;
  required: boolean;
  //inizioDefault: Date;
  startFineDefault: Date;
  @Output() displayModalAddPresenza = new EventEmitter<boolean>();
  @Output() displayModalList = new EventEmitter<boolean>();
  @Output() multipleInsert = new EventEmitter<boolean>();
  @Output() presenzeDay = new EventEmitter<PresenzeToShow[]>();
  @Input() todayDate: Date = new Date();
  @Input() course: number = 0;
  constructor(private fb: FormBuilder,
              //private userService: UserService,
              private spinner: NgxSpinnerService,
              private messageService: MessageService,
              private router: Router,
              private presenzaService: PresenzeService,
              private courseService: CourseService,
              ) {
    console.log(this.multipleInsert)
    this.startFineDefault = new Date();
    this.todayDate.setMinutes(0);
    this.todayDate.setSeconds(0);
    this.required = false;
    this.spinner.show();
    this.formNewUser = this.fb.group({
      name: [''],
      surname:[''],
      email: ['', [Validators.required]],
      corso: [''],
      entrata:['',Validators.required],
      uscita:['',Validators.required]



    })
    this.startFineDefault.setHours(this.todayDate.getHours()+1)
    this.startFineDefault.setMinutes(this.todayDate.getMinutes())
    this.user =[{
      id:0,
      name:'',
      surname:'',
      email:'',
      courseId:0
    }]

    this.filteredUser =[{
      id:0,
      name:'',
      surname:'',
      email:'',
      courseId:0
    }]
    this.corsi = [{
      id:0,
      name: '',
      utenti: [{
        id:0,
        name:'',
        surname:'',
        email:''
      }]
    }]
    this.filterCourse = [{
      id:0,
      name: '',
      utenti: [{
        id:0,
        name:'',
        surname:'',
        email:''
      }]
    }]
    this.loadCorsi();
    this.loadUser();
    console.log(this.todayDate);




  }

  ngOnInit(): void {
    console.log(this.multipleInsert.name)
  }

  printDAte() {
  }

  addOrari(){
    const hoursEntrata = this.formNewUser.get('entrata')?.value.getHours();
    const minutesEntrata  = this.formNewUser.get('entrata')?.value.getMinutes();

    const hoursUscita = this.formNewUser.get('uscita')?.value.getHours();
    const minutesUscita  = this.formNewUser.get('uscita')?.value.getMinutes();
    const entrata = (hoursEntrata <= 9 ? '0' : '') + hoursEntrata + ':' + (minutesEntrata <= 9 ? '0' : '') + minutesEntrata;
    const uscita = (hoursUscita <= 9 ? '0' : '') + hoursUscita + ':' + (minutesUscita <= 9 ? '0' : '') + minutesUscita;
    console.log();
    let userToSave: UserDto = {
      name:'',
      surname:'',
      courseId:0,
      email:''
    }
    console.log(this.formNewUser.get('email')?.value.email +'l email')
    if(this.formNewUser.get('email')?.value.name != undefined){
      this.courseService.findUser(this.formNewUser.get('email')?.value.email).subscribe(users=>{
        console.log(users)
        userToSave.name = users.name;
        userToSave.surname = users.surname;
        if (users?.courseId != null) {
          userToSave.courseId = users?.courseId;
        }
        userToSave.email = users.email;
        const month = this.todayDate.getMonth()+1;
        const presenzaToSave: PresenzaToAdd ={
          userDto: userToSave,
          initialHour: entrata,
          finalHour: uscita,
          date:
            this.todayDate.getFullYear() +'-'+
            (month <= 9 ? '0' : '') + month +'-'+
            (this.todayDate.getDate() <= 9 ? '0' : '') + this.todayDate.getDate()


        }
        this.courseService.addPresenza(presenzaToSave).subscribe(res=>{

          this.required = false;
          this.formNewUser.get('email')?.reset();
          if(res.statusCode=='OK'){
            this.formNewUser = this.fb.group({
              name: [''],
              surname:[''],
              email: ['', [Validators.required]],
              corso: [''],
              entrata:['',Validators.required],
              uscita:['',Validators.required]
            })
            this.messageService.add({
              summary:'',
              severity: 'success',
              detail:'Presenza aggiunta correttamente',
              key:'tableCorsi'
            })
            this.loadUser();
            this.todayDate.setMinutes(0);
            this.todayDate.setSeconds(0);
          }else{
            this.messageService.add({
              summary:'',
              severity: 'info',
              detail:'Presenza già inserita per l\'utente specifico',
              key:'tableCorsi'
            })
          }

          console.log(res)
          setTimeout(()=>{
            if(!this.displayModalAddPresenza){
              this.formNewUser.reset();
              window.location.href = 'https://centro-studi-europa-2000-s-school.teachable.com/'
            }else{
              //window.location.reload();
            }
          },1000)
        }, (error:HttpErrorResponse) => {
          console.log(error)
          this.formNewUser.reset();


        })
      })
    }else{
      console.log('else')
      userToSave = {name:this.formNewUser.get('name')?.value,
        surname:this.formNewUser.get('surname')?.value,
        courseId:this.formNewUser.get('corso')?.value,
        email:this.formNewUser.get('email')?.value
      }
      const month = this.todayDate.getMonth()+1;
      const presenzaToSave: PresenzaToAdd ={
        userDto: userToSave,
        initialHour: entrata,
        finalHour: uscita,
        date:
          this.todayDate.getFullYear() +'-'+
          (month <= 9 ? '0' : '') + month +'-'+
          (this.todayDate.getDate() <= 9 ? '0' : '') + this.todayDate.getDate()


      }
      console.log(presenzaToSave);
      this.displayModalAddPresenza.emit(false);
      this.displayModalList.emit(true);
      this.courseService.addPresenza(presenzaToSave).subscribe(res=>{
        this.formNewUser = this.fb.group({
          name: [''],
          surname:[''],
          email: ['', [Validators.required]],
          corso: [''],
          entrata:['',Validators.required],
          uscita:['',Validators.required]
        })
        this.required = false;
        this.messageService.add({
          summary:'',
          severity: 'success',
          detail:'Presenza aggiunta correttamente',
          key:'tableCorsi'
        })
        console.log(res)
        this.loadUser();
        setTimeout(()=>{
          if(!this.displayModalAddPresenza){
          window.location.href = 'https://centro-studi-europa-2000-s-school.teachable.com/'
          }else{
            window.location.reload();
          }
        },1000)
      }, (error:HttpErrorResponse) => {
        console.log(error)
        this.messageService.add({
          summary:'',
          severity: 'danger',
          detail:'Presenza già inserita per l\'utente specifico',
          key:'tableCorsi'
        })

      })
    }


  }

  loadUser(){
    this.courseService.getAllUser().subscribe((users=>{
      this.user = users;
      this.filteredUser = users;
      this.spinner.hide();
      console.log(users)
    }))
  }
  loadCorsi(){
    this.corsi = [];
    this.courseService.getAllCourse().subscribe(res=>{
      console.log(res)
      this.corsi = res;
      this.corsi.forEach(res=>{
      })
    })

  }

  checkHour(){
    console.log('ci vado')
    this.startFineDefault.setHours(this.formNewUser.get('entrata')?.value.getHours()+1)
    this.startFineDefault.setMinutes(this.formNewUser.get('entrata')?.value.getMinutes())
  }
  autoComplete(){
    this.filteredUser = this.user.filter(c => c.email.includes(this.formNewUser.get('email')?.value));

    if(this.filteredUser.length==0){
      this.formNewUser.get('name')?.setValidators(Validators.required);
      this.formNewUser.get('surname')?.setValidators(Validators.required);
      this.formNewUser.get('corso')?.setValidators(Validators.required);
      this.required = true;
    }else{
      this.formNewUser.get('name')?.removeValidators(Validators.required);
      this.formNewUser.get('surname')?.removeValidators(Validators.required);
      this.formNewUser.get('corso')?.removeValidators(Validators.required);
      this.formNewUser.get('email')?.removeValidators(Validators.required);

      this.required = false;
    }

    this.output = this.numbers.filter(c => c.startsWith(this.formNewUser.get('email')?.value));
  }
  completeCourse(event: Event){
    let courseId = 0;
    this.courseService.findUser(this.formNewUser.get('email')?.value).subscribe(users=>{
      console.log(this.formNewUser.get('email')?.value)
      if (users?.courseId != null) {
        courseId = users?.courseId;
      }
    })
    if(courseId!=0){
    this.courseService.getCourse(courseId).subscribe(course=>{
      console.log(course)
      this.formNewUser.get('corso')?.setValue(course);
    })
    }
  }

  findByCourse() {
    const hoursEntrata = this.formNewUser.get('entrata')?.value.getHours();
    const minutesEntrata  = this.formNewUser.get('entrata')?.value.getMinutes();

    const hoursUscita = this.formNewUser.get('uscita')?.value.getHours();
    const minutesUscita  = this.formNewUser.get('uscita')?.value.getMinutes();
    const entrata = (hoursEntrata <= 9 ? '0' : '') + hoursEntrata + ':' + (minutesEntrata <= 9 ? '0' : '') + minutesEntrata;
    const uscita = (hoursUscita <= 9 ? '0' : '') + hoursUscita + ':' + (minutesUscita <= 9 ? '0' : '') + minutesUscita;
    this.courseService.findUserByCourse(this.course).subscribe({
      next: user => {
        console.log(user)
          let userToSave = {name:'',
            surname:'',
            email:''
          }
          const month = this.todayDate.getMonth()+1;
          const presenzaToSave: PresenzaToAdd ={
            userDto: userToSave,
            initialHour: entrata,
            finalHour: uscita,
            users:user,
            courseId:this.course,
            date:
              this.todayDate.getFullYear() +'-'+
              (month <= 9 ? '0' : '') + month +'-'+
              (this.todayDate.getDate() <= 9 ? '0' : '') + this.todayDate.getDate()


          }
          console.log(presenzaToSave);
          this.displayModalAddPresenza.emit(false);
          this.displayModalList.emit(true);
          this.presenzaService.addPresenzaList(presenzaToSave).subscribe(res=> {
            console.log(res)
          })

      }
    })


  }
}

