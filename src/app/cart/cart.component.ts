import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import {ApiService} from '../common/api.service';
import {BookComponent} from '../book/book.component';
import {AppComponent} from '../app.component';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/timer';

import { DatePipe } from '@angular/common';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
declare var swal: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers:[BookComponent]
})
export class CartComponent implements OnInit {
  ismobileview: any;
  location_city_name: any;
  MPGprice: number = 0;
  finhvc: number;
  finhvd: any = [];
  isbtnloading:boolean=false;
  @ViewChild('otpModel') otpModel: ElementRef;
  @ViewChild('otp_model') otp_model: ElementRef;

  maxYear: string;
  minYear: string;
  model: any;  
  maxDate: { day: number; month: number; year: number; };
  minDate: any;
  fam: boolean = false;
  @ViewChild('add_family') add_family: ElementRef;
  paymentOption: any;
  loading: any = [];
  sel_time: any = [];
  sel_date: any = [];
  timeslots: { "id": string; "slot": string; "display": string; }[];
  tests: any = [];
  cartValues:any=[];
  osw:boolean=false;
  isTokenSet:boolean=false;
  paymentMethods:any=[];
  cartTestIds:any=[];
  suggestedTests:any=[];
  public _api:ApiService;
  public sw:number=1;
  public couponVAlue:String;
  public couponRes:any;
  public _appComponent:any;
  public user:any=[];
  public bookComponent:any;
  ms1:boolean=false;
  ms2:boolean=false;
  ms3:boolean=false;
  ms4:boolean=false;
  ms5:boolean=false;
  tmp:boolean=false;
  ms6:boolean=false;
  members:any=[];
  locations:any=[];
  cities:any=[];
  public optionVal:number;
  areas:any=[];
  sel_members:any=[];
  sel_locations:any=[];
  sel_slot:any=[];
  tid:number=null;
  finalPostList:any=[];
  address:any=[];
  location:any=[];
  cityId:number;
  ms7:boolean=false;
  member:any=[];
  //packages
  pckgs:any=[];
  cartPckgIds:any=[];
  tempTotal:number=0;
  tot:number;
  hvc:number=50;
  colc:number=0;
  labs:any=[];
  lablocations:any=[];
  sel_type:any=[];
  sel_lablocation:any=[];
  modify_bill:any=null;
  modi_member:any=[];

  ph:boolean=true;
  memId:any;
  mobileNumber:any;
  errorMessage:any;
  FMname:any;

  resendotptime: any;
  resendotpv: boolean=false;
  fmForm:any;
  tloop: Observable<number>;

  date = new Date();
  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
  
    disableSince: { year: this.date.getUTCFullYear()+1, month: this.date.getUTCMonth() + 1, day: this.date.getUTCDate() },
    disableUntil :{ year: this.date.getUTCFullYear(), month: this.date.getUTCMonth() + 1, day: this.date.getUTCDate()-1}
  };

  myOptions1: INgxMyDpOptions = {
  // other options...
  dateFormat: 'yyyy-mm-dd',
  disableSince: { year: this.date.getUTCFullYear(), month: this.date.getUTCMonth() + 1, day: this.date.getUTCDate()+1},
  disableUntil :{ year: 1918, month: 1, day: 1},
};

  constructor(_api :ApiService,bc:BookComponent,private router :Router,_appComponent :AppComponent,private elementRef:ElementRef,private datePipe:DatePipe) {
    window.scrollTo(0, 0);
   
    var date = new Date();
    this.setDate1();
    if(date.getHours()>19){
      this.minDate={ date: { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate()+1 } }
    }else{
      this.minDate={ date: { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() } }
    }
    
    
    
    this.maxDate={day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear()+1};
    
    
    this._api=_api;
    this._appComponent=_appComponent;
    this.ismobileview=this._appComponent.isMobile();
    
    this.tokenCheck(); 
    this.getLocStorage();
    if(this.isTokenSet){
      this.loading['data']=true;
      
        this.mytests();
        this.getUserFamily(this.user.uid,0);
      
       this._appComponent.setCart();
    }
   
    
    this.couponRes={"discount_amount":0}
     this.bookComponent=bc;
     this.getCities();
     this.getTimeSlots();
    
  }
  //user data check

  mytests(){
    this.tests= JSON.parse(localStorage.getItem('tests'));

       
      if(this.tests!==null){
               if(this.tests.length > 0){
                 this.tests.forEach(element => {
                 
                   this.cartTestIds.push(element.tid);
                    if(this.sel_members[element.tid]==undefined||this.sel_members[element.tid]==[]){
                     this.sel_members[element.tid]=[];
                     this.sel_members[element.tid].push(this.user); 
                     
                    }else if(typeof this.sel_members[element.tid].uid=="number"){
                      this.sel_members[element.tid]=[];
                      this.sel_members[element.tid].push(this.user); 
                       
                    }
                   
                 
                   if(this.modify_bill){
                   this.sel_members[element.tid]=this.modi_member;
                   }
                  }); 
               
                 
                }
      }else{
   
           this.tests=[];
      }
      
      this.cartValues= JSON.parse(localStorage.getItem('cartValues'));
   
  }
  checkLoad(){
    console.log("tests",this.tests);
    console.log("mem",this.members);
    console.log("loc",this.locations);
    console.log("labloc",this.lablocations);
    console.log("sel_mem",this.sel_members);
    console.log("sel_loc",this.sel_locations);
    console.log("sel_type",this.sel_type);
  }
  ngOnInit() {
 
     this._api.getToken().subscribe( 
      token => {
     this._api.POST('SuggestedTests', {TokenNo: token,'test_ids':this.cartTestIds}).subscribe(data =>{
     this.suggestedTests=JSON.parse(data.json).data;
     });
    });
    
   }


  listTests(){
   this.tests= JSON.parse(localStorage.getItem('tests'));

    
   if(this.tests!==null){
            if(this.tests.length > 0){
              this.tests.forEach(element => {
                this.cartTestIds.push(element.tid);
                 if(this.sel_members[element.tid]==undefined||this.sel_members[element.tid]==[]){
                  this.sel_members[element.tid]=[];
                  this.sel_members[element.tid].push(this.user); 
                  
                 }
                
              
                if(this.modify_bill){
                this.sel_members[element.tid]=this.modi_member;
                }
               }); 
           
              
             }
   }else{

        this.tests=[];
   }
 
   
    if(this.sel_members.length==0){
      if(localStorage.getItem('sel_members')){
        this.sel_members=JSON.parse(localStorage.getItem('sel_members'));
        localStorage.removeItem('sel_members')
      }
    }
    if(this.sel_locations.length==0){
      if(localStorage.getItem('sel_locations')){
        this.sel_locations=JSON.parse(localStorage.getItem('sel_locations'));
        localStorage.setItem('sel_locations',"");
        localStorage.removeItem('sel_locations')
      }
    }

  this.cartValues= JSON.parse(localStorage.getItem('cartValues'));
 
  }
  //set home collection as default for all family members all tests
  setHcDefault(){
   
    
   
      if(this.tests!==null){
               if(this.tests.length > 0){
                 this.tests.forEach(element => {
    this.members.forEach(element1 => {
        
      if(this.sel_type[element.tid]==undefined||this.sel_type[element.tid]===''){
        this.sel_type[element.tid]=[];
      }
      if(this.sel_type[element.tid][element1.uid]==undefined||this.sel_type[element.tid][element1.uid]===''){
        this.sel_type[element.tid][element1.uid]=2;
    }

    if(this.sel_locations[element.tid]==undefined||this.sel_locations[element.tid]===''||(typeof this.sel_locations[element.tid]=="string")){
      this.sel_locations[element.tid]=[];
    }
      if(this.sel_locations[element.tid][element1.uid]==undefined||this.sel_locations[element.tid][element1.uid]==''){
     
    
        this.sel_locations[element.tid][element1.uid]=this.locations[0];
      
       
      }
      if(this.sel_lablocation[element.tid]==undefined||this.sel_lablocation[element.tid]===''){
        this.sel_lablocation[element.tid]=[];
      }
        if(this.sel_lablocation[element.tid][element1.uid]==undefined||this.sel_lablocation[element.tid][element1.uid]==''){
         

          this.sel_lablocation[element.tid][element1.uid]=this.lablocations[0];
        }

        if(this.sel_date[element.tid]==undefined||this.sel_date[element.tid]===''){
          this.sel_date[element.tid]=[];
        }
          if(this.sel_date[element.tid][element1.uid]==undefined||this.sel_date[element.tid][element1.uid]==''){
            this.sel_date[element.tid][element1.uid]=this.minDate;
            
          }
        
          if(this.sel_slot[element.tid]==undefined||this.sel_slot[element.tid]===''){
            this.sel_slot[element.tid]=[];
          }
      
     
    
    });
    
        });
       
        }
      }
    
      this.setLocStorage();
      this.mypayotp('1');
      this.loading['data']=false;
  }
  mypayotp(pay:any){
    this.paymentOption=pay;
    localStorage.setItem('paymentOpt',this.paymentOption);
   
  }
  //packages
    listPckgs(){
   
    this.pckgs= JSON.parse(localStorage.getItem('packages'));
    if(this.pckgs != null){
      this.pckgs.forEach(element => {
        this.cartPckgIds.push(element.id);
         if(this.sel_members[element.id]==undefined||this.sel_members[element.id]==[]){
           this.sel_members[element.id]=this.user;
         }
         if(this.sel_locations[element.id]==undefined){
        
         }
         if(this.sel_type[element.id]==undefined){
           this.sel_type[element.id]=1;
         }
   
       });
    }
   
    if(this.sel_members.length==0){
      if(localStorage.getItem('sel_members')){
        this.sel_members=JSON.parse(localStorage.getItem('sel_members'));
        localStorage.removeItem('sel_members')
      }
    }
    if(this.sel_locations.length==0){
      if(localStorage.getItem('sel_locations')){
        this.sel_locations=JSON.parse(localStorage.getItem('sel_locations'));
        localStorage.removeItem('sel_locations')
      }
    }
  this.cartValues= JSON.parse(localStorage.getItem('cartValues'));
 
  }

  tokenCheck(){
    if(localStorage.getItem('token')===null){
      this.isTokenSet=false;
    }else{
      this.isTokenSet=true;
     
      if(JSON.parse(localStorage.getItem('user'))){
        this.user=JSON.parse(localStorage.getItem('user'));
      }
      if(this._appComponent.noCart==false){
        this._appComponent.getNotify("Please fill your personal details to proceed the order");
        this.router.navigate(['./account']);
      }
      
    }
  
  }
  showHide(val:number){
    this.sw=val;
  }
  offerssw(){
    if(this.osw===true){
      this.osw=false;
    }else{
      this.osw=true;
    }
   
  }
  onKey(coupon:String){
    
    if(coupon==''){
      return;
    }
    this.couponVAlue=coupon;
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('coupon_apply.php', {TokenNo: token,test_ids: this.tests}).subscribe(data =>{
      this.couponRes=JSON.parse(data.json).data;
     });
    });

  }
  getAddTestCart(tst:any){
     this.bookComponent.getAddTestCart(tst);
     this.listTests();
     this.bookComponent._appComponent.hideCart();
     this.bookComponent._appComponent.checkOut(); 
  }

   getAddPackageCart(pkg:any){
     this.bookComponent.getAddPackageCart(pkg);
     this.listPckgs();
     this.bookComponent._appComponent.hideCart();
     this.bookComponent._appComponent.checkOut(); 
  }

  cleanArray(actual) {
    let newArray =[];
    for (var i = 0; i < actual.length; i++) {
      if(actual[i]) {
        newArray.push(actual[i]);
      }
    }
    return newArray;
  }

  checkOut(){
    window.scrollTo(0, 0);
    this.loading['data']=true;
    this.isbtnloading=true;
    if(this.isTokenSet){
      
    

        this.finalPostList=[];
        if(this.tests!=null){
            this.tests=this.cleanArray(this.tests);
            this.tests.forEach(element => {
            
             if(this.sel_members[element.tid].length==0){
               this.finalPostList['uid_'+this.user.uid]=[];
               this.finalPostList['uid_'+this.user.uid].push(element.tid);
             }else{
               
              this.sel_members[element.tid].forEach((element1,index) => {
                if(this.finalPostList['uid_'+this.sel_members[element.tid][index]['uid']]==undefined){
                  this.finalPostList['uid_'+this.sel_members[element.tid][index]['uid']]=[];
                 this.finalPostList['uid_'+this.sel_members[element.tid][index]['uid']].tests=[];
                 this.finalPostList['uid_'+this.sel_members[element.tid][index]['uid']].tests.push(element.tid);
                }else{
                  this.finalPostList['uid_'+this.sel_members[element.tid][index]['uid']].tests.push(element.tid);
                }
                 
               });
           
               
             }
              /*user quantity check start here*/
        if(this.userVsQuant(element,this.sel_members[element.tid])){
        
          let tqnt=this.getQuantByTid(element.tid);
          
          this._appComponent.getNotify("You have selected "+tqnt+" units for '"+element.test_name+"'\nyou can add a family member if you want to be tested together");
         
         
          this.loading["data"]=false;
          this.isbtnloading=false;
         
         
          this.isbtnloading=false;
           throw new Error("Something went badly wrong!");
        }
         
               
         });
            
        }
     
       for(let key in this.finalPostList){
         let i=1;
       let fuid=key.split("_")[1];
       var fiorder_no:any=[];
       var failorder_no:any=[];
       let fitest=this.finalPostList[key].tests;
       let fiprice:any=[];
       let filocation:any=[];
       let fischedule:any=[];
       let fiseltype:any=[];
  
       this.tempTotal=0;
      
       fitest.forEach(element => {
         
        fiprice.push(this.getFpriceByTid(element));
        fiseltype.push(this.sel_type[element][fuid]);
        if(this.sel_type[element][fuid]==1){
        
        
            filocation.push(this.sel_locations[element][fuid].address);
  
          
        }else{
          filocation.push(this.sel_lablocation[element][fuid].address);
        }
       if(this.sel_slot[element][fuid]){
        fischedule.push(this.sel_slot[element][fuid]);
       } 
       
       });
      
       if(this.modify_bill){
        this._api.getToken().subscribe( 
          token => {
            
        this._api.POST('ModifyOrder', {TokenNo: token,'test_id':fitest.join(),'user_name':fuid,'order_no':this.modify_bill,'item_net_amount':fiprice.join(),'item_center_id':1,'item_center_name':'banjara','order_net_amount':this.tempTotal,'status':'M','schdate':fischedule.join('`'),'schaddress':filocation.join('`'),'order_type':fiseltype.join()}).subscribe(data =>{
          let inv=JSON.parse(data.json).data;
    
      
          fiorder_no.push(inv[0].order_no);
    
          if(Object.keys(this.finalPostList).length==fiorder_no.length){
            
              this.orderModified(fiorder_no);
             
          }
         });
        });
       }else{
        this._api.getToken().subscribe( 
          token => {
            let dat={TokenNo: token,'test_id':fitest.join(),'user_name':fuid,'item_net_amount':fiprice.join(),'item_center_id':1,'item_center_name':'banjara','order_net_amount':this.tempTotal,'schdate':fischedule.join('`'),'schaddress':filocation.join('`'),'order_type':fiseltype.join()};
          
        this._api.POST('OrderCreate', {TokenNo: token,'test_id':fitest.join(),'user_name':fuid,'item_net_amount':fiprice.join(),'item_center_id':1,'item_center_name':'banjara','order_net_amount':this.tempTotal,'schdate':fischedule.join('`'),'schaddress':filocation.join('`'),'order_type':fiseltype.join(),city_name:this._appComponent.getCityName(),"pay_type":this.paymentOption}).subscribe(data =>{
          let inv=JSON.parse(data.json).data;
          if(JSON.parse(data.json).status==1){
         
            fiorder_no.push(inv[0].order_no);
           
          }else{
            failorder_no.push({'uid':fuid,})
          }
         
    
          if(Object.keys(this.finalPostList).length==fiorder_no.length){
            
              this.finalizeOrder(fiorder_no);
             
          }else if(Object.keys(this.finalPostList).length==i){
            
            // this.errors();
            swal({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              footer: '<a href="javasript:void(0)" (click)="window.location.reload()">Try Again?</a>',
            })
            throw new Error('Something Went wrong');
             
          }
          i++;
         });
        });
       }
       
      
       }//for

    }else{
      this.router.navigate(['./login']);
    }
    
  }
  errors(){
    this.loading['data']=false;
    swal("<small>Something Went Wrong,Please Try again</small>");
  }
  finalizeOrder(fiorder_no:any){
    this._appComponent.getNotify("Your test has been getting booked. Check your email or SMS for further information.");
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('FinalizeOrder', {TokenNo: token,'Referenceid':this.user.uid,'order_no':fiorder_no.join(),'payment_type':this.paymentOption,is_due:"N"}).subscribe(data =>{
      let inv=JSON.parse(data.json).data;
   
      sessionStorage.setItem('invoice', JSON.stringify(inv));
      localStorage.setItem('invoice', JSON.stringify(inv));
      localStorage.setItem('tempTotal', JSON.stringify(this.MPGprice));
      // debugger;
    this.removeLocalStorage();
    
     this.clearCart();
     });
    });
  }
  orderModified(fiorder_no:any){
    this.clearCart();
    this.router.navigate(['./payment']);

  }
  clearCart(){
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('AddtoWishList', {TokenNo: token,'uid':this.user.uid,'test_id':0,'quantity':0,'loc_id':'1','status':'C','is_wishlist':'2'}).subscribe(data =>{
      let inv=JSON.parse(data.json).data;
      this.bookComponent._appComponent.clearCart();
      this.router.navigate(['./payment']);
     });
    });

  }
  getFpriceByTid(tid){
    let a=0;
    this.tests.forEach(element => {
     
      if(element.tid==tid){
        a= element.test_finalpr;
        
      } 
    });
    if(this.pckgs){
      this.pckgs.forEach(element => {
        
         if(element.id==tid){
           a= element.package_finalpr;
         } 
       });
    }
    
    this.MPGprice=this.MPGprice+(this.getQuantByTid(tid)*a);
    this.tempTotal=this.tempTotal+a;
    return a;
  }
  getQuantByTid(tid){
    let a=0;
    this.tests.forEach(element => {
     
      if(element.tid==tid){
        a= element.quant;
      } 
    });
    if(this.pckgs){
      this.pckgs.forEach(element => {
        
         if(element.id==tid){
           a= element.quant;
         } 
       });
    }

    return a;
  }
  backToTests(){
    this.router.navigate(['./book']);
  }
  getUserFamily(uid:number,tid:number){
   this.tid=tid;
    // family_members
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetFamilyMembers', {TokenNo: token,'user_id':uid}).subscribe(data =>{
    let res = JSON.parse(data.json);
    
     if(res.length==0){
      this.members.push(this.user);
             
     }else{

            if(JSON.parse(data.json).data.length > 0){
              this.members=JSON.parse(data.json).data;
              this.members.push(this.user);
              this.members.reverse();
            }else{
              this.members.push(this.user);
            }
          }
         
          this.getUserLocation(this.user.uid,0);
     });
    });


  }

  hm1(){
    this.ms1=false;
  }
  
  addFM(){
    this.ms1=false;
    this.ms2=true;
  }
  hm2(){
    this.ms2=false;
  }
  getUserLocation(uid:number,tid:number){
    this.tid=tid;
    this._api.getToken().subscribe( 
      token => {
     this._api.POST('GetUserAddress', {TokenNo: token,'uid':uid}).subscribe(data =>{
 
    let res =JSON.parse(data.json).data;

    if(res==undefined){
         this.locations[0]=[];
         this.locations[0].address="NA";
         this.locations[0].area="NA";
         this.locations[0].city="NA";
         this.locations[0].area_id=0;

    }else{
       if(JSON.parse(data.json).data.length > 0){
        this.locations=JSON.parse(data.json).data;
       }else{
        this.locations[0]=[];
         this.locations[0].address="NA";
         this.locations[0].area="NA";
         this.locations[0].city="NA";
         this.locations[0].area_id=0;
       }

    }

    this.getLabLocations("Hyderabad");//this will be dynamic form google locations
       
      });
    });
 
   }
   hm3(){
     this.ms3=false;
   }
   
   addLoc(){
     this.ms3=false;
     this.ms4=true;
   }
   hm4(){
     this.ms4=false;
   }
   getSlots(uid:number,test_id:number){
     this.tid=test_id;
    this.router.navigate(['./slots', {testId:test_id}]);
   }
   setFamilyMember(mem:any){
   
    this.sel_members[this.tid]=mem;
    this.hm1();
    this.setLocStorage();
   }

   uniqueCheck(key,arr):boolean{
     let k=false;
     arr.forEach(element => {
       if(element.uid===key.uid){
   
        k= true;
       }
       
     });
   
     return k;
    
   }
   getIndex(key,arr):number{
    let index = arr.findIndex(x => JSON.stringify(x)==JSON.stringify(key));
  
    return index
  }
  getTestBytid(val){
      let a="";
      this.tests.forEach(element => {
          if(element.tid==val){
            a= element;
          }
      });
      return a;
  }
   setFamilyMember1(memId:any,tid:number,event,sms:any){

  this.members.forEach( (item, index) => {
   
      if(item.uid==memId){
        if(this.uniqueCheck(item,this.sel_members[tid])){
      if(this.sel_members[tid].length>1){
          this.sel_members[tid].splice(this.getIndex(item,this.sel_members[tid]),1);
          this.bookComponent.getRemoveTestCart(this.getTestBytid(tid),'test','');
          
      }else{
        swal("Alas!","Test Should be made to atleast one member","warning");
        
        return false;
      }
          
        }else{
          if(this.getTestQuant(tid)>=(this.sel_members[tid].length+1)){
            this.sel_members[tid].push(item);
          }else{
           
            this._appComponent.getNotify("You have selected the test "+sms+" for "+this.sel_members[tid].length+" family members.");
           
            this.bookComponent.getAddTestCart(this.getTestBytid(tid),'','',false);
           
            this.sel_members[tid].push(item);

            
          }
          
        }
        
      } 

     });
     
  this.hm1();
  this.setLocStorage();

   }

 

   setTestLocation(loc:any){
  
     this.sel_locations[this.tid]=loc.address+','+loc.area+','+loc.city;
     this.hm3();
     this.setLocStorage();
   }

   setTestLocation1(locId:any, tid:number,mem:any){
   
    if(this.sel_type[tid][mem]==1){
      this.locations.forEach( (item, index) => {
        if(item.area_id==locId){
          
          if(this.sel_locations[tid]==undefined||this.sel_locations[tid]===null||Array.isArray(this.sel_locations[tid])==false){
            this.sel_locations[tid]=[];
          }
         
          this.sel_locations[tid][mem]=item;
        }
      });
    }else{
    this.lablocations.forEach( (item, index) => {
        if(item.area_id==locId){
          
          if(this.sel_locations[tid]==undefined||this.sel_locations[tid]===null){
            this.sel_locations[tid]=[];
          }
          this.sel_lablocation[tid][mem]=item;
        }
      });
    }
   
     this.hm3();
     this.setLocStorage();
   }

   setLocStorage(){
    localStorage.setItem("sel_locations",JSON.stringify(this.sel_locations));
    localStorage.setItem("sel_members",JSON.stringify(this.sel_members));
    localStorage.setItem("sel_lablocation",JSON.stringify(this.sel_lablocation));
    localStorage.setItem("sel_type",JSON.stringify(this.sel_type));
   }
   getLocStorage(){
     if(localStorage.getItem("sel_locations")){
      this.sel_locations=JSON.parse(localStorage.getItem("sel_locations"));
     }
     if(localStorage.getItem("sel_members")){
      this.sel_members=JSON.parse(localStorage.getItem("sel_members"));
     }
     if(localStorage.getItem("slot_details")){
      this.sel_slot=JSON.parse(localStorage.getItem("slot_details"));
     
     }
     if(localStorage.getItem("sel_lablocation")){
      this.sel_lablocation=JSON.parse(localStorage.getItem("sel_lablocation"));
      
     }
     if(localStorage.getItem("sel_type")){
      this.sel_type=JSON.parse(localStorage.getItem("sel_type"));
      
     }
     if(localStorage.getItem("modify_bill")){
      let mm=JSON.parse(localStorage.getItem("modi_member"));
    
       this.modi_member=mm;
      this.modify_bill=localStorage.getItem("modify_bill");
     }
     if(localStorage.getItem("location_city_name")){
      this.location_city_name=localStorage.getItem("location_city_name");
     
     }
     
     
   }

   getCities(){
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetCity',{TokenNo: token}).subscribe(data =>{
      this.cities=JSON.parse(data.json).data;
     
     });
    });
   }
   getAreaByCity(event){
     this.optionVal = event.target.value;
    
     this._api.getToken().subscribe( 
      token => {
      this._api.POST('GetAreasByCity',{TokenNo: token,'City_id':this.optionVal}).subscribe(data =>{
      this.areas=JSON.parse(data.json).data;
  
     });
    });
    
   }
   getAreaByCity1(cityId:number){
      this.cityId = cityId;
      this._api.getToken().subscribe( 
        token => {
      this._api.POST('GetAreasByCity',{TokenNo: token,'City_id':cityId}).subscribe(data =>{
      this.areas=JSON.parse(data.json).data;
    
     });
    });
    
   }
   addUserAddress(address_info:any,uid:number){
   
    address_info.user_id=uid;
    address_info.state_id=1;
    address_info.country_id=1;
  
      this._api.POST('AddUserAddress', address_info).subscribe(data =>{
      this.address=JSON.parse(data.json).data;
    
        this.ms5=true;
        window.location.reload();
      });
   }

    deleteCartItem(uid:number,tid:number){
    this.tests= JSON.parse(localStorage.getItem('tests'));
     
      if(this.tests!=null){
      this.tests.forEach( (item, index) => {
     
        if(this.sel_members[item.tid]){  
          if(item.tid === tid) this.tests.splice(index,1);
        }
     });
    }

      this.pckgs= JSON.parse(localStorage.getItem('packages'));
    
     if(this.pckgs!=null){
      this.pckgs.forEach( (item, index) => {
        if(item.id === tid) this.pckgs.splice(index,1);
     });
     }
    
    localStorage.setItem("tests", JSON.stringify(this.tests));
    localStorage.setItem("packages", JSON.stringify(this.pckgs));

    this.tot=0;
     this.tests.forEach(element => {
                this.tot=this.tot+parseInt(element.test_finalpr); 
              });
     if(this.pckgs!==null){
           this.pckgs.forEach(element => {
                      this.tot=this.tot+parseInt(element.package_finalpr); 
                    });
       }
       this.cartValues= JSON.parse(localStorage.getItem('cartValues'));
       localStorage.removeItem('cartValues');
       
     let a={"tot":this.tot,"hvc":this.hvc,"colc":this.colc};
     localStorage.setItem("cartValues",JSON.stringify(a));
     this.cartValues= JSON.parse(localStorage.getItem('cartValues'));
    
    this.bookComponent._appComponent.checkOut(); 
   }

   editFMAddress(uid:number,user_loc_id:number){

    this.locations.forEach(element => {
       
        if(element.user_loc_id === user_loc_id){
         
            this.location = element;

        }
    });
      this.ms6=true;
      this.hm3();
      this.getAreaByCity1(this.location.city_id);


   }

   hm5(){
     this.ms6=false;
   }

   updateUserAddress(address_info:any,uid:number){
   
    address_info.user_id=uid;
    address_info.state_id=1;
    address_info.country_id=1;
   
   }

   editFMInfo(fmid:number){
    this.ms7=true;
    this.hm1();
    
      this.members.forEach(element => {
        if(element.fmid === fmid){
            this.member = element;
            if(this.member.gender=='M'){
              this.member.gender=1;
            }
            if(this.member.gender=='F'){
              this.member.gender=2;
            }
             
        }
    });
    return this.member;
     
   }

   hm6(){
     this.ms7=false;
   }

    getHumanDate(dt:any){
    dt=dt.replace("/Date(","");
    dt=dt.replace(")/","");
    dt=dt.split("+");
    let hr=dt[1].substring(0,2)*60*1000;
    let min=dt[1].substring(2,4)*60*1000;
    let fdt=parseInt(dt[0])+hr+min;
    let theDate = new Date(fdt);
    let dateString = theDate.toUTCString();
    let date1 = (theDate.getMonth()+1).toString()+'/'+theDate.getDate().toString()+'/'+theDate.getFullYear().toString();
    return date1;
  }

  updateFamilyMembers(fmInfo:any,fmid:number){
     fmInfo.user_id=fmid;
     
     this._api.POST('UpdateFamilyMembers',fmInfo).subscribe(data =>{
      let mems=JSON.parse(data.json).data;
     
     window.location.reload();
     });

  }

    getTestDetails(id:number){
    this.router.navigate(['./book/test-details', {testId:id}]);
    }

    getSelMem(tid:any){
   
     if(this.sel_members[tid].length>0){
      return this.sel_members[tid];
     }else{
      return [];
     }
      
    }
    getNonSelMem(tid:any){
    
      if(this.sel_members[tid].length>0){
      
       return this.members.filter(item =>!this.uniqueCheck(item,this.sel_members[tid]) );
      }
      return this.members;
    }

    getDisplayTypeNames(locations){
      let newaa=[];
      locations.forEach(element => {
        if(element.title_id==1){
          element.display_type="Home";
        }else if(element.title_id==2){
          element.display_type="Office";
        }else if(element.title_id==3){
          element.display_type="Other";
        }else {
          element.display_type="Other";
        }
        newaa.push(element);
      });
      return newaa;

    }
    getSelLoc(tid:any,mem:any){
      
      if(this.sel_locations[tid][mem]!==undefined){
       
        let a= this.locations.filter(item => (item.area_id== this.sel_locations[tid][mem].area_id));
       return this.getDisplayTypeNames(a);
        }else{
        return [];
      }
      
    }
    getNonSelLoc(tid:any,mem:any){
     
      if(this.sel_locations[tid][mem]){
        let a= this.locations.filter(item => item.area_id!== this.sel_locations[tid][mem].area_id);
        return this.getDisplayTypeNames(a);
      }else{
        let a= this.locations;
        return this.getDisplayTypeNames(a);
      }
      
    }
    getSelLabLoc(tid:any,mem:any){
      if(this.sel_lablocation[tid][mem]){
        return this.lablocations.filter(item => (item.area_id== this.sel_lablocation[tid][mem].area_id)&&(item.location_id!==6)&&(item.location_id!==7)&&(item.location_id!==1)&&(item.location_id!==4)&&(item.location_id!==5));
      }else{
        return [];
      }
      
    }
    getNonSelLabLoc(tid:any,mem:any){
      if(this.sel_lablocation[tid][mem]){
        return this.lablocations.filter(item => (item.area_id!== this.sel_lablocation[tid][mem].area_id)&&(item.location_id!==6)&&(item.location_id!==7)&&(item.location_id!==1)&&(item.location_id!==4)&&(item.location_id!==5));
        
      }else{
       
        return this.lablocations.filter(item => (item.location_id!==6)&&(item.location_id!==7)&&(item.location_id!==1)&&(item.location_id!==4)&&(item.location_id!==5));
      }
        
    }
    getLabAddress(evnt:any,tid:any,mem:any){
      let type=evnt;
    
      this.sel_type[tid][mem]=type;
     
    this.setLocStorage();
    }
    getLabLocations(city:any){ //get nearest location API
      
            let b=[];
          
            this.tests.forEach(element => {
              b.push(element.tid);
            });
            
            this._api.getToken().subscribe( 
              token => {
              this._api.POST('GetNearestLab',{TokenNo: token,'serviceid':b.join(),"city":this.location_city_name}).subscribe(data =>{
                let d=JSON.parse(data.json);
                if(d.status==1){
                  this.lablocations=d.data;
                  this.lablocations=this.lablocations.filter(item=> ((item.location_id!==6)&&(item.location_id!==7)&&(item.location_id!==1)&&(item.location_id!==4)&&(item.location_id!==5)));
                }else{
                  this.lablocations=[];
                }
               
               
                
                this.setHcDefault();
                
             });
            });
           
    }
    locationhcset(tid,mem){
    
   
    let a:boolean;
      if(this.sel_type[tid][mem]==1){
        a= true;
      }else{
        a= false;
      }
      return a;
    }
    locationwiset(tid,mem){
        let a:boolean;
      if(this.sel_type[tid][mem]==2){
         a=true;
      }else{
         a=false;
      }
      
      return a;
    }
    noModify(){
      let a=confirm("Are You Sure?\nYou Want Discard Modify Bill \nand \nAdd it as a New Bill?");
      if(a){
        this.modify_bill=null;
        this.modi_member=null;
        localStorage.removeItem("modify_bill");
      }
    }
    getTimeSlots(){
      this.timeslots=[{"id":"3","slot":"07:00","display":"07:00 AM"},{"id":"4","slot":"07:30","display":"07:30 AM"},{"id":"5","slot":"08:00","display":"08:00 AM"},{"id":"6","slot":"08:30","display":"08:30 AM"},
{"id":"7","slot":"09:00","display":"09:00 AM"},{"id":"8","slot":"09:30","display":"09:30 AM"},{"id":"9","slot":"10:00","display":"10:00 AM"},{"id":"10","slot":"10:30","display":"10:30 AM"},{"id":"11","slot":"11:00","display":"11:00 AM"},
{"id":"12","slot":"11:30","display":"11:30 AM"},{"id":"13","slot":"12:00","display":"12:00 PM"},{"id":"14","slot":"12:30","display":"12:30 PM"},{"id":"15","slot":"13:00","display":"01:00 PM"},{"id":"16","slot":"13:30","display":"01:30 PM"},
{"id":"17","slot":"14:00","display":"02:00 PM"},{"id":"18","slot":"14:30","display":"02:30 PM"},{"id":"19","slot":"15:00","display":"03:00 PM"},{"id":"20","slot":"15:30","display":"03:30 PM"},{"id":"21","slot":"16:00","display":"04:00 PM"},
{"id":"22","slot":"16:30","display":"04:30 PM"},{"id":"23","slot":"17:00","display":"05:00 PM"},{"id":"24","slot":"17:30","display":"05:30 PM"},{"id":"25","slot":"18:00","display":"06:00 PM"},{"id":"26","slot":"18:30","display":"06:30 PM"},
{"id":"27","slot":"19:00","display":"07:00 PM"},{"id":"28","slot":"19:30","display":"07:30 PM"},{"id":"29","slot":"20:00","display":"08:00 PM"},{"id":"30","slot":"20:30","display":"08:30 PM"},{"id":"31","slot":"21:00","display":"09:00 PM"},
{"id":"32","slot":"21:30","display":"09:30 PM"},{"id":"33","slot":"22:00","display":"10:00 PM"}];

    }
    setDate(date:any,test:any,mem:any){
     if(this.sel_date[test]==undefined){
      this.sel_date[test]=[];
     }

    
     this.sel_date[test][mem]=date;
   
     this.set_slot(test,mem);
    
    }
    setTime(time:any,test:any,mem:any){
      if(this.sel_time[test]==undefined){
       this.sel_time[test]=[];
      }
    
      this.sel_time[test][mem]=time.value;
     
      if(this.sel_slot[test]==undefined){
        this.sel_slot[test]=[];
       }
       this.set_slot(test,mem);
      
     }
     set_slot(tid,uid){
       if(typeof this.sel_time[tid][uid]=="object"){
        this.sel_time[tid][uid]=this.sel_time[tid][uid].slot;
       }
      this.sel_slot[tid][uid]=this.converObjToDate(this.sel_date[tid][uid])+' '+this.sel_time[tid][uid];
      
     
     }
    

saveFamilyMembers(mem:NgForm,isValid:boolean, uid:number){

  if(isValid){
    this.otpModel.nativeElement.disabled = true;
  
     let memAge = this.getAge(mem.value.user_dob1.formatted);
      let a:any = memAge.split(' ');
        
      if(a[0] >=18){
          this.ph = true;
        
           if(mem.value.user_mobile){
                     mem.value.user_id = uid;
                      mem.value.user_name = mem.value.firstName1+' '+mem.value.lastName1;
                            this._api.getToken().subscribe( 
                              token => {
                               mem.value.TokenNo=token;
                              mem.value.user_dob = mem.value.user_dob1.formatted;
                              
                            this._api.POST('AddFamilyMembers', mem.value).subscribe(data =>{
                                let mems=JSON.parse(data.json).data;
                                
                                 this.mobileNumber = mem.value.user_mobile;
                                this.mobileNumber  = this.mobileNumber.replace(this.mobileNumber.substring(0,7),'XX');
                                this.FMname = mem.value.user_name;
                                this.fmForm = mem.value;
                              
                               this.errorMessage = "An OTP is has been sent to "+mem.value.user_name+"'s  mobile number "+this.mobileNumber;
                                mem.resetForm();
                                
                                this.add_family.nativeElement.click();

                                this.otpModel.nativeElement.setAttribute("data-target", "#otp_model");
                                 this.otpModel.nativeElement.disabled = false;
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

        this.ph=false;
        this._api.getToken().subscribe( 
          token => {
           mem.value.user_name = mem.value.firstName1+' '+mem.value.lastName1;
                      let data = {
                "TokenNo":token,
                "user_dob":mem.value.user_dob1.formatted,
                "user_gender": mem.value.user_gender,
                "user_id":uid,
                "user_name":mem.value.user_name,
                "user_email":mem.value.user_email,
                "user_mobile":''
                 }
                 this.FMname = mem.value.user_name;
                 this.fmForm = mem.value;
            

        this._api.POST('AddFamilyMembers', data).subscribe(data =>{
            let mems=JSON.parse(data.json).data;
             this._appComponent.getNotify("We have added "+this.FMname+" as your family member to your Tenet Profile");
             this.add_family.nativeElement.click();
             this.ph=false;
             mem.resetForm();
            this.getFamilyMembers(this.user.uid);
            
           });
          });


      }

    }else{
       
        this._appComponent.getNotify("Fields marked with the * are mandatory ");
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
                                 this.timerless(29);
                               
                               });
                              });
      
   }

     getFamilyMembers(uid:number){
  let fm_dob:any;

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

getAge(dateString:any) {
   
  let birthdate = new Date(dateString).getTime();
  let now = new Date().getTime();
 
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

   onDateChanged(event:any){
    //yyyy-dd-mm
      let memAge = this.getAge(event.formatted);//yyyy/mm/dd
      let a:any = memAge.split(' ');
   
      if(a[0] >= 18){
          this.ph = true;
        }else{
          this.ph = false;

        }
  }

   autoTab(event:any){
      if ( event.target.value.length >= event.target.maxLength && event.target.nextElementSibling ) 
       event.target.nextElementSibling.focus(); 

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
       
         this.errorMessage = "AN OTP has been sent to "+this.mobileNumber;
          form.resetForm();
       }else{

         if(resp[0].uid!=null){ 
        
         this._appComponent.getNotify("We have added "+this.FMname+" as your family member to your Tenet Profile");
           form.resetForm();
        this.otp_model.nativeElement.click();
        
             this.getUserFamily(this.user.uid,0);
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
   reset(form:any){
        form.resetForm();
    }
    resetAf(form:any){
      form.resetForm();
      this.ph= true;
    }


     testQuantPlus(test:any){
       this.bookComponent.getAddTestCart(test,'test','',false);
     }
     testQuantMinus(test:any){
    
       this.bookComponent.getRemoveTestCart(test,'test','');
       
     }
     getTestQuant(test){
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
     getTotalPricesUp(){
      let a=JSON.parse(localStorage.getItem("cartValues"));
      this.tot=a.tot;
      this.hvc=a.hvc;
      this.colc=a.colc;
      return this.tot+this.hvc+this.colc+this.finhvc;
     }
     getTestingPrices(){
      let a=JSON.parse(localStorage.getItem("cartValues"));
      this.tot=a.tot;
      this.hvc=a.hvc;
      this.colc=a.colc;
      return this.tot+this.colc;
     }
     userVsQuant(test:any,sel_mems){
    
       if(this.getTestQuant(test.tid)!==sel_mems.length){
        return true;
       }else{
         return false;
       }
     }
     removeLocalStorage(){
     localStorage.removeItem("sel_locations");
       localStorage.removeItem("sel_members");
     
       localStorage.removeItem("sel_lablocation");
       localStorage.removeItem("sel_type");
    
      
     }
      /* by sharath for date and time picker start*/
    getDateString(date){
 
      return date;
    }
   
    setDate1(){
      let dt=new Date();
      let tdate=this.GetFormattedDate(dt).split("-");
      
                this.model = { date: { year: tdate[2], month: tdate[1], day: tdate[0] } };//assign date to date-picker

    
     }
   GetFormattedDate(date) {
    let latest_date =this.datePipe.transform(date, 'dd-M-yyyy');
   return latest_date;
  }
  getSelDate(tid,mem):any{
  

  return this.model;
  }
  dateCrossCheck(tid,mem){
    return   (((this.sel_date[tid][mem].date.year==this.minDate.date.year)&&(this.sel_date[tid][mem].date.month==this.minDate.date.month)&&(this.sel_date[tid][mem].date.day==this.minDate.date.day))&&(((this.maxDate.year-1)==this.minDate.date.year)&&(this.maxDate.month==this.minDate.date.month)&&(this.maxDate.day==this.minDate.date.day)))
  }
  getValidTimeSlots(tid,mem){
     
      let ttime=[];
    
        if(this.dateCrossCheck(tid,mem)){
     
        let chr = new Date().getHours(); 
        let cmin = new Date().getMinutes(); 
        let ctot=(chr*60)+(cmin)+90;//90 mins is the buffer time;
        this.timeslots.forEach(element => {
          let k=element.slot.split(":");
          let hr=parseInt(k[0]);
          let min=parseInt(k[1]);
          let fin=(hr*60)+(min);
           if(fin>ctot){
             ttime.push(element);
           }
        });
      
      if(this.sel_slot[tid][mem]==undefined){
        let ktime=[];
        ktime['value']=ttime[0].slot;
        
      this.setTime(ktime,tid,mem);
      }

        return ttime;
      }else{
       
        if(this.sel_slot[tid][mem]==undefined){
        let ktime=[];
        ktime['value']=this.timeslots[0];
      this.setTime(ktime,tid,mem);
        }
        return this.timeslots;
      }
  }
  converObjToDate(date){
  return date.date.year+'-'+date.date.month+'-'+date.date.day;
  }
  /* by sharath for date and time picker end*/
  getMTestList(){
    let k= JSON.parse(localStorage.getItem('tests'));
    if(k.length!==this.tests.length){
       this.tests=[];
       this.tests=k;
    }
    return this.tests;
  }
  getUserName(name:any){
  if(typeof name=="object"){
    name=name.join(" ");
  }
  return name;
  }
  getHomeVisitCharges(){
    let mtest=this.getMTestList();
  if(mtest.length>0){
      this.finhvd=[];
    mtest.forEach(element => {
      let mem=this.getSelMem(element.tid);
      mem.forEach(element1 => {
        this.set_slot(element.tid,element1.uid);
        let time=this.sel_slot[element.tid][element1.uid];
        let loc=this.getSelLoc(element.tid,element1.uid);
       
        let kobj={"time":time,"loc":loc[0].user_loc_id,"user":element1.uid};
        
        if(this.sel_type[element.tid][element1.uid]==1){
         
          this.kobjpush(kobj);
        }else{

          this.removeKobj(kobj);
        }
      });
    });
    
    let no_of_visits=this.getUniqueHVC(this.finhvd);
let per_visit_charge=this._appComponent.homoe_visit_charge;
this.finhvc=no_of_visits*per_visit_charge;

return this.finhvc;
  }

   
  }
  getUniqueHVC(objs){
    let u=[];
let k=0;

objs.forEach(elementk => {
  let element=JSON.parse(elementk);
    if(u[element.time]==undefined){
      u[element.time]=[];
      u[element.time].push(element.loc);
    }else{
      if(u[element.time].indexOf(element.loc)<0){
        u[element.time].push(element.loc);
      }
    }

});

for (let key in u) {
  let element = u[key];
  k+=element.length;
}

return k;
  }
 
  kobjpush(obj){
 
    if(this.finhvd.length>0){
      if(this.indexOfObj(obj)<0){
        this.finhvd[this.finhvd.length]=JSON.stringify(obj);
      }
        
      
    }else{
     
      this.finhvd[this.finhvd.length]=JSON.stringify(obj);
      
    }
    
  }
  removeKobj(obj){ 
    if(this.finhvd.length>0){
       let i=this.indexOfObj(obj);
      if(i>=0){
        this.finhvd.splice(i,1);
      }
      
        }

  }
 indexOfObj(obj){
let a=-1;
let i=0;
this.finhvd.forEach(element => {
  let elementk=JSON.parse(element);
  if((elementk.time===obj.time)&&(elementk.loc===obj.loc)&&(elementk.user===obj.user)){
    
    a=i;
   }
  i++;
});
return a;
 }
 //remove cart items
 removeItem(tid){
  this._appComponent.deleteCartItem(this.user.uid,tid);
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

}
