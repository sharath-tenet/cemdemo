import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import {ApiService} from '../common/api.service';
import {HomeComponent} from '../home/home.component';
import {AppComponent} from '../app.component';
import {ActivatedRoute,Router} from '@angular/router';

import { FormControl,Validators} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { by } from "protractor/built";
@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  providers:[HomeComponent]
})
@Injectable()
export class BookComponent implements OnInit {
  mobileview: boolean=true;
  no: string;
  filterson: boolean = true;
  @ViewChild('oraganradiogroup') oraganradiogroup: ElementRef;
  @ViewChild('conditionradiogroup') conditionradiogroup: ElementRef;
  @ViewChild('splradiogroup') splradiogroup: ElementRef;
  @ViewChild('packageradio') packageradio: ElementRef;
  @ViewChild('profileradio') profileradio: ElementRef;
  @ViewChild('testradio') testradio: ElementRef;
  @ViewChild('filtersec') filtersec: ElementRef;
  
  
  sel_rad: any=[];
  cat_checkbox: boolean;
  cond_checkbox: boolean;
  spl_checkbox: boolean;
  organ_checkbox: boolean;
  ser_string: any;
  organ_name: any;
  ptype: string;
  _packagesSearchResult: any = [];
   top_tests:string[]=["Complete Blood Picture (CBP), EDTA Whole Blood","Lipid Profile, Serum","Liver Function Test (LFT), Serum","Thyroid Antibodies (TG & TPO), Serum","Thyroid Profile (T3,T4,TSH), Serum","1, 25-Dihydroxy Vitamin D, Serum","25 - Hydroxy Vitamin D, Serum","Urea, Serum","Creatinine, Serum","Triple Marker, Serum","Magnesium, Serum"
                      ,"Complete Urine Examination (CUE), Spot Urine","Glucose Fasting (FBS),  Sodium Flouride Plasma","Glycosylated Hemoglobin (HbA1C), EDTA Whole Blood","Uric Acid, Serum","Thyroglobulin (Tg), Serum","Blood Urea Nitrogen (BUN), Serum","Prolactin, Serum","Prothrombin Time With INR, Sodium Citrate Whole Blood","HIV 1 & 2 Antibodies, Serum","Culture And Sensitivity (Aerobic), Urine"];
  test_code: any;
  addtovisible: string;
  sortString: any = "Featured";
  event: string = '';
  pa: number = 1;
  public config= {};
  organ_id: any=null;
  public testConditions:any;
  public testSpecialityList:any;
  organsList: any = [];
  public testConditions1:any;
  public testSpecialityList1:any;
  organsList1: any = []; 
  showMore:any=[];
  filterLength:number=5;//length of filter default
  public nearestLabLocation: any;
 
 public testsList:any;
 public testDetails:any;
 
 public _api:ApiService;
 public test_id:any;
 public _appComponent:any;
 public _testDetailsComponent:any;
 public _tempTest=[];
 public temp2=[];
 public _packages=[];
 public _packageServices=[];
 packageServiceListSw:boolean=false;

 public _pckg:any=[];
 public tmp:any=[];
 //for search functionality
 private condition_id:any;
 private speciality_id:any;
 private category_id:any;
 private searchString:string;
 private sortBy:any; //1-name,2-price,3-popularity 
 private test_type:any; //1-filter,2-package
 private pincode:number=0;
 private sort_order:any=1; //1-ASC,2-DESC,Default Asending 
 private AlphaSearch="";
 getpackagecnf:boolean=false;
 gettestcnf:boolean=false;
 //temp 
 public tempstr:string;
 selpackagename:any;

visible:boolean=false;
status:string;
user:any = [];
wishList:any=[];
loc_id:number;
is_wishlist:number=0;
color:string;
wl:any=[];
public temp3=[];
msg:string;
wList:boolean=false;
style:string;
packages:any=[];
tests:any=[];
postalCode:any;
testIds:any=[];
alphap:any=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

 searchTerm : FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
 searchResult = [];
_packages1=[];
public loading = [];
 public filterKey:any;
 mpckgshow:boolean=false;
  constructor(_api :ApiService,_appComponent :AppComponent,private router :Router,private rou:ActivatedRoute,private _elementRef:ElementRef) { 
    this._api=_api;
    this._appComponent=_appComponent;
    this.getAddToVisable(); //add to cart visibility button
    this._appComponent.setFlag();
    this.user.uid="";
    if(this.searchTerm!=undefined){
      this.autoSuggestTrigger();
    }

    this.currentPg(true);

  }
  currentPg(consider=false){
    if(consider){
      this.event=this.rou.snapshot.paramMap.get('event');
      this.no=this.rou.snapshot.paramMap.get('no');
      if(this.event=="packages"||this.event=="profiles"){
        this.filterson=false;
      }else{
        this.filterson=true;
      }
      let a=parseInt(this.event);

      if(this.no!==null){
        a=parseInt(this.no);
      }
      if(!isNaN(a)){
          this.config= {
              id: 'custom',
              itemsPerPage: 9,
              currentPage: a
          }
      }else{      
        this.config= {
          id: 'custom',
          itemsPerPage: 9,
          currentPage: 1
        }
      }
    }else{
      this.config= {
        id: 'custom',
        itemsPerPage: 100,
        currentPage: 1
      }

    }
  }
  
  getAddToVisable(){
    this.addtovisible=localStorage.getItem("addTocart");
   
  }

  autoSuggestTrigger(){
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
                          this.gettestcnf=true;
                        }
                         
                       });
                      });
                    
     this._api.getToken().subscribe( 
                        token => { 
         this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":"",city_name:this._appComponent.getCityName()}).subscribe(data =>{
                  if(data.status==1){

                    this._packagesSearchResult=JSON.parse(data.json).data;
                   
                  }else{
                    this._packagesSearchResult=[];
                    this.getpackagecnf=true;
                  }
                  this.mpckgshow=true;
                  
               });
              });

             }      
        })
      

  }
  ngOnInit() {
      this.tests = JSON.parse(localStorage.getItem('tests'));

      this.packages = JSON.parse(localStorage.getItem('packages'));
      this.testIds = [];
      if(this.tests!=null){
             this.tests.forEach(element => {
              this.testIds.push(element.tid);
          });
      }
      if(this.packages!=null){
              this.packages.forEach(element => {
              this.testIds.push(element.id);
          });
      }
      this.postalCode = localStorage.getItem('postalCode');
     
        let data = {
          'tests': this.testIds,
          'postalCode': this.postalCode
        }
    this.nearestLabLocation={ name:"Loading...",address:"Loading..."}
   
      this.rou.params.subscribe(params => this.searchString=params.searchString);
      
    
      this.tempstr=this.searchString;
      this.filterKey=this.searchString;
      this.loading['condition']=true;
      this._api.getToken().subscribe(
        token => {
          this._api.POST('GetTestCondition', {TokenNo: token}).subscribe(data =>{
            this.testConditions1=JSON.parse(data.json).data;
            this.testConditions=this.testConditions1.slice(0,this.filterLength);
            this.showMore['cond']="Show More";
            this.loading['condition']=false;
            this.urlParseSearch("cond");
     });
        }
    );
      //ebugger;
      this.loading['speciality']=true;
      this._api.getToken().subscribe(
        token => {
      this._api.POST('GetTestSpecality', {TokenNo: token}).subscribe(data =>{
        this.testSpecialityList1=JSON.parse(data.json).data;
        this.testSpecialityList=this.testSpecialityList1.slice(0,this.filterLength);
        this.showMore['speciality']="Show More";
       
        this.loading['speciality']=false;
        this.urlParseSearch("spl");
       });

      }
    );
    // GetTestOrgans
    this.loading['organs']=true;
    this._api.getToken().subscribe(
      token => {
    this._api.POST('GetTestOrgans', {TokenNo: token}).subscribe(data =>{
      this.organsList1=JSON.parse(data.json).data;
      this.organsList=this.organsList1.slice(0,this.filterLength);
      this.showMore['organs']="Show More";
      this.loading['organs']=false;
      
      this.urlParseSearch("organ");
     });

    }
  );
      
      if(this.event=='packages'){
        this.ptype="H";
        setTimeout(()=>{
          this.packageradio.nativeElement.checked=true;
        },1000);
        
        this.getPackages();
      }else if(this.event=='profiles'){
        this.ptype="P";
        setTimeout(()=>{
          this.profileradio.nativeElement.checked=true;
        },1000);
        this.getPackages();
        //profile will be loaded here
      }else{
        setTimeout(()=>{
          this.testradio.nativeElement.checked=true;
        },1000);
        this.masterSearch();
      }

   
      
      if(localStorage.getItem('user')!=null)this.wList =true;
      window.scrollTo(0, 0);
  }

  getTestDetails(id:any){
    let nameser = new String(id);
    var re=/ /gi;
     nameser=nameser.replace(re,"_"); 
     nameser=nameser.replace("(","__,_"); 
     nameser=nameser.replace(")","_,__"); 
     nameser=nameser.replace("/","?slh?"); 
    this.router.navigate(['./test-details/'+nameser]);
   
  }



    select(item,type:any){
        this.filterKey = new String(item);
        this.searchResult = [];
        
         this._packages1=[];
         var re=/ /gi;
         let base_url="";
         this.filterKey=this.filterKey.replace(re,"_"); 
         this.filterKey=this.filterKey.replace("(","__,_"); 
         this.filterKey=this.filterKey.replace(")","_,__"); 
         this.filterKey=this.filterKey.replace("/","?slh?"); 
        if(type=="test"){
          base_url="test-details";
     
        }else if(type="package"){
         
         
         if( this.ptype=="H"){
          base_url="package-details";
         }else if(this.ptype=="P"){
          base_url="profile-details";
         }
        

        }
        window.location.href="./"+base_url+"/"+this.filterKey; 
       
    }

  getTestId(){
    return this.test_id;
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
shortIndex(tid:number):boolean{
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

  getAddTestCart(test:any,attrib:any,event:any='',smsg:any=true){
    
  
    if(attrib=='pckg'){
       let test1 = test;
       test = {};
       test.tid = test1.id;
       test.test_code = test1.package_code;
       test.test_code = test1.package_discpr;
       test.test_finalpr = test1.package_finalpr;
       test.test_name = test1.package_name;
       test.test_price = test1.package_price;
       test.quant = test1.quant;
       test.report_avb = "";
       test.test_ptn = "";
       test.type = "";
       test.is_home_collection=2;
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
      if(smsg==true){
         this._appComponent.getNotify(test.test_name+" has been added to your cart.");
       }
     
      this._appComponent.setCart();
    
  }
  getRemoveTestCart(test:any,type:any=null){
   
    if(this._tempTest.length==0){
      this._tempTest=JSON.parse(localStorage.getItem("tests"));
      
    }
    if(type=='package'){
      test.tid=test.id;
    }
    let i=this.myIndexOf(test);
   
    let t=this._tempTest[i].quant;
    
    if(t>1){
      t=t-1;
      this._tempTest[i].quant=t;
      localStorage.setItem('tests',JSON.stringify(this._tempTest));
      this._appComponent.setCart()
    }
  ;
  }
  isadded(test:any){
   let b= this.shortIndex(test);
   return b;
  }
  getTestByTidnAdd(tid,test_name){
    let a={};
    this.searchString=test_name;
   
    this.checkUndefined();
    return this._api.getToken().subscribe(
      token => {
        
      return  this._api.POST('GetServices', {TokenNo: token,pincode: this.pincode,test_name:this.searchString,test_code:this.test_code,test_type:this.test_type,condition_id:this.condition_id,speciality_id:this.speciality_id,sort_by:this.sortBy,sort_order:this.sort_order,AlphaSearch:this.AlphaSearch,user_id:this.user.uid,is_home_collection:"",organ_id:this.organ_id,city_name:this._appComponent.getCityName()}).subscribe(data =>{
          if(data.status==1){
             this.loading["service"]=false;
             this.gettestcnf=false;
            this.testsList=JSON.parse(data.json).data;
          }else{
             this.loading["service"]=false;
            this.gettestcnf=true;
            this.getpackagecnf=false;
            this.testsList=[];
          }
      
        let stest=this.testsList;
      
            if(stest){
              stest.forEach(element => {
                if(element.tid===tid){
                  this.getAddTestCart(element,'test','');
                }
            });
            }
           
         });

    }
  ); 
   
       
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

   getPckgQuant(pckg:any){
    let b=1;
    if(this.IndexOf(pckg)>=0){
      b=this._pckg[this.IndexOf(pckg)].quant;
    }
  
    return b;
   }

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

    this._appComponent.setCart();

  }




  hideCart(){ 
    localStorage.setItem('showcart',"false");
    this._appComponent.setCart();
  }
  getNearestLabLocation(){
    return this.nearestLabLocation;
  }
  clearConditions(){
 
   
    this.tempstr="";
    this.sortBy="";
    this.searchString="";
    this.speciality_id="";
    this.condition_id="";
    this.organ_id="";
    
    this.test_type="";
    this.AlphaSearch="";
    this.sortString="Featured"; 
    this.sort_order="";
    
    this.filterKey="";

  }
  search(event,attrib){
    this.currentPg(false); // this is to disable the pagination
    let sId = '';
    if(event.target.checked){
      sId = event.target.id;
    }
    this.clearConditions(); //make this enable if we are using only any one of the filters
    if(attrib=="cond"){
      
      this.condition_id=sId;
    
      this.spl_checkbox=false;
      this.organ_checkbox=false;
     
      this.masterSearch();
    }
    if(attrib=="spl"){
      this.speciality_id=sId;
    
      this.cond_checkbox=false;
    
      this.organ_checkbox=false;
     
      this.masterSearch();
    }
    if(attrib=="organ"){
   
      this.organ_id=sId;
   
      this.cond_checkbox=false;
      this.spl_checkbox=false;
     
     
      this.masterSearch();
    }
    if(attrib=="pckgs"){
      this.getPackages();
    }
    
   }
   shload(val){
return false;
   }
   masterSearch(){
    if(this._appComponent.currentUrl=="book/packages"||this._appComponent.currentUrl=="book/profiles"){
      window.location.href="./book/tests";
    }
   
    this.filterson=true;
    this.checkUndefined();
     this._packages=[];
    
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    if(this.user==null){
      this.user=[];
      this.user.uid="";
    }
    if(this.sortBy==""){
      this.sort_order="";
    }
    this.loading["service"]=true;
    
    this._api.getToken().subscribe(
      token => {
        this._api.POST('GetServices', {TokenNo: token,pincode: this.pincode,test_name:this.searchString,test_code:'',test_type:this.test_type,condition_id:this.condition_id,speciality_id:this.speciality_id,sort_by:this.sortBy,sort_order:this.sort_order,AlphaSearch:this.AlphaSearch,user_id:this.user.uid,is_home_collection:"",organ_id:this.organ_id,city_name:this._appComponent.getCityName()}).subscribe(data =>{
          if(JSON.parse(data.json).data.length>0){
             this.loading["service"]=false;
             this.gettestcnf=false;
             
            this.testsList=JSON.parse(data.json).data;
          }else{
             this.loading["service"]=false;
            this.testsList=[];
             this.gettestcnf=true;
             this.getpackagecnf=false;
          }
          if(this.testsList.length>0||this._packages.length>0){
          
           
            this.getpackagecnf=false;
            this.gettestcnf=false;
          }
       
         });

    }
  );
  

      

   }


   
   serClick(srt_by:any,strng:any){

      if(strng=== undefined||strng==null||strng==""){
        return false;
      }else{
        this.sortBy=srt_by;
        this.searchString=strng;
        this.masterSearch1();
      }
   }

     getPopularTests(strng){
      if(strng===''){
        return this.top_tests;
      }else{
        return [];
      }
      
    }

   sortingFun(srtby:any,strng:any,val:any){
     
    this.sortBy=srtby;
    this.sortString=strng;
    this.sort_order=val;
    if(this._appComponent.currentUrl=="book/packages"){
      this.ptype="H";
      this.getPackages();
    }else if(this._appComponent.currentUrl=="book/profiles"){
      this.ptype="P";
      this.getPackages();
    }else{
      this.masterSearch();
      this.router.navigate(['./book/tests/1']);
    }
   
   }

   checkUndefined(){
     if(typeof this.searchString=='string'){
       if(this.searchString.length==0){
        this.searchString="";
       }
     }
    if(this.searchString === undefined){
      this.searchString="";
    }
    if(this.speciality_id === undefined){
      this.speciality_id="";
    }
    if(this.condition_id === undefined){
      this.condition_id="";
    }
    if(this.test_type === undefined){
      this.test_type="";
    }
    if(this.organ_id === undefined||this.organ_id === null){
      this.organ_id="";
    }
    if(this.test_code === undefined||this.test_code === null){
      this.test_code="";
    }
    if(this.sortBy === undefined||this.sortBy === null){
      this.sortBy="";
    }
    if(this.sort_order === undefined||this.sort_order === null){
      this.sort_order="";
    }
    
    
   }
   clrClick(){
    this.cat_checkbox=false;
    this.cond_checkbox=false;
    this.spl_checkbox=false;
    this.organ_checkbox=false;
   
   
    this.tempstr="";
    this.sortBy="";
    this.searchString="";
    this.speciality_id="";
    this.condition_id="";
    this.organ_id="";
    
    this.test_type="";
    this.AlphaSearch="";
    this.sortString="Featured"; 
    this.sort_order="";
    
    this.filterKey="";
   
    
    
    window.location.href="./book/tests";

  }
  alphaPaginate(alpha:any){
    this.AlphaSearch=alpha;
    this.masterSearch(); 
  }
  getPackages(){
 
   this.loading['service']=true;
    this.testsList=[];
    this._packages=[];
    this._api.getToken().subscribe(
      token => {
     this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":"","package_code":"","sort_by":this.sortBy,"sort_order":this.sort_order,"alphaSearch":"","type":this.ptype,city_name:this._appComponent.getCityName()}).subscribe(data =>{
      if(data.status==1){
        let p=JSON.parse(data.json).data;
        p.forEach(element => {
          if(element.package_price>=0){ //this has to be removed when moving to live
            this._packages.push(element);
          }
        });
    

      }else{
       
        this._packages=[];
         this.getpackagecnf=true;
       
      }
    
      this.loading['service']=false;
      return this._packages;
    
     });
    });
  }
  getPackageDetails(package_id:any,selpackagename:any){
    
    this.selpackagename=selpackagename;
this._api.getToken().subscribe(
      token => {
      this._api.POST('GetPackageServices',{"TokenNo":token, "Pckage_id":package_id}).subscribe(data =>{
        if(data.status==1){
          this._packageServices=JSON.parse(data.json).data;
          this.testsList=[];
          this.packageServiceListSw=true;
        }else{
          this._packageServices=[];
        }
        
       });
     })

  }

  addToWishlist(event,test:any,i) {
  
    this.visible = !this.visible;
    
        if(this.visible==true){
                event.currentTarget.firstChild.style.color="red";
                //Add
                if(localStorage.getItem('user')!=null){
                this.user = localStorage.getItem('user');
                this.user = JSON.parse(this.user);
                this.status='A';
                this.loc_id=1;
                this.is_wishlist=1;
                this._api.POST('AddtoWishList', {"uid":this.user.uid,"test_id":test.tid,"loc_id":this.loc_id,"status":this.status,"is_wishlist":this.is_wishlist}).subscribe(data =>{
                this.temp3 = JSON.parse(data.json).data;
              
                this.temp3.forEach(element => {
                      this.temp3.push(element);  
                      });
                 localStorage.setItem('wishlist',JSON.stringify(this.temp3));
                 this.wl = localStorage.getItem('wishlist');
                 this.wl = JSON.parse(this.wl);

               });

            }else{
              this.msg = "Please enter your details to continue...";
              this.router.navigate(['./login', {msg:this.msg}]);
              
            }
    
        }else{

            event.currentTarget.firstChild.style.color="";
            this.user = localStorage.getItem('user');
            this.user = JSON.parse(this.user);
            let status:string='D';
            let loc_id:number=1;
            let is_wishlist:number=1;
            this._api.POST('AddtoWishList', {"uid":this.user.uid,"test_id":test.tid,"loc_id":loc_id,"status":status,"is_wishlist":is_wishlist}).subscribe(data =>{
            this.wishList = JSON.parse(data.json).data;
         
             });
        } 
  }
  getWishlist(){
      if(localStorage.getItem('user')!=null){
        this.router.navigate(['./book/wishlist']);
      }else{
        this.msg = "Please enter your details to continue...";
        this.router.navigate(['./login', {msg:this.msg}]);
      }
  }


  masterSearch1(){
    this.checkUndefined();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this._packages=[];
    if(this.user==null){
      this.user=[];
      this.user.uid="";
    }
    
    this._api.getToken().subscribe(
      token => {
       
    this._api.POST('GetServices', {TokenNo: token,pincode: this.pincode,test_name:this.searchString,test_code:'',test_type:this.test_type,condition_id:this.condition_id,speciality_id:this.speciality_id,sort_by:this.sortBy,sort_order:this.sort_order,AlphaSearch:this.AlphaSearch,user_id:this.user.uid,is_home_collection:"",organ_id:this.organ_id,city_name:this._appComponent.getCityName()}).subscribe(data =>{

      if(data.status==1){
        this.testsList=JSON.parse(data.json).data;
        this.getpackagecnf=false;
        this.gettestcnf=false;
      }else{
        this.testsList=[];
        this.gettestcnf=true;
      }

      if(this.testsList.length>0||this._packages.length>0){
        this.getpackagecnf=false;
        this.gettestcnf=false;
      }

     });
    });
      //Packages
      this._api.getToken().subscribe(
        token => {
      this._api.POST('GetPackages',{TokenNo: token,"pincode":this.pincode,"package_name":this.searchString,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":"",city_name:this._appComponent.getCityName()}).subscribe(data =>{
        if(data.status==1){
          this._packages=JSON.parse(data.json).data;
          this.getpackagecnf=false;
          this.gettestcnf=false;
        }else{

          this._packages=[];
          this.getpackagecnf=true;
        

        }
        if(this.testsList.length>0||this._packages.length>0){
          this.getpackagecnf=false;
          this.gettestcnf=false;
        }
        
       });
      });

   }
   showMoreLess(val,type){
     if(val<=5){
      this.showMore[type]="Show Less";
        if(type=="cond"){
            this.testConditions=this.testConditions1;
          }
          if(type=="speciality"){
            this.testSpecialityList=this.testSpecialityList1;
          }
          if(type=="organs"){
            this.organsList=this.organsList1;
          }
     }else{
      this.showMore[type]="Show More";
      if(type=="cond"){
        
        this.testConditions=this.testConditions1.slice(0,this.filterLength);
      }
      if(type=="speciality"){
       
        this.testSpecialityList=this.testSpecialityList1.slice(0,this.filterLength);
      }
      if(type=="organs"){
        this.organsList=this.organsList1.slice(0,this.filterLength);
      }
      
     }
     
   }
   whatSelected(val){
    
      if(this.event==val){
        return true;
      }else{
        return false;
      }
   }
   setPagiUrl(page){
   
     
       if(this.sortBy!==''){
        window.location.href="./book/"+this.event+'/'+page;
       }else{
         this.router.navigate(["./book/"+this.event+'/'+page]);
       }
       
  
    
   }
   filter_masters(val){
    if(val=="Packages"){
      this.ptype="H";
      window.location.href="./book/packages";
      this.getPackages();
    }else if(val=="Profiles"){
      this.ptype="P";
      window.location.href="./book/profiles";
      this.getPackages();
    }
   }

   revStrings(data){
    data=data.replace("__,_","("); 
    data=data.replace("_,__",")"); 
    var re=/_/gi;
    data=data.replace(re," ");
    data=data.replace(/^\s+|\s+$/g,""); 
    return data;
   }
   getIndex(thread,needle,type){
     let k=-1;
     if(type=="organ"){
      
      thread.forEach(element => {
       
        if(needle.toLowerCase()==element.organ_name.toLowerCase()){
         k=element.test_organ_id;
        }
      });
     }else if(type=="cond"){
      thread.forEach(element => {
        if(needle.toLowerCase()==element.condition_name.toLowerCase()){
         k=element.test_type_id;
        }
      });
     }
     else if(type=="spl"){
      thread.forEach(element => {
        if(needle.toLowerCase()==element.speciality_name.toLowerCase()){
         k=element.id;
        }
      });
     }
     return k;
   }

   urlParseSearch(typ){

     if(typ=="organ"){
      this.rou.params.subscribe(params => {
        this.organ_name=params.organ
        this.ser_string=this.organ_name;
        if(this.ser_string!==undefined||this.ser_string==''){
          this.ser_string=this.revStrings(this.ser_string);
          let a={"target":{"id":0,"checked":false,"value":""}};
         
          a.target.id=this.getIndex(this.organsList1,this.ser_string,"organ");
         
          if(a.target.id>=0){
            a.target.checked=true;
            a.target.value="on";
         
            this.category_id="";
            this.speciality_id="";  
            this.condition_id=""; 
         
           
           this.showmlflip('organs');
           setTimeout(()=>{
            this.oraganradiogroup.nativeElement.querySelectorAll('input')[a.target.id-1].click();
          },2000);
            
        

          }
        }
        
      });
      
     }else if(typ=="cond"){
      this.rou.params.subscribe(params => {
        this.organ_name=params.condition
        this.ser_string=this.organ_name;
        if(this.ser_string!==undefined||this.ser_string==''){
        this.ser_string=this.revStrings(this.ser_string);
        let a={"target":{"id":0,"checked":false,"value":""}};
        a.target.id=this.getIndex(this.testConditions1,this.ser_string,"cond");
       
        if(a.target.id>=0){
          a.target.checked=true;
          a.target.value="on";
          this.organ_id="";
          this.category_id="";
          this.speciality_id="";  
          

         this.showmlflip('cond');
         setTimeout(()=>{
           
          this.conditionradiogroup.nativeElement.querySelectorAll('input')[a.target.id-1].click();
        },3000);
          
        }
      }
      });

     }else if(typ=="spl"){
      this.rou.params.subscribe(params => {
        this.organ_name=params.speciality
        this.ser_string=this.organ_name;
        if(this.ser_string!==undefined||this.ser_string==''){
        this.ser_string=this.revStrings(this.ser_string);
        let a={"target":{"id":0,"checked":false,"value":""}};
        a.target.id=this.getIndex(this.testSpecialityList1,this.ser_string,"spl");
        if(a.target.id>=0){
          a.target.checked=true;
          a.target.value="on";
          this.organ_id="";
          this.category_id="";
        
          this.condition_id=""; 
          this.showmlflip('speciality');
          setTimeout(()=>{
            
           this.splradiogroup.nativeElement.querySelectorAll('input')[a.target.id-1].click();
         },2000);
          
        }
      }
      });
      
    }
    
     
    
    
      
     
      
    
   }
   showmlflip(val){

    this.currentPg(false); //this is to disable the pagination
    this.showMoreLess(3,val);
  }
  setMobileView(){
    if(this.filtersec.nativeElement.classList.contains('hidden-xs')){
      this.mobileview=false;
    }else{
      this.mobileview=true;
    }
  }
  goToCart(){
    this._appComponent.goToCart();
  }
  

}
