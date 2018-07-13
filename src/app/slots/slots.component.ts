import { Component, OnInit,Renderer } from '@angular/core';
import {ApiService} from '../common/api.service';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css']
})
export class SlotsComponent implements OnInit {
  public _api:ApiService;
  dates:any=[];
  slots:any=[];
  sel_date:any=null;
  sel_slot:any=null;
  slots_list:any=[];
  test_id=null;
  _tempSlots:any=[];
  constructor(_api:ApiService,private render:Renderer,private router :ActivatedRoute,private grouter :Router) {
    this._api=_api;
    
   }

  ngOnInit() {
    //available_dates
    this.router.params.subscribe(params => this.test_id=params.testId);
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetAvailableDates', {TokenNo: token,'test_id':this.test_id}).subscribe(data =>{
     this.dates=JSON.parse(data.json).data;
     this.checkDate();
     });
    });
    
    
  }
  showSlots(date:any){
    
    let dtn=date.available_date.split("-");
   this.sel_date=dtn[2].concat(dtn[1]).concat(dtn[0]);
   this.sel_slot=null;
  }
  myIndexOf(o) {
    
        for (var i = 0; i < this._tempSlots.length; i++) {
          let a=JSON.stringify(this._tempSlots[i][0].tid);
          let b=JSON.stringify(o[0].tid);
       
            if (a===b) {
               this._tempSlots[i][0]['temp'][0].slot_date=o[0].temp[0].slot_date;
               this._tempSlots[i][0]['temp'][0].slot_time=o[0].temp[0].slot_time;
                return i;
            }
        }
        
        return -1;
    }
  getSlots(date:any){
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetAvailableTimeSlots', {TokenNo: token,'test_id':this.test_id,'date':date,'center_id':'1'}).subscribe(data =>{
      this.slots=JSON.parse(data.json).data;
      this.slots_list=this.slots.slots_list;
    
      });
    });
      
  }
  checkDate(){
    if(this.sel_date){
      this.getSlots(this.sel_date);
     }else{
       let dt=new Date(Date.now());
       let odate:any=dt.getDate().toString();
       if(odate<10){
        odate="0".concat(odate.toString());
      }else{
        odate=odate.toString();
      }
       let omonth:any=dt.getMonth()+1;
       if(omonth<10){
         omonth="0".concat(omonth.toString());
       }else{
        omonth=omonth.toString();
       }
       let oyear=dt.getFullYear().toString();
       this.sel_date=oyear.concat(omonth).concat(odate);
       this.getSlots(this.sel_date);

     }

  }
  bookSlot(slot:any){
    if(confirm('Are you sure? \nDo you want to book slot on '+this.sel_date+' at '+slot+' ?')){
      this.sel_slot=slot;
      this.router.params.subscribe(params => {
        this.test_id=params.testId
        type temp = { slot_date: any; slot_time: any};
        let temp:any=[];
        let a:any={};
        let b:any={};
        type tid={temp:temp};
        type slo={tid:number;temp:temp};
        let slo:any=[];
        this._tempSlots=[];
  
        if(localStorage.getItem('slot_details')===null){
          a['slot_date']=this.sel_date;
          a['slot_time']=this.sel_slot;
          temp.push(a);
          b.tid=this.test_id;
          b.temp=temp;
          slo.push(b);
          this._tempSlots.push(slo);
          localStorage.setItem('slot_details',JSON.stringify(this._tempSlots));
        }else{
          let temp2=[];
          slo=[];
          
          temp2=JSON.parse(localStorage.getItem('slot_details'));
         
          temp2.forEach(element => {
              this._tempSlots.push(element);  
          });
          a['slot_date']=this.sel_date;
          a['slot_time']=this.sel_slot;
          temp.push(a);
          b.tid=this.test_id;
          b.temp=temp;
          slo.push(b);
         
         if(this.myIndexOf(slo) < 0){
          this._tempSlots.push(slo);
         }
       localStorage.setItem('slot_details',JSON.stringify(this._tempSlots));
        }
        
        this.grouter.navigate(['./cart']);
      });
      
    }
    
  }

}
