import { Component, OnInit, Inject,ViewChild, ElementRef,Input } from '@angular/core';
import {ApiService} from '../common/api.service';
import { HttpModule } from '@angular/http';
import {AppComponent} from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/timer';

import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
declare var swal: any;
import * as $ from 'jquery';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  cartCnt: any=0;
  @Input('form') form: NgForm;
  ismobile: boolean;
  new_mobile_number: any;
  old_mobile_number: any;
  cuid: any;
  parents: any;
  orderhistory: any;
  myFinalizedOrders2: any;
  model: any;
  partient_name: any;
  billDetails: any[]=[];
  myFinalizedOrders: any;
  addtovisible: any;
   model1:any;
  errorMessage:any;
  errorMessage1:any;
  resendotptime: any;
  tloop: Observable<number>;
  pform:any;
  fmForm:any;
  resendotpv: boolean=false;
  form1:any;
  IsTextBoxDisabled:boolean=false;

@ViewChild('add_family') add_family: ElementRef;
@ViewChild('edit_family') edit_family: ElementRef;
@ViewChild('add_address') add_address: ElementRef;
@ViewChild('edit_address') edit_address: ElementRef;
@ViewChild('otp_model') otp_model: ElementRef;
@ViewChild('otpModel') otpModel: ElementRef;
@ViewChild('oh') oh: ElementRef;
@ViewChild('muotp') muotp: ElementRef;
@ViewChild('muotp1') muotp1: ElementRef;
@ViewChild('btn1') btn1: ElementRef;
@ViewChild('btn2') btn2: ElementRef;
@ViewChild('btn3') btn3: ElementRef;
@ViewChild('btn4') btn4: ElementRef;
@ViewChild('updateMobile') updateMobile: ElementRef;
@ViewChild('edit_family1') edit_family1: ElementRef;
@ViewChild('addAddressBtn') addAddressBtn:ElementRef;
@ViewChild('ktm') ktm:ElementRef;
@ViewChild('user_mobile1') umb1:ElementRef;

  editimg:boolean;
  login_id: any;
  user: any = [];
  userInfo:any=[];
  obj:any=[];
  public _api:ApiService;
  tmp:number;
  sw:boolean=false;
  msg:string;
  basicInfo:boolean=true;
  editFlag:boolean=false;
  newArray:any =[];

  members:any=[];
  ms2:boolean=false;
  ms1:boolean=true;
  ms7:boolean=false;
  member:any=[];

  ms3:boolean=true;
  ms4:boolean=false;
  ms6:boolean=false;
  address:any=[];
  ms5:boolean=false;
  locations:any=[];
  public optionVal:number;
  areas:any=[];
  cities:any=[];
  cityId:number;
  location:any=[];
  user_loc_id:number;
  pwc:any=0;
  upm:boolean=false;
  fam:boolean=false;
  uam:boolean=false;
  fmem:boolean=false;
  public fms:any=[];
  public _appComponent:any;
  editBtn:boolean=true;
  defaultLocation:any=[];
  defaultAddress:any=[];
  
  doorNumber:any;
  streetNumber:any;
  profileMsg:boolean;
  fld:boolean;
  public loading = [];
  public config= {
    id: 'custom',
    itemsPerPage: 9,
    currentPage: 1
  };
ph:boolean=true;
otpBtn:boolean=false;
svBtn:boolean=true;
otp:boolean=false;
vBtn:boolean=false;
uid:number;
otherflag:boolean=false;
othereditflag:boolean;
mobileNumber:any;
address1:any;
editAddress:any;
memId:any;
oHsearch:any;
date = new Date();
FMname :any;
myOptions: INgxMyDpOptions = {
  // other options...
  dateFormat: 'dd-mm-yyyy',
  disableSince: { year: this.date.getUTCFullYear(), month: this.date.getUTCMonth() + 1, day: this.date.getUTCDate()+1},
  disableUntil :{ year: 1918, month: 1, day: 1},
};

myOptions1: INgxMyDpOptions = {
  // other options...
  dateFormat: 'yyyy-mm-dd',
  disableSince: { year: this.date.getUTCFullYear(), month: this.date.getUTCMonth() + 1, day: this.date.getUTCDate()+1},
  disableUntil :{ year: 1918, month: 1, day: 1},
};

// Initialized to specific date (09.10.2018)
  constructor(private el: ElementRef, private router :Router,_api :ApiService,_appComponent :AppComponent,private activerouter :ActivatedRoute) {
    this._api=_api;
    this._appComponent=_appComponent;
    this.user = JSON.parse(localStorage.getItem("user"));
    this.login_id=this.user.uid;
    this.orderhistory= this.activerouter.snapshot.paramMap.get('any');
    this.loading['account']=true;
    this.getRecData();
    let mobile= JSON.parse(localStorage.getItem("user_mobile"));
    this.ismobile=this._appComponent.isMobile();
   }
   setDate(){
    if(this.user.user_dob){
      let tdate;
      if(this.user.user_dob!==null||this.user.user_dob!==''){
        tdate=this.user.user_dob.split("/");
      }else{
        tdate=new Date();
      }
      this.model = { date: { year: tdate[2], month: tdate[1], day: tdate[0] } };//assign date to date-picker
     
    }
   }
   getRecData(){
    this.cartCnt=this._appComponent.cartCnt;
    this.getUserLocation(this.user.uid,0);
    this.getCities();
    this.getUserDetails();
    this._appComponent.setFlag();
    this.getParents();
     this.getFamilyMembers(this.user.uid);
   }
  
  ngOnInit() {
    this.tmp=1;
   this.getFamilyMembers(this.user.uid);
   this.getHistory();
   window.scrollTo(0, 0);
 
  }
  ngAfterViewInit(){
   if(this.orderhistory=='order-history'){
    this.oh.nativeElement.click();
   }
   
   }
  getHistory(){
    this.loading['getBills']=true;
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetFinalizedOrderHistory', {TokenNo: token,'patientid':this.user.uid,'mobileno':''}).subscribe(data =>{
      if(data.status==1){
        let a =JSON.parse(data.json).data;
        this.myFinalizedOrders=this.getArrayHumanDate(a);

         this.loading['getBills']=false;
      }else{
        
        this.myFinalizedOrders=[];
         this.loading['getBills']=false;
      }
      this.myFinalizedOrders2=this.myFinalizedOrders;
      });
    });
      }
      getArrayHumanDate(arr){
        let b=[]
        let i=0;
        arr.forEach(element => {
          b.push(element);
          b[i]['order_date']=this.getHumanDateWithSec(element.order_date);
          ++i;
        });
        return b;
      }

      getHumanDateWithSec(date){
        date=date.replace("/Date(","");
        date=date.replace(")/","");
        date=date.split("+");
        let hr=date[1].substring(0,2)*60*1000;
        let min=date[1].substring(2,4)*60*1000;
        let fdt=parseInt(date[0])+hr+min;
        let theDate = new Date(fdt);
        let dateString = theDate.toUTCString();
        return new Date(dateString).toString().replace(" GMT+0530 (India Standard Time)","");
        
      }

  getUserDetails(){
    this.user = JSON.parse(localStorage.getItem("user"));
     
     this._api.getToken().subscribe( 
      token => { 
    this._api.POST('GetUserDetails',{TokenNo: token,'user_id':this.user.uid}).subscribe(data =>{
      this.userInfo=JSON.parse(data.json).data;
     
      if(this.userInfo){
        this.user = this.userInfo[0];
        if(this.user.user_dob!==null){
          this.user.user_dob=this.getHumanDate(this.user.user_dob);
          this.setDate();
        }
        
        if(this.user.user_name!==null&&this.user.user_name!==''&&this.user.user_name!=='null'&&isNaN(this.user.user_name)){
          this.user.user_name = this.user.user_name.split(' ');
        }else{
          this.user.user_name=[];
          this.user.user_name[0]="";
          this.user.user_name[1]="";
        }
      
          this.user['firstname'] = this.user.user_name[0];
          this.user['lastname'] = this.user.user_name[1];
       
       
        this.loading['account']=false;
      }

      localStorage.setItem('user',JSON.stringify(this.userInfo[0]));
      localStorage.setItem('user_mobile',JSON.stringify(this.user.user_phone));
      this._appComponent.setFlag();
        
     });
    });
  }

  other(attrib:any){
    if(attrib=='title'){
        this.otherflag = false;
    }else{
       this.otherflag = true;
    }
   }

  editOther(attrib:any){
    
    if(attrib=='title'){
        this.othereditflag = false;
    }else{
       this.othereditflag = true;
    }
   }
   parseDate(date){
    
   
    if(date.formatted==undefined){
      
      date=date.date.year+'-'+date.date.month+'-'+date.date.day;
     
    }else{
      date=date.formatted;
      date=date.split("-")
      date=date[2]+'-'+date[1]+'-'+date[0];
    }
    
return date;
   }


   parseDateUpdate(date){
     
    if(date.formatted==undefined){
      date=date.year+'-'+date.month+'-'+date.day;
     
    }else{
      date=date.formatted;
      date=date.split("-")
      date=date[2]+'-'+date[1]+'-'+date[0];
    }
    return date;
   }

  updateProfile(profileInfo: NgForm, isValid: boolean,uid:number){
   this.loading['updateProfile']=true;
   profileInfo.value.user_dob=this.parseDate(profileInfo.value.user_dob);
 
     if(isValid){
    this._api.getToken().subscribe( 
      token => { 
        profileInfo.value.TokenNo =  token;
        profileInfo.value.user_id = uid;
        profileInfo.value.user_name = profileInfo.value.first_name+' '+profileInfo.value.last_name;
        profileInfo.value.user_name=profileInfo.value.user_name.toUpperCase();
    this._api.POST('UpdateFamilyMembers',profileInfo.value).subscribe(data =>{
      this.user=JSON.parse(data.json).data;
    
      this.user[0].uid = this.user[0].id;
      this.user=this.user[0];
      
      localStorage.setItem('user',JSON.stringify(this.user));
      this._appComponent.setFlag();
      this.editBtn=true;
      this.editFlag=false;
      this.basicInfo=true;
     
      this.profileMsg = true;
      this._appComponent.getNotify("Your profile has been updated successfully. You are one step closer to better health.");
      this.getRecData();
      if(this.cartCnt>0){
        this._appComponent.checkOut();
      }
     
      this.loading['updateProfile']=false;
     });
    });
 
    //default address
 if(this.locations.length==0){
  if(profileInfo.value.title_id3 == 3){
  this.address1 = profileInfo.value.other +','+profileInfo.value.doorNo;
  }else{
  this.address1 = profileInfo.value.doorNo;

  }

   this._api.getToken().subscribe( 
      token => { 
         let data = {
    'TokenNo':token,
    'title_id':profileInfo.value.title_id3,
    'user_id':profileInfo.value.user_id,
    'address':this.address1 ,
    'area_id':profileInfo.value.area_id,
    'city_id':profileInfo.value.city_id
   }

      this._api.POST('AddUserAddress', data).subscribe(data =>{
        this.address=JSON.parse(data.json).data;
        });
      })

  }else{

      if(profileInfo.value.title_id3 == 3){
       this.address1 = profileInfo.value.other +','+profileInfo.value.doorNo;
      }else{
      this.address1 = profileInfo.value.doorNo;

      }
  
    this._api.getToken().subscribe( 
      token => { 

    let data = {
    'TokenNo':token,
    'title':profileInfo.value.title_id3,
    'user_id':profileInfo.value.user_id,
    'user_loc_id':profileInfo.value.user_loc_id,
    'address':this.address1 ,
    'area_id':profileInfo.value.area_id,
    'city_id':profileInfo.value.city_id
   }

      this._api.POST('UpdateUserAddress', data).subscribe(data =>{
      this.address = JSON.parse(data.json).data;
       // this.uam=true;
        this.getUserLocation(this.user.uid,0);
         
      
      });
      })


  }
  
     }else{
      let target;
      target = this.el.nativeElement.querySelector('.ng-invalid') 
            if (target) {
                $('html,body').animate({ scrollTop: $(target).offset().top }, 'slow');
                target.focus();
            }

     }  
  } 

  showHide(num:number){
    this.tmp=num;
  }

  autoTab(event:any){
      if ( event.target.value.length >= event.target.maxLength && event.target.nextElementSibling ) 
       event.target.nextElementSibling.focus(); 

    }

  changePassword(form: NgForm, isValid: boolean,uid:number){

    if(isValid){
   
     this._api.getToken().subscribe( 
      token => { 
        let data = {
        "TokenNo":token, 
        "user_id":uid,  
        "oldpassword":form.value.oldpassword,  
        "newpassword":form.value.newpassword,
        }
        
     this._api.POST('ChangePassword',data).subscribe(data =>{
      let res=JSON.parse(data.json).data;
    
            if(res == undefined){
                 swal("Invalid current password");
                 form.resetForm();
              
            }else{
              
              if(form.value.oldpassword !== form.value.newpassword){

                      if(JSON.parse(data.json).status==1){
                      
                        swal("Password Changed Successfully");
                         form.resetForm();
                      }else{
                       
                        swal("Invalid User/Current Password");
                         form.resetForm();
                      }
                    
                     this._appComponent.toLogout();
                     this.router.navigate(['./home']);
                   }else{
                    
                    swal("Old and new passwords must be different");
                    form.resetForm();
                   }

            }
           
      
     });

    }); 
   }else{

   }

  }
    
  resetAf(form:NgForm){
    form.resetForm();
    this.ph =true;
  }
  revert(form:any){
     form.reset();
  }

  editInfo(){
    this.editFlag=true;
    this.basicInfo=false;
    this.editBtn =false;
   if(this.locations.length != 0){
         this.locations.forEach(element => {
             this.getAreaByCity1(element.city_id);
         });
    }
    if(this.locations.length==0){
                  
                this.fld=true;
               
             }else{
              this.fld=false;
              
             } 

  }

  getFamilyMembers(uid:number){

  let fm_dob:any;
  this.fms=[];
  this._api.getToken().subscribe( 
    token => { 
    this._api.POST('GetFamilyMembers', {TokenNo: token,'user_id':uid}).subscribe(data =>{
      this.members=JSON.parse(data.json).data;
      if(this.members){
        this.members.forEach(element => {
          
             fm_dob = this.getHumanDate(element.user_dob);
             let fm_dob1 = fm_dob.split('/');
             let date = fm_dob1[2]+'-'+fm_dob1[1]+'-'+fm_dob1[0];
            element.age=this.getAge(date);

             if(element.user_name){
                    let userName = element.user_name.split(' ');   
                    element.firstname = userName[0];
                    element.lastname =  userName[1];
            }


        });

      }else{
        this.members=[];
      }
    
     });
    });
  }

   changeDate(event:any){
      let memAge = this.getAge(event.target.value);
      let a:any = memAge.split(' ');
      if(a[0] >=18){
          this.ph = true;
        }else{
          this.ph = false;
        }
  }


    onDateChanged(event:any){
      let memAge = this.getAge(event.formatted);//yyyy/mm/dd
      let a:any = memAge.split(' ');
      if(a[0] >= 18){
          this.ph = true;
        }else{
          this.ph = false;

        }
  }

  deleteAddress(loc:any){
  swal({
  title: 'Are you sure?',
  text: "Are you sure that you want to delete address?",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
})
.then(willDelete => {
 this._api.getToken().subscribe( 
    token => { 
    this._api.POST('DeleteUserAddress', {TokenNo: token,'user_loc_id':loc.user_loc_id}).subscribe(data =>{
      let resp =JSON.parse(data.json).data;
       if(resp[0] == undefined){
       }else{
          
              if (willDelete) {
             
              this._appComponent.getNotify("Address deleted successfully");
              }
            this.getUserLocation(this.user.uid,0);
       }
   
     });
    });

});

  }

  deleteFM(mem:any){
    
  swal({
  title: 'Are you sure?',
  text: "It will permanently deleted !",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
})
.then(willDelete => {

this._api.getToken().subscribe( 
    token => { 
    this._api.POST('DeleteFamilyMember', {TokenNo: token,'user_id':mem.uid}).subscribe(data =>{
      let res =JSON.parse(data.json).data;
       if(res[0] == undefined){
       }else{
             if (willDelete) {
              this._appComponent.getNotify("Family Member deleted successfully");
              }
            this.getFamilyMembers(this.user.uid);
       }
   
     });
    });

});
  }
getAge(dateString:any) {
  
  let birthdate = new Date(dateString).getTime();
  let now = new Date().getTime();
  // now find the difference between now and the birthdate
  let n = (now - birthdate)/1000;
  if (n < 604800) { // less than a week
    let day_n = Math.floor(n/86400);
    return day_n + ' day' + (day_n > 1 ? 's' : '');
  } else if (n < 2629743) {  // less than a month
    let week_n = Math.floor(n/604800);
    return week_n + ' week' + (week_n > 1 ? 's' : '');
  } else if (n < 63113852) { // less than 24 months
    let month_n = Math.floor(n/2629743);
    return month_n + ' month' + (month_n > 1 ? 's' : '');
  } else { 
    let year_n = Math.floor(n/31556926);
    return year_n + ' year' + (year_n > 1 ? 's' : '');
  }
}

 diff_months(dt2, dt1) 
 {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
   diff /= (60 * 60 * 24 * 7 * 4);
  return Math.abs(Math.round(diff));
  
 }

    getHumanDate(date:any){
    date=date.replace("/Date(","");
    date=date.replace(")/","");
    date=date.split("+");
    let hr=date[1].substring(0,2)*60*1000;
    let min=date[1].substring(2,4)*60*1000;
    let fdt=parseInt(date[0])+hr+min;
    let theDate = new Date(fdt);
    let dateString = theDate.toUTCString();
    let date1 = theDate.getDate().toString()+'/'+(theDate.getMonth()+1).toString()+'/'+theDate.getFullYear().toString();
    
    return date1;
   
  }

  addFM(){
    this.ms2=true;
    this.ms1=false;
  }

  saveFamilyMembers(mem:NgForm,isValid:boolean, uid:number){
  if(isValid){
     let memAge = this.getAge(mem.value.user_dob.formatted);
      let a:any = memAge.split(' ');
     if(a[0] >= 18){
          this.ph = true;
         if(mem.value.user_mobile){
            this.otpModel.nativeElement.disabled = true;
                     mem.value.user_id = uid;
                     mem.value.user_name = mem.value.firstName+' '+mem.value.lastName;

                           this._api.getToken().subscribe( 
                              token => {
                                mem.value.TokenNo=token;
                                mem.value.user_dob = mem.value.user_dob.formatted;
                                this._api.POST('AddFamilyMembers', mem.value).subscribe(data =>{
                                let mems=JSON.parse(data.json).data;
                                this.mobileNumber = mem.value.user_mobile;
                                this.mobileNumber  = this.mobileNumber.replace(this.mobileNumber.substring(0,7),'XX');
                                this.FMname = mem.value.user_name;
                                this.fmForm = mem.value;
                              
                               this.errorMessage = "An OTP is has been sent to "+mem.value.user_name+"'s  mobile number "+this.mobileNumber;

                                mem.resetForm();
                                
                                this.add_family.nativeElement.click();
                                this.otpModel.nativeElement.disabled = false;
                                 this.otpModel.nativeElement.setAttribute("data-target", "#otp_model");
                                 this.otpModel.nativeElement.setAttribute('type','button');
                                 this.otpModel.nativeElement.click();

                                 this.ph=false;
                                 this.memId = mems[0].id;
                                 this.timerless(29);
                               
                               });
                              });
                          }else{
                           
                         window.alert("Mobile number is required");
                          }
      }else{
 this.otpModel.nativeElement.disabled = true;
        this.ph=false;
        this._api.getToken().subscribe( 
          token => {
          
           mem.value.user_name = mem.value.firstName+' '+mem.value.lastName;
                let data = {
                "TokenNo":token,
                "user_dob":mem.value.user_dob.formatted,
                "user_gender": mem.value.user_gender,
                "user_id":uid,
                "user_name":mem.value.user_name,
                "user_email":'',
                "user_mobile":''
                 }
                  this.FMname = mem.value.user_name;

        this._api.POST('AddFamilyMembers', data).subscribe(data =>{
            let mems=JSON.parse(data.json).data;
            
            this._appComponent.getNotify("We have added "+this.FMname+" as your family member to your Tenet Profile");
            this.add_family.nativeElement.click();
            this.otpModel.nativeElement.disabled = false;
            this.ph=false;
            this.fmForm = mem.value;
            mem.resetForm();
           
            this.getFamilyMembers(this.user.uid);
           });
          });


      }

    }else{
       
        this._appComponent.getNotify("Fields marked with the * are mandatory ");
    }
  
   }

   getMemberOtpVerification(form: NgForm,isValid: boolean,memId:any){
      if(isValid){

        this._api.getToken().subscribe( 
      token => {  
          let data = {
            "TokenNo":token,
            "otp":form.value.term1+form.value.term2+form.value.term3+form.value.term4,
            "user_id":memId
          }
       
    this._api.POST('GetMemberOtpVerification', data).subscribe(data =>{
       let resp=(JSON.parse(data.json).data);
       if(resp ==undefined){
        
         this.errorMessage = "Invalid OTP";
          form.resetForm();
       }else{

         if(resp[0].uid!=null){ 
         
         
          this._appComponent.getNotify("We have added "+this.FMname+" as your family member to your Tenet Profile");
           form.resetForm();
        this.otp_model.nativeElement.click();
            this.getFamilyMembers(this.user.uid);

              this.otpModel.nativeElement.removeAttribute("data-target");
             this.otpModel.nativeElement.setAttribute("type","submit");   
            
          }else{
         
           swal("OTP verification failed");
           form.resetForm();
          }

       }
        
       });

      });

      }else{

      }
    
  }
    timerless(t){
  this.resendotptime=t;
  this.tloop=Observable.timer(1000);
  this.tloop.subscribe(()=>{
    
    if(t>0){
      this.timerless(t-1);
    }
  })
}

  getresendotptime(){
   
    return this.resendotptime;
  }

   resendOTP(attrib:any,login_id){
   
    this.resendotpv=true;
    if(attrib=='user'){
      this.form1 ={"value":{"login_user_id":login_id, "user_id": this.pform.userid, "old_mobile_no": this.pform.user_old_mobile1, "new_mobile_no": this.pform.user_new_mobile1}};
    }else{
      this.form1 ={"value":{"login_user_id":login_id, "user_id": this.pform.userid, "old_mobile_no": this.pform.user_old_mobile, "new_mobile_no": this.pform.user_new_mobile}};
    } 
    this.umResendOtp(this.form1,true,login_id);
    }

   umResendOtp(form,valid,login_id){

this._api.getToken().subscribe( 
      token => {
          let data ={
            'TokenNo':token,
            'login_user_id':this.form1.value.login_user_id,
            'user_id':this.form1.value.user_id,
            'old_mobile_no':this.form1.value.old_mobile_no,
            'new_mobile_no':this.form1.value.new_mobile_no,
           }

             this._api.POST('UpdateMobleNumber', data).subscribe(data =>{
             let dt=JSON.parse(data.json).data;

             if(dt== undefined){
              alert("undefined");
             }else{

               // swal("An otp has been sent to ur mobile number");
                this.ktm.nativeElement.setAttribute('data-target','#update_mobile_verify1');
                this.ktm.nativeElement.setAttribute('type','button');
                if(this.resendotpv !== true){
                  this.ktm.nativeElement.click();
                }

                this.ktm.nativeElement.removeAttribute('data-target');
                this.ktm.nativeElement.setAttribute('type','submit');
                this.timerless(29);

             }

             });
              })

   
   }


      afResendOTP(mid){
     this.resendotpv=true;


     let form2 ={"value":{"user_id":mid, "user_name":this.fmForm.user_name, "user_email":this.fmForm.user_email, "user_mobile":this.fmForm.user_mobile,"user_dob":this.fmForm.user_dob,"user_gender":this.fmForm.user_gender}};
  
      this.saveFamilyMembers1(form2,true,mid);
     }

    saveFamilyMembers1(form,isValid, mid){
     
      let memAge = this.getAge(form.value.user_dob);
                     form.value.user_id = mid;
                           this._api.getToken().subscribe( 
                              token => {
                                form.value.TokenNo=token;
                                this._api.POST('AddFamilyMembers', form.value).subscribe(data =>{
                                let mems=JSON.parse(data.json).data;
                              
                                this.mobileNumber = form.value.user_mobile;
                                this.mobileNumber  = this.mobileNumber.replace(this.mobileNumber.substring(0,7),'XX');
                                this.FMname = form.value.user_name;
                                this.errorMessage = "An OTP is has been sent to "+form.value.user_name+"'s  mobile number "+this.mobileNumber;
                                this.otpModel.nativeElement.setAttribute("data-target", "#otp_model");
                                this.otpModel.nativeElement.setAttribute('type','button');

                                 if(this.resendotpv !== true){
                                    this.otpModel.nativeElement.click();
                                  }

                                  this.otpModel.nativeElement.removeAttribute("data-target", "#otp_model");
                                  this.otpModel.nativeElement.setAttribute('type','submit');

                                 this.ph=false;
                                 this.memId = mems[0].id;
                                 this.timerless(15);
                               
                               });
                              });
      
   }


    reset(form:any){
        form.resetForm();
        
    }

    resetA(form:any){

      form.reset({
      'title_id': '',
      'doorNo': '',
      'city_id': '',
      'area_id': '',
     });

    }
    
    reset1(form:NgForm){
    form.resetForm();
    this.otpModel.nativeElement.removeAttribute("data-target");
    this.otpModel.nativeElement.setAttribute("type","submit");
   }
    hm1(){
    this.ms1=false;
    }
    hm2(){
    this.ms2=false;
    this.ms1=true;
    }
   addLoc(){
   this.ms3=false;
   this.ms4=true;
   }
   hm3(){
     this.ms3=false;
   }

   hm4(){
     this.ms3=true;
     this.ms4=false;
   }
   hm5(){
     this.ms6=false;
     this.ms3=true;
   }
    hm6(){
     this.ms7=false;
     this.ms1=true;
    }


   editFMInfo(fmid:number){
    this.ms7=true;
    this.hm1();
      this.members.forEach(element => {
        if(element.uid === fmid){
            this.member = element;
            if(this.member.gender=='M'){
              this.member.gender=1;
            }
            if(this.member.gender=='F'){
              this.member.gender=2;
            }

          if(this.member.user_phone)
          {
             this.ph=true;
          }else{
             this.ph=false;
          }
            this.member.user_dob=this.getHumanDate(this.member.user_dob);
            let memAge = this.getAge(this.member.user_dob);
             let b:any = memAge.split(' ');
           
            if(b[0] >= 18){
              this.ph=true;
              this.IsTextBoxDisabled =true;
            }else{
              this.ph=false;
              this.IsTextBoxDisabled =false;
            }
        this.member.user_name = this.member.user_name.split(' ');
        this.member['firstname'] = this.member.user_name[0];
        this.member['lastname'] = this.member.user_name[1];
        this.member['gendr'] = this.member.gender;
            let edate=this.member.user_dob.split("/");
            this.model1 = { date: { year: edate[2], month: edate[1], day: edate[0] } };//assign date to date-picker
        }
    });
    
   }

    updateFamilyMembers(fmInfo:NgForm,isValid:boolean,fmid:number){

   
    if(isValid){
      fmInfo.value.user_dob1.date=this.parseDateUpdate(fmInfo.value.user_dob1.date);
      
        fmInfo.value.user_mobile1 = (fmInfo.value.user_mobile1) ? fmInfo.value.user_mobile1 : "";
        fmInfo.value.user_name1 = fmInfo.value.firstName1+' '+fmInfo.value.lastName1;
          let data= {
        "TokenNo":"",
        "user_id":fmid,
        "user_name":fmInfo.value.user_name1,
        "user_email":fmInfo.value.user_email1,
        "user_mobile":fmInfo.value.user_mobile1,
        "user_dob":fmInfo.value.user_dob1.date,
        "user_gender":fmInfo.value.user_gender1,
       }

     this._api.getToken().subscribe( 
      token => {
      data.TokenNo= token;
     this._api.POST('UpdateFamilyMembers',data).subscribe(data =>{
      let mems=JSON.parse(data.json).data;
      this.edit_family1.nativeElement.click();
      this._appComponent.getNotify(fmInfo.value.user_name1+"'s details have been updated successfully!");
        fmInfo.resetForm();
      this.getFamilyMembers(this.user.uid);
     });

    });

    }else{
      this._appComponent.getNotify("Fields marked with the * are mandatory .");
    }
  }

  addUserAddress(address_info:NgForm,isValid:boolean, uid:number){
      if(isValid){
        this.addAddressBtn.nativeElement.disabled = true;
     address_info.value.user_id=uid;
     address_info.value.state_id=1;
     address_info.value.country_id=1;
    if(address_info.value.title_id == 3){

      address_info.value.address = address_info.value.other +','+address_info.value.doorNo;
      }else{
      address_info.value.address = address_info.value.doorNo;

      }

  
      this._api.getToken().subscribe( 
        token => {
      address_info.value.TokenNo= token;
      this._api.POST('AddUserAddress', address_info.value).subscribe(data =>{
      this.address=JSON.parse(data.json).data;
      if(this.address==undefined){
            }else{ 
             this.add_address.nativeElement.click(); 
             this.addAddressBtn.nativeElement.disabled = false;
            
             this._appComponent.getNotify("Your address has been updated successfully!");
             address_info.resetForm(); 
           
            this.getUserLocation(this.user.uid,0);
          
            }
      
      });
    });
    }else{
      this._appComponent.getNotify("Fields marked with the * are mandatory ");
    }
   }

   getUserLocation(uid:number,tid:number){
     this.loading['address']=true;
    this._api.getToken().subscribe( 
      token => {
       this._api.POST('GetUserAddress', {TokenNo: token,'uid':uid}).subscribe(data =>{
     let res =JSON.parse(data.json).data;
              if(res==undefined){
             this.defaultAddress=[];
             this.locations=[];
             
         }else{

          if(JSON.parse(data.json).data.length > 0){
            this.locations=JSON.parse(data.json).data;
              this.locations.forEach(element => {
              this.location = element;
              this.location.address = element.address.toString().split(',');
              if(element.title_id==3){
               this.location['addrs'] = this.location.address[1];
               this.location['other'] = this.location.address[0];
             }else{
               this.location['addrs'] = this.location.address[0];
               this.location['other'] = '';

             }

             });

           }else{
             this.defaultAddress=[];
             this.locations=[];
           }


         }
             if(this.locations.length==0){
                  this.editInfo();
                
             } 
               this.loading['address']=false;
            
       
      });
    });

   }
   getCities(){
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetCity',{TokenNo: token}).subscribe(data =>{
      this.cities=JSON.parse(data.json).data;
      if(this.areas==undefined){
         this.areas=[];
      }else{

      }
      
     });
    });
   }

   getAreaByCity(event){
     this.loading['area1']=true;
     this.optionVal = event.target.value;
     this._api.getToken().subscribe( 
      token => {
      this._api.POST('GetAreasByCity',{TokenNo: token,'City_id':this.optionVal}).subscribe(data =>{
      this.areas=JSON.parse(data.json).data;
     if(this.areas==undefined){
      this.areas=[];
      this.areas['area_cd']='';
         this.areas['area_id']='';
         this.areas['area_name']='SELECT AREA';
         this.areas['city_id']='';
         this.areas['pincode']='';
       
     }else{
        this.areas=JSON.parse(data.json).data;
        this.loading['area1']=false;
     }

     });
    });
    
   }

   getAreaByCity1(cityId:number){
    this.loading['area']=true;
      this.cityId = cityId;
      this._api.getToken().subscribe( 
        token => {
      this._api.POST('GetAreasByCity',{TokenNo: token,'City_id':cityId}).subscribe(data =>{
      this.areas=JSON.parse(data.json).data;
      this.loading['area']=false;
     });
    });
    
   }

editFMAddress(uid:number,user_loc_id:number){
    this.locations.forEach(element => {
      
        if(element.user_loc_id === user_loc_id){
             this.location = element;
        
             if(element.title_id==3){
               this.location.address = this.location.address.toString().split(',');
               this.location['addrs'] = this.location.address[1];
               this.location['other'] = this.location.address[0];
              this.location['cty'] = this.location.city_id;
              this.location['ttl_id'] = this.location.title_id;
              this.location['areaa_id'] = this.location.area_id;
             }else{
               this.location.address = this.location.address.toString().split(',');
               this.location['addrs'] = this.location.address[0];
               this.location['other'] = '';
               this.location['cty'] = this.location.city_id;
               this.location['ttl_id'] = this.location.title_id;
               this.location['areaa_id'] = this.location.area_id;
             }
           
            this.getAreaByCity1(this.location.cty);
        }

         
    });
    this.user_loc_id=user_loc_id;
    this.ms6=true;
    this.ms3=false;

   }

  updateUserAddress(address_info:NgForm,isValid:boolean,uid:number){
   
    if(isValid){
      if(address_info.value.title_id1 == 3){
        this.editAddress= address_info.value.other1+','+address_info.value.doorNo1;
      }else{
         this.editAddress= address_info.value.doorNo1;
      }

      let data = {
            "TokenNo":"",
            "user_loc_id":address_info.value.user_loc_id,
            "user_id" : uid,
            "title":address_info.value.title_id1,
            "address":this.editAddress,
            "city_id":address_info.value.city_id1,
            "area_id":address_info.value.area_id1
        }

        this._api.getToken().subscribe( 
          token => {
            data.TokenNo= token;
          this._api.POST('UpdateUserAddress', data).subscribe(data =>{
          this.address=JSON.parse(data.json).data;
             this.edit_address.nativeElement.click();  
            this._appComponent.getNotify("Your address has been updated successfully!");
             address_info.resetForm();
            this.getUserLocation(this.user.uid,0);
          });
        });
    }else{
      this._appComponent.getNotify("Fields marked with the * are mandatory  ");
    }
   }
   getBillDetails(bill_no){
  window.open('./bill-view/'+bill_no,"_blank");
   this.loading['billDetails']=true;
    this.billDetails=[];
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetOrderDetails', {TokenNo: token,'orderno':bill_no,'mobileno':'',"type":""}).subscribe(data =>{
      this.billDetails=JSON.parse(data.json).data;
   this.partient_name=this.billDetails[0].patient_name;
   this.loading['billDetails']=false;
      });
    });
  }
  downloadReport(tid:any,bill_no:any){
    this.loading['reportDownload']=true;
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetFinalReport', {TokenNo: token,'service_id':tid,'orderno':bill_no}).subscribe(data =>{
     let file=JSON.parse(data.json).data;
     let str=file[0].message;
     if(str.substring(str.length - 1, str.length)===','){
      str=str.substring(0, str.length - 1); 
     }
    
      this.previewReport(str);
      this.loading['reportDownload']=false;
   
      });
    });
  
  }
  previewReport(file:any){
    window.open('http://208.163.37.165/Intgcems/orderinvoice/'+file, '_blank');
  }
  ser(term){
    let b=this.searchValues(term);
    this.myFinalizedOrders2=b;
  }
  searchValues(term){
    return term 
    ? this.myFinalizedOrders.filter(item =>((this.inString(item.customer_name,term))||(this.inString(item.test_name,term))||(this.inString(item.bill_no,term))))
    : this.myFinalizedOrders;
  }
  inString(thread,needle){
    if(thread!==null){
      if(thread.toLowerCase().indexOf(needle.toLowerCase())>=0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  
  }
  serviceDetails(tname,type){
    if(type==0){
      this._appComponent.select(tname,'package');
    }else if(type==1){
      this._appComponent.select(tname,'test');
      
    }

  }
  getParents(){
    this.loading['access']=true;
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetParentDetails', {TokenNo: token,'user_id':this.login_id}).subscribe(data =>{
     let dt=JSON.parse(data.json).data;
    if(dt!==undefined){
      this.parents=dt;
    }else{
      this.parents=[];
    }
      this.loading['access']=false;
        });
    });
  }
  removeParent(pid:number){
    if(confirm("Are You Sure, do you want to delete this access?")){
      this.loading['access']=true;
      this._api.getToken().subscribe( 
        token => {
      this._api.POST('DeleteParent', {TokenNo: token,'childid':this.login_id,'parentid':pid}).subscribe(data =>{
       let dt=JSON.parse(data.json).data;
    
        this.loading['access']=false;
            });
      });
    }else{
      this.loading['access']=false;
    }
  

  }
  updateMobileGetOtp(form,valid,login_id){
    
    if(valid){
     this.pform=form.value;
      this._api.getToken().subscribe( 
        token => {
      this._api.POST('UpdateMobleNumber', {TokenNo: token,login_user_id:login_id,user_id:this.pform.userid,old_mobile_no:this.pform.user_old_mobile1,new_mobile_no:this.pform.user_new_mobile1}).subscribe(data =>{
       let dt=JSON.parse(data.json).data;
       
       this.old_mobile_number=dt[0].old_mobile_no;
       this.new_mobile_number=dt[0].new_mobile_no;
       this.errorMessage1 ="An OTP has been sent to "+this.getPhoneSubStr(0,1)+"XXXXXX"+this.getPhoneSubStr(7,10);
       this.muotp.nativeElement.click();
    
       this.timerless(29);
        this.loading['access']=false;
    
     
        });
      });

    }else{
      
    }

  }
    updateMobileGetOtp1(form,valid,login_id){
    
    if(valid){
      this.pform=form.value;
      this._api.getToken().subscribe( 
        token => {
      this._api.POST('UpdateMobleNumber', {TokenNo: token,login_user_id:login_id,user_id:this.pform.userid,old_mobile_no:this.pform.user_old_mobile,new_mobile_no:this.pform.user_new_mobile}).subscribe(data =>{
       let dt=JSON.parse(data.json).data;
       
       this.old_mobile_number=dt[0].old_mobile_no;
       this.new_mobile_number=dt[0].new_mobile_no;
      this.errorMessage1 ="An OTP has been sent to "+this.getPhoneSubStr(0,1)+"XXXXXX"+this.getPhoneSubStr(7,10);
       this.btn3.nativeElement.click();
       this.muotp1.nativeElement.click();
       this.timerless(29);
        this.loading['access']=false;
        });
      });

    }

  }
  updateMobileOtpVerify(form,valid,login_id){
    if(valid){
      let pform=form.value;
      let otp=form.value.term1+form.value.term2+form.value.term3+form.value.term4;
     
      this._api.getToken().subscribe( 
        token => {
      this._api.POST('OTPVerificationforUpdateMobleNumber', {TokenNo: token,login_user_id:login_id,user_id:this.cuid,old_mobile_no:this.old_mobile_number,new_mobile_no:this.new_mobile_number,otp:otp}).subscribe(data =>{
       let dt=JSON.parse(data.json).data;
       if(dt==undefined){
              this.errorMessage1 = "Invalid OTP";
              form.resetForm();
       }else{
       this._appComponent.getNotify("Mobile Number Changed Successfully!");
       this.getRecData();
       this.btn1.nativeElement.click();
       this.btn2.nativeElement.click();
       }

        });
      });

    }

  }

    updateMobileOtpVerify1(form,valid,login_id){
    if(valid){
      let pform=form.value;
      let otp=form.value.term1+form.value.term2+form.value.term3+form.value.term4;
      
      this._api.getToken().subscribe( 
        token => {
      this._api.POST('OTPVerificationforUpdateMobleNumber', {TokenNo: token,login_user_id:login_id,user_id:this.cuid,old_mobile_no:this.old_mobile_number,new_mobile_no:this.new_mobile_number,otp:otp}).subscribe(data =>{
       let dt=JSON.parse(data.json).data;
     
       if(dt==undefined){
              this.errorMessage1 = "Invalid OTP";
              form.resetForm();
       }else{

       this._appComponent.getNotify("Mobile Number Changed Successfully!");
      this.btn4.nativeElement.click();
      this.getFamilyMembers(login_id);
       }
      

        });
      });
    }

  }
  currentUpdatingUser(uid){
    
    this.cuid=uid;
  }
  currentUpdatingUser1(uid){
     this.cuid=uid;
     this.edit_family1.nativeElement.click();
     
  }

  getPhoneSubStr(mi,mx){
    if(this.new_mobile_number){
      return this.new_mobile_number.substring(mi,mx);
    }else{
      return "";
    }
  }
  


  
}
