import { Component, OnInit,Input,Injectable } from '@angular/core';

import {ApiService} from '../common/api.service';
import {BookComponent} from '../book/book.component';
import { ActivatedRoute,Router} from '@angular/router';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import {AppComponent} from '../app.component';
import {NgForm, FormControl,Validators} from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css'],
  providers:[BookComponent]
 
})
@Injectable()
export class TestDetailsComponent implements OnInit {
  _appComponent: AppComponent;
  city: string;
  area: string;
  addtovisible: string;
  ser_string: any;
  testDetails: any = [];
  test_id:any;
  _greetMessage:any;
  public _api:ApiService;
  sw:number;
  _bookComponent:BookComponent;
  loading=[];
  
_packages:any=[];

   mpckgshow:boolean=false;
 
  getpackagecnf: boolean;
  searchTerm : FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  searchResult = [];
  _packagesSearchResult:any=[];
  public filterKey:any;

   top_tests:string[]=["Complete Blood Picture (CBP), EDTA Whole Blood","Lipid Profile, Serum","Liver Function Test (LFT), Serum","Thyroid Antibodies (TG & TPO), Serum","Thyroid Profile (T3,T4,TSH), Serum","1, 25-Dihydroxy Vitamin D, Serum","25 - Hydroxy Vitamin D, Serum","Urea, Serum","Creatinine, Serum","Triple Marker, Serum","Magnesium, Serum"
                      ,"Complete Urine Examination (CUE), Spot Urine","Glucose Fasting (FBS),  Sodium Flouride Plasma","Glycosylated Hemoglobin (HbA1C), EDTA Whole Blood","Uric Acid, Serum","Thyroglobulin (Tg), Serum","Blood Urea Nitrogen (BUN), Serum","Prolactin, Serum","Prothrombin Time With INR, Sodium Citrate Whole Blood","HIV 1 & 2 Antibodies, Serum","Culture And Sensitivity (Aerobic), Urine"];

 static_data="<p>1) My CBC report includes a result for immature platelet fraction (IPF). What is it?</p> <p>IPF is the relative number of immature platelets (also called reticulated platelets) in the blood. Platelets are produced in the bone marrow and are normally not released into the bloodstream until they have matured. When platelet numbers in the blood are low (thrombocytopenia), it stimulates the bone marrow to produce platelets faster. When the need is great and when production cannot keep up with &quot,demand,&quot, then an increased number of immature platelets will be released into the bloodstream.</p> <p>This IPF test result would be one of the values reported when blood is evaluated using an automated hematology analyzer. The IPF may be used to help a healthcare provider determine the likely cause of a person's thrombocytopenia, that is, decrease in production by the bone marrow (IPF is low) versus increased loss of platelets in the blood (IPF is higher). Lab test results including platelet count and IPF can also help determine if a person needs a platelet transfusion and help monitor bone marrow recovery, such as after a bone marrow transplant. Other uses are being studied and the test's ultimate clinical utility has not yet been well determined.</p> <p>2) My CBC report includes a result for reticulocyte hemoglobin. What is it?</p> <p>The hemoglobin inside of reticulocytes can be measured and reported as either a mean reticulocyte hemoglobin content (CHr) or a reticulocyte hemoglobin equivalent (Ret-He), depending upon the test method used. This test result would be one of the values reported when blood is evaluated using an automated hematology analyzer.</p> <p>Reticulocytes are &quot,young&quot, red blood cells that are released by the bone marrow before they become fully mature. The amount of hemoglobin inside of reticulocytes can help determine if there has been enough iron available, to be incorporated into hemoglobin production and then into red blood cell production in the bone marrow, within the past few days. This makes the test useful in identifying functional iron deficiency in certain clinical conditions and in assessing iron deficiency anemia in children.</p> <p>3) My CBC report includes a result for immature granulocytes (IG). What are they?</p> <p>Some automated hematology analyzers report the total number of immature granulocytes (IG) present in a person's blood sample. Immature granulocytes are white blood cells that have not fully developed before being released from the bone marrow into the blood. They may include metamyelocytes, myelocytes, and promyelocytes. These cells are normally only present in the bone marrow because they are precursors of neutrophils, the predominant type of white cells in blood. The presence of immature granulocytes in the blood may occur in various diseases, such as infection or a blood cancer, and thus will often prompt further investigation, which may include additional laboratory testing.</p> <p>4) Is there anything I can do to improve results of my CBC?</p> <p>People who have a keen interest in their own health care frequently want to know what they can do to change their WBCs, RBCs, and platelets. Unlike &quot,good&quot, and &quot,bad&quot, cholesterol, cell populations are not generally affected by lifestyle changes unless the individual has an underlying deficiency (such as vitamin B12 or folate deficiency or iron deficiency). There is no way that a person can directly raise the number of his WBCs or change the size or shape of his RBCs. Addressing any underlying diseases or conditions and following a healthy lifestyle will help optimize your body's cell production, and your body will take care of the rest.</p> <p>5) If I have an abnormal result on my CBC, what other tests might my doctor order as follow up?</p><p>It depends on the results that are abnormal and the suspected cause as well as your medical history and findings from your physical examination. Your healthcare provider may request that a blood smear examination be done. Other general tests to check your health and to look for possible causes may include a comprehensive metabolic panel (CMP). A few other general examples include:</p> <p>Abnormal results for WBCs may be followed by a culture of the affected area (e.g., blood culture, urine culture, sputum culture), a strep test or tests for viruses such as mononucleosis or EBV. If inflammation is suspected, then a CRP or ESR test may be done.</p> <p>Abnormal RBC results may prompt a reticulocyte count, iron studies, tests for vitamin B12 and folate, G6PD, or hemoglobinopathy evaluation to help make a diagnosis.</p> <p>An abnormal platelet count may be followed by tests that further evaluate platelets, such as platelet function tests or HIT antibody. Additional tests may be done to check for bleeding disorders or excessive clotting disorders such as PT, PTT, von Willebrand factor or coagulation factors.</p> <p>When a serious condition such as leukemia, myelodysplasia or another bone marrow disorder is suspected, then a bone marrow biopsy and examination may be necessary. Numerous other tests specific for certain conditions may be needed to establish a diagnosis. Talk to your healthcare provider about the results of your CBC, whether additional tests are necessary, and why.</p>";
  constructor(_api :ApiService,_bookComponent:BookComponent,private router :ActivatedRoute,private route:Router,private _scrollToService: ScrollToService,_appComponent :AppComponent,private meta:Meta){
    this._api=_api;
    this._bookComponent=_bookComponent;
    this._appComponent=_appComponent;
    this.loading['testdetails2']=true; 
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
         this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":""}).subscribe(data =>{
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
       
       this.loadtestDetails();
   }
  ngOnInit() {
  }
  loadtestDetails(){

    this.getAddToVisable();
    this.test_id=this.router.snapshot.paramMap.get('any');
    this.city=this.router.snapshot.paramMap.get('city');
    this.area=this.router.snapshot.paramMap.get('area');
  
    if(isNaN(this.test_id)){
      this.ser_string=this.test_id;
      this.ser_string=this.ser_string.replace("__,_","("); 
      this.ser_string=this.ser_string.replace("_,__",")"); 
      var re=/_/gi;
      this.ser_string=this.ser_string.replace(re," ");
      this.ser_string=this.ser_string.replace("?slh?","/"); 

      this.ser_string=this.ser_string.replace(/^\s+|\s+$/g,""); 
     
      this.ser_string=new String(this.ser_string);
      this.test_id='';
    }else{
      this.ser_string='';
    }

    this.sw=1;
   
    // debugger;
    this._api.getToken().subscribe( 
      token => { 
    this._api.POST('GetTestDetails', {TokenNo: token,test_id:this.test_id,'test_name':this.ser_string,city_name:this._appComponent.getCityName()}).subscribe(data =>{
      if(JSON.parse(data.json).data!==undefined){
        this.testDetails=JSON.parse(data.json).data[0];
        
          this.testDetails.report_avb=this.getHumanDate(this.testDetails.report_avb);
          this.testDetails.parameters=this.splitParams(this.testDetails.parameters);
          let meta_cnt="QUICK. ACCURATE. RESPONSIVE Our cutting edge technology, provide better diagnosis and accurate results to help you serve holistically and effectively. We are specialized in Radiology, Imaging, Pathology and Hematology. ";
          this.loading['testdetails2']=false;
        
          this.meta.addTag({ name: 'keywords', content: 'Tenet Diagnostics,Radiology, Imaging, Pathology and Hematology,blood test in hyderabad' });
          this.meta.addTag({ name: 'description', content: meta_cnt });
          if(this.testDetails.how_is_it_used){
            this.testDetails.how_is_it_used=this.strReplaceFaq(this.testDetails.how_is_it_used);
          } 
          if(this.testDetails.faq){
            this.testDetails.faq=this.strReplaceFaq(this.testDetails.faq);
           }
           
      }else{
        this.route.navigate(['./404']);
      }

      });
    });
 
  window.scrollTo(0, 0);
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
  public triggerScrollToOffsetOnly(offset: number = 0,dest) {
    var de = document.documentElement;
    var box = dest.getBoundingClientRect();
    //let top1:number=0;
    offset = box.top + window.pageYOffset - de.clientTop;
   
    const config: ScrollToConfigOptions = {
      offset
    };

    this._scrollToService.scrollTo(config);
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
  isadded(test:any){
    let b= this.shortIndex(test);
    return b;
   }

  getAddToVisable(){
    this.addtovisible=localStorage.getItem("addTocart");
   
  }
  strReplaceFaq(va:any){
    let a=va.replace("?","?<br>");
    let b=a.replace(/nn/gi,"\n\n");
    b=b.replace(/Naresh/gi,"<br>");
    
    return b;
  }
  getTestDetails(data:number){
    this.loading['testdetails']=true;
    this._api.getToken().subscribe( 
      token => { 
    this._api.POST('GetTestDetails', {token: token,test_id:data,city_name:this._appComponent.getCityName()}).subscribe(data =>{
      
       this.testDetails=JSON.parse(data.json).data;
       this.testDetails.parameters=this.splitParams(this.testDetails.parameters);
       this.testDetails.report_avb=this.getHumanDate(this.testDetails.report_avb);
       this.loading['testdetails']=false;
      });
    });
    
  }
  showHide(num:number){
    this.sw=num;
  }

  getAddTestCart1(tests:any){
    
     this._bookComponent.getTestByTidnAdd(tests.test_id,tests.test_name);
  
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
    return dateString;
  }

   getPopularTests(strng){
      if(strng===''){
        return this.top_tests;
      }else{
        return [];
      }
      
    }

    searchBasedOnString(str:any){
    
    if(str != undefined){
        this.route.navigate(['./book', {searchString:str}]);
      }else{
        return false;
      }

   }

    select(item,type:any){
        this.filterKey = new String(item);
        
        this.searchResult = [];
         this._packages=[];
         var re=/ /gi;
         let fk;
         fk=this.filterKey.replace(re,"_"); 
         fk=fk.replace("(","__,_"); 
         fk=fk.replace(")","_,__");
         fk=fk.replace("/","?slh?"); 
        if(type=="test"){
         
          window.location.href="./test-details/"+fk;
        }else if(type="package"){
          window.location.href="./package-details/"+fk;
        }
       
    }

   scroll(val){
    val.scrollIntoView({behavior: "smooth", block: "end", inline: "end"});
   }
   testQuantPlus(tid){
    this._appComponent.quantAddByIndex(tid);
     }
     testQuantMinus(tid){
      this._appComponent.quantMinusByIndex(tid);
       }
    noObjHide(val:any){
      let a=false;
   
      if(val===null||val==''||val=='undefined'||typeof val=='undefined'){
        a=false;
      }else if(val.length>0){
        a=true;
      }
      return a;

    }
    splitParams(val){
      return val.split("*");
    }
    goToCart(){
      this._appComponent.goToCart();
    }

}
