import { Component, OnInit } from '@angular/core';
import { Directive, forwardRef, Attribute,OnChanges, SimpleChanges,Input } from '@angular/core';
import { NG_VALIDATORS,Validator,Validators,AbstractControl,ValidatorFn } from '@angular/forms';
import {ApiService} from '../common/api.service';
import { NgForm } from '@angular/forms';
import {AppComponent} from '../app.component';


@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  city: any;
  msg: string = null;

  constructor(private _api:ApiService,private app:AppComponent) { 
    this.getLocation();
 
  }
  getLocation(){
   
    this.city=this.app.getCityName();
  }
  ngOnInit() {
    window.scrollTo(0, 0);
  }


  contactusSubmit(form:NgForm, isValid:boolean){

  
      if(form.valid){
        let tbody= this.getCRMTicketTerminology(form.value);
        
          this._api.ticketsHandling(tbody).subscribe(res =>{ 
            this.app.getNotify('Thank You for Contacing us.Our Customer Supporter will contact you soon by Email or call.');
          } );
          form.value.purpose="1";
          this._api.getToken().subscribe( 
            token => {
              form.value.TokenNo=token;
              let form2=form;
              delete form2.value["subject"];
          this._api.POST('ContactUs', form2.value).subscribe(data =>{ 
            let responce=JSON.parse(data.json).data;
        
              form.resetForm();
              
            });
          });
        
      }
    
  }
  getCRMTicketTerminology(data){
let responder_id=36007992185; //this is souwmy iyyer CRM main agent

let temp_arr={ "description": data.message,
"subject": data.subject,
"email": data.email,
"priority": 1,
"status": 2,
"cc_emails": ["sowmya.iyyer@tenetmedcorp.com","naresh.varma@tenetmedcorp.com"],
"source":9,
"name":data.username,
"responder_id": responder_id, 
"custom_fields":{"cf_location":this.city}
}
return temp_arr;
  }
  cityChange(cityName:any){
  
    this.city=cityName;
  }

}
