import { Component, OnInit } from '@angular/core';
import {ITasse} from "../../mock/tasse";
import {TasseService} from "../../services/tasse.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Corsi} from "../../mock/corsi";
import {CourseService} from "../../services/course-seervice.service";
import {NgxSpinnerService} from "ngx-spinner";
import {User} from "../../mock/user";

@Component({
  selector: 'app-tasse',
  templateUrl: './tasse.component.html',
  styleUrls: ['./tasse.component.scss']
})
export class TasseComponent implements OnInit {

  tasse: ITasse[];
  addTasse: boolean;
  formAddTasse: FormGroup
  cercaCorso: string;
  newCourse: boolean;
  corsi: Corsi[];
  supportSearch: Corsi[];
  selectFrormSearch: boolean;
  utenti:User[]
  showStudentDialog:boolean;
  constructor(private tasseService:TasseService, private fb: FormBuilder, private corsiService: CourseService, public spinner:NgxSpinnerService) {
    this.tasse = []
    this.corsi = [];
    this.supportSearch = [];
    this.utenti = []
    this.showStudentDialog = false;
    this.selectFrormSearch = false;
    this.loadTasse();
    this.addTasse = false;
    this.cercaCorso = '';
    this.newCourse = false;
    this.formAddTasse = this.fb.group({
      nomeCorso:['',Validators.required],
      dataInizio:[new Date(),Validators.required],
      dataFine:['',Validators.required],
      costo:[0,Validators.required]
    })
    this.loadCorsi();
  }

  ngOnInit(): void {
  }

  loadCorsi(){
    this.spinner.show()
    this.corsiService.getAllCourse().subscribe({
      next:(corsi:Corsi[])=>{
        this.corsi = corsi;
        this.supportSearch = corsi;
        this.spinner.hide();
      },error:err =>{
        console.log(err);
      }
    })
  }

  loadTasse(){

  }

  addTasseForm(){

  }

  newCorso(){
    this.newCourse = !this.newCourse
  }

  searchCourse(){
    this.utenti = []
    this.selectFrormSearch = false;
    console.log(this.cercaCorso)
    this.corsi= this.supportSearch;
   this.corsi = this.corsi.filter(c=>{
      return c.name.includes(this.cercaCorso);
    })
  }

  selectCorso(corso:Corsi){
    this.utenti = corso.utenti;
    this.formAddTasse.get('nomeCorso')?.setValue(corso.name)
    console.log(corso)
    this.selectFrormSearch = true;
  }

  showStudent(){
    this.spinner.show()
    this.showStudentDialog = !this.showStudentDialog;
  }

  setDate(){
    const inizio = new Date(this.formAddTasse.get('dataInizio')?.value)
    this.formAddTasse.get('dataFine')?.setValue(inizio.setMonth(inizio.getMonth()+1))
  }
}
