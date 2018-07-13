import {Component, OnInit,ViewChild, ElementRef} from '@angular/core';
// import {StateService} from '../common/state.service';
import {ApiService} from '../common/api.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {NgForm, FormControl,Validators} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { BookComponent } from "../book/book.component";
import {NotificationsService} from 'angular4-notify';

declare var swal: any;
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
 // providers:[ApiService]
})
export class HomeComponent implements OnInit {

   @ViewChild('btn1') btn1: ElementRef;
   @ViewChild('otpM') otpM: ElementRef;
   @ViewChild('otp_modal') otp_modal: ElementRef;
   @ViewChild('otp_modal1') otp_modal1: ElementRef;
   @ViewChild('forget_password_modal') forget_password_modal: ElementRef;

    @ViewChild('someVar') inputEl:ElementRef;
    @ViewChild('save1') save1:ElementRef;
     @ViewChild('searchString') searchString1:ElementRef;
     @ViewChild('repsea1') repsea1:ElementRef;
     @ViewChild('repsea2') repsea2:ElementRef;
     

    public uid:number;
    ser_string:any;
  ptype: string="H";
  _packages1: any[];
  temp2: any[];
  _tempTest: any[];
  windowRef: any = [];
  _packagesSearchResult: any = [];
  getpackagecnf: boolean;

  searchTerm : FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  searchResult = [];
  _packages:any=[];
  public filterKey:any;

    addW: any;
    title: string = 'Center for Excellence Medical Sciences';
  body:  string = 'This is the about home body';
  message: string;
  image_path: string="/assets/images/imagehbg.png";
  geolocationPosition :object;
  testList: any;
  public _appComponent:any;
  
  latitude:any;
  longitude:any;
  queryString:any;
  ban_path="sliders";
  images:string[]=[this.ban_path+"/1.jpg",this.ban_path+"/2.jpg",this.ban_path+"/3.jpg",this.ban_path+"/4.jpg",this.ban_path+"/5.jpg",this.ban_path+"/6.jpg",this.ban_path+"/7.jpg",this.ban_path+"/8.jpg"]
  images1:string[]=["iconimages/homepage_presn_slider/1.png"];
  top_tests:string[]=["Complete Blood Picture (CBP), EDTA Whole Blood","Lipid Profile, Serum","Liver Function Test (LFT), Serum","Thyroid Antibodies (TG & TPO), Serum","Thyroid Profile (T3,T4,TSH), Serum","1, 25-Dihydroxy Vitamin D, Serum","25 - Hydroxy Vitamin D, Serum","Urea, Serum","Creatinine, Serum","Triple Marker, Serum","Magnesium, Serum"
                      ,"Complete Urine Examination (CUE), Spot Urine","Glucose Fasting (FBS),  Sodium Flouride Plasma","Glycosylated Hemoglobin (HbA1C), EDTA Whole Blood","Uric Acid, Serum","Thyroglobulin (Tg), Serum","Blood Urea Nitrogen (BUN), Serum","Prolactin, Serum","Prothrombin Time With INR, Sodium Citrate Whole Blood","HIV 1 & 2 Antibodies, Serum","Culture And Sensitivity (Aerobic), Urine"];
  loading:any=[];
  mpckgshow:boolean=false;
  _pckg:any=[];
  tmp:any=[];
  tokenSet:boolean=false;

  sotp:boolean=false;
  fotp:boolean =false
  phneNo:any;
  ivotp:boolean =false;
  otps:boolean = false;
  msg:boolean=false;
  mobilenoExists:boolean=false;


   constructor(private _api:ApiService,private router :Router,_appComponent :AppComponent,private el: ElementRef) { 
   
       this._appComponent=_appComponent;
        this.tokenSet=this._appComponent.isLoggedIn;
       if(this._appComponent.isMobile()){
         this.ban_path="sliders/mobile";
         let tempbans=[];
         this.images.forEach(element => {
           tempbans.push(element.replace("sliders", this.ban_path));
         });
         this.images=tempbans;
       }
        this.queryString;
        
        this.searchTerm.valueChanges
        .debounceTime(400) 
        .subscribe(data => {
        let term = new String(data); 
        if(data==undefined){
          this.mpckgshow=false;
          return false;
        }
       
        if(term.length >=3){
      
          this._api.getToken().subscribe( 
            token => { 
        this._api.POST('GetServices', {TokenNo: token,pincode:'' ,test_name:data,test_code:'',test_type:'',condition_id:'',speciality_id:'',sort_by:'',sort_order:'',AlphaSearch:'',user_id:'',is_home_collection:"",organ_id:"",city_name:this._appComponent.getCityName()}).subscribe(data =>{
                        if(data.status==1){
                          this.searchResult=JSON.parse(data.json).data;
                        }else{
                          this.searchResult=[];
                        }
                         
                       });
                      });
                    
     this._api.getToken().subscribe( 
                        token => { 
         this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":"H",city_name:this._appComponent.getCityName()}).subscribe(data =>{
                  if(data.status==1){

                    this._packagesSearchResult=JSON.parse(data.json).data;
                  
                  }else{
                    this._packagesSearchResult=[];
                  }
                  this.mpckgshow=true;
               });
              });

             }      
        })
      
     }
 getlocation(){
  if (window.navigator && window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(
        position => {
          this.geolocationPosition = position;
         this._appComponent.getPostalCode(this.parselatlang());    
        },
        error => {
            switch (error.code) {
                case 1:
                    console.log('Permission Denied');
                    break;
                case 2:
                    console.log('Position Unavailable');
                    break;
                case 3:
                    console.log('Timeout');
                    break;
            }
        }
    );
};
 }
  ngOnInit() {
    this.getlocation();
    localStorage.setItem('showCart',"false");
    this.getPackages();
    window.scrollTo(0, 0);
  }
  parselatlang(){
   let a= this.getCordinates();
   let lat=a['coords']['latitude'];
   let long=a['coords']['longitude'];
   let res={"latitude":lat,"longitude":long}
   return res;
  }

   getOTP(frm,vald){
    this._appComponent.checkRepo=true;
  
   this._appComponent.toLogin();
  }
 

   autoTab(event:any){
      if ( event.target.value.length >= event.target.maxLength && event.target.nextElementSibling ) 
       event.target.nextElementSibling.focus(); 

    }

  reset(form:NgForm){
    form.resetForm();
    
  }
    reset1(form:NgForm){
    form.resetForm();
    this.otpM.nativeElement.removeAttribute("data-target");
    this.otpM.nativeElement.setAttribute("type","submit");
    
  }

 goToCart(){
    this._appComponent.goToCart();
  }

  getCordinates(){
      return this.geolocationPosition;
  }
  getBookAnAppointment(){
   
     this.router.navigate(['./book/tests']);
  }

   searchBasedOnString(str:any){
    
     if(str != undefined){
        this.router.navigate(['./book/tests', {searchString:str}]);
      }else{
        return false;
      }
    
  }
  movescaro(obj:any,dir:any){
     if(dir=="left"){
        obj.previous();
     }else if(dir=="right"){
        obj.next();
     }
    
  }
  showHover(val){
      this.addW=val;
  }

  eventHandler(event) {
  

   }
   getPackages(){
    this.mpckgshow=false;
     this.loading['packages']=true;
     this._packages=[];
    this._api.getToken().subscribe(
      token => {
     this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":"","package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":"H",city_name:this._appComponent.getCityName()}).subscribe(data =>{
      if(data.status==1){
        let p=JSON.parse(data.json).data;
        p.forEach(element => {
          if(element.package_price>0){
            this._packages.push(element);
          }
        });
      
        this.loading['packages']=false;
  
      }else{
        this.getpackagecnf=true;
        this._packages=[];
        this.loading['packages']=false;
      }
      
      return this._packages;
    
     });
    });
   }

   //add pckg cart from here
   getAddPackageCart(pckg:any){
   this._pckg=[];
   let pshare = JSON.parse(localStorage.getItem('packages')); 
    if(pshare){
  
        this.tmp=JSON.parse(localStorage.getItem('packages'));
        this.tmp.forEach(element => {
                  this._pckg.push(element);  
              });

       if(this.IndexOf(pckg) < 0){
           pckg.quant=1;
        this._pckg.push(pckg);
       }else{ 
        let i=this.IndexOf(pckg);
        let t=this._pckg[i].quant;
        t=t+1;
        this._pckg[i].quant=t;
       }
    }else{
    
      pckg.quant=1;
      this._pckg.push(pckg);
    }
    localStorage.setItem('packages',JSON.stringify(this._pckg));
    this._appComponent.getNotify(pckg.package_name+" has been added to your cart.");
    this._appComponent.setCart();

  }

   getRemovePackageCart(pckg:any){
    let i=this.IndexOf(pckg);
    let t=this._pckg[i].quant;
    if(t>1){
      t=t-1;
      this._pckg[i].quant=t;
      localStorage.setItem('packages',JSON.stringify(this._pckg));
      this._appComponent.setCart()
    }

  }

    getPckgQuant(pckg:any){
    let b=1;
    if(this.IndexOf(pckg)>=0){
      b=this._pckg[this.IndexOf(pckg)].quant;
    }
  
    return b;
   }

    IndexOf(p){
        for (var i = 0; i < this._pckg.length; i++) {
        

            let a=this._pckg[i];
            let b=p;
            if (a.id===b.id) {

                return i;
            }
        }
        return -1;
    }
    getPopularTests(strng){
      if(strng===''){
        return this.top_tests;
      }else{
        return [];
      }
      
    }
    loginSubmit(form: NgForm,isValid: boolean){
      
    
      let data={
          "TokenNo":"",  
          "login_username":form.value.phone,
          "password":form.value.password1
          };
       
        
          if(isValid){
            this._api.getToken().subscribe( 
            token => {
              data.TokenNo=token;
              this._api.POST('GetLoginUser',data).subscribe(data =>{
                  let res=JSON.parse(data.json).data;
                    if(res==undefined){
                      swal("<small>Invalid Authentication.</small>");
                      form.resetForm(); 
                    }else{
                       
                        if(res[0].user_token != null){
                          localStorage.setItem('token',res[0].user_token);
                          localStorage.setItem('user',JSON.stringify(res[0]));
                        
                         this.router.navigate(['./account/order-history']);
                               
                                
                        }else{
                        
                          
                          form.resetForm(); 
                        }
                    }
    
    
              });
    
            })
    
          }else{
              
          }
    
      }
      redir(val:string){
        window.location.href="./"+val;
      }
      isadded(tid:number):boolean{
     
        let stest= JSON.parse(localStorage.getItem('tests')); 
      
        let a=false;
        if(stest){
          stest.forEach(element => {
            if(element.tid===tid){
              a=true;
            }
          });
        }
      return a;
      }
      /*package add,quant by sharath start*/
      testQuantPlus(tid){
        this._appComponent.quantAddByIndex(tid);
      }
      testQuantMinus(tid){
        this._appComponent.quantMinusByIndex(tid);
      }
      getTestQuant(test:any){
        let a=1;
        let stest=JSON.parse(localStorage.getItem('tests'));
          if(stest){
              stest.forEach(element => {
                if(element.tid===test){
                    a=element.quant;
                }
          });
      }
      return a;
    }
    addPackageCart(pckg:any){
     
     this.getAddTestCart(pckg,"pckg");
    }
    myIndexOf(o) {
      this._tempTest=JSON.parse(localStorage.getItem('tests'));
     let k=-1;
          for (var i = 0; i < this._tempTest.length; i++) {
            let a=this._tempTest[i];
            let b=o;
            
              if (a.tid===b.tid) {
  
                  k= i;
              }
          }
          return k;
      }
    getAddTestCart(test:any,attrib:any,event:any=''){
      
   
      if(attrib=='pckg'){
         let test1 = test;
         test = {};
         test.tid = test1.id;
         test.test_name = test1.package_code;
         test.test_code = test1.package_discpr;
         test.test_finalpr = test1.package_finalpr;
         test.test_name = test1.package_name;
         test.test_price = test1.package_price;
         test.quant = test1.quant;
         test.report_avb = "";
         test.test_ptn = "";
         test.type = "";
      }
  
    this._tempTest=[]; 
    this.temp2=[]; 
  let testshere = JSON.parse(localStorage.getItem('tests')); 
       if(testshere){
            
        this.temp2=JSON.parse(localStorage.getItem('tests'));
        this.temp2.forEach(element => {
            this._tempTest.push(element);  
        });
       if(this.myIndexOf(test) < 0){
        test.quant=1;
        this._tempTest.push(test);
       }else{
        let i=this.myIndexOf(test);
        let t=this._tempTest[i].quant;
        t=t+1;
        this._tempTest[i].quant=t;
       }
        }else{
          test.quant=1;
          this._tempTest.push(test);
        }
      
        localStorage.setItem('tests',JSON.stringify(this._tempTest));
        this._appComponent.getNotify(test.test_name+" has been added to your cart.");
        this._appComponent.setCart();
    }
    //SELCTION ITEM METHOD.
   select(item,type:any){
    this.filterKey = new String(item);
   

    var re=/ /gi;
    let fk;
    fk=this.filterKey.replace(re,"_"); 
    fk=fk.replace("(","__,_"); 
    fk=fk.replace(")","_,__"); 
    this.searchResult = [];
     this._packages=[];
    if(type=="test"){
    
      window.location.href="./test-details/"+fk;
    }else if(type="package"){
      window.location.href="./package-details/"+fk;
    }
  
}
 

 getForgotPassword(form: NgForm,isValid: boolean){

if(isValid){
    this._api.getToken().subscribe( 
      token => {
          let data ={
            'TokenNo':token,
            'mobile':form.value.Mobile
          }
          this._api.POST('GetForgotPassword', data).subscribe(data =>{
             let response=(JSON.parse(data.json).data);
                
                 if(response == undefined){
                      form.resetForm();
                      this.fotp = true;
                 }else{
                    if(response[0].mobile!=null){ 
                      
                        this.sotp = true;
                        this.fotp = false;
                        form.resetForm();
                        this.phneNo = response[0].mobile;
                        this.forget_password_modal.nativeElement.click();
                       
                        this.uid = response[0].uid;

                      this.otpM.nativeElement.setAttribute("data-target", "#otp_modal1");
                      this.otpM.nativeElement.setAttribute("type","button");
                      this.otpM.nativeElement.click();
                       this.sotp = false;
                    }else{
                     
                     this.fotp = true;
                     form.resetForm();
                    }

                   
                 }

             });
      });

    }
       
  }

  resendOTP(mobile:number){
    

    this._api.getToken().subscribe( 
      token => {
          let data ={
            'TokenNo':token,
            'mobile':mobile
          }

          this._api.POST('GetForgotPassword', data).subscribe(data =>{
             let response=(JSON.parse(data.json).data);
                

                 if(response == undefined){
                      //form.resetForm();
                     // this.fotp = true;
                     alert("undefined");
                 }else{
                    if(response[0].mobile!=null){ 
                      //swal("<small>OTP sent successfully</small>");
                      window.alert("OTP sent to your registered email id successfully");
                    }else{
                       window.alert("failed to send OTP");
                     
                    }
 
                 }

             });
      });


  }

 UpdatePasswordByOTP1(form: NgForm,isValid: boolean,uid:number){
      if(isValid){
          if(form.value.pwd == form.value.cpwd){
           
               this._api.getToken().subscribe( 
                      token => {

                            let data = {
                            "TokenNo":token,
                            "otp":form.value.term1+form.value.term2+form.value.term3+form.value.term4,
                            "user_id":uid,
                            "password":form.value.pwd1,
                              }
                          
                        
                           this._api.POST('UpdatePasswordByOTP', data).subscribe(data =>{
                            let resp =(JSON.parse(data.json).data);
                            
                            if(resp==undefined){
                              
                           
                              this.ivotp =true;
                              this.msg = false;
                               form.resetForm();

                            }else{
                              this.ivotp =false;
                              this.msg = false;
                             swal("<small>OTP verified and Password changed successfully</small>");
                              form.resetForm();
                              this.otp_modal1.nativeElement.click();

                             
                            }

                           })
                      });
          }else{
              swal("<small>Password and confirm password should be same</small>");
          } 

        }
          
 }
 getSerBarPos(){

  const scrollPosition = window.pageYOffset
  if(scrollPosition>100){
return false;
  }else{
    return true;
  }
   
 }

 getRepStatus(){
   if(this.tokenSet){
    this.repsea1.nativeElement.click();
   }else{
    this.repsea2.nativeElement.click();
   }
 }


  
}
