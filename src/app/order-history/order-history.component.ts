import { Component, OnInit } from '@angular/core';
import {ApiService} from '../common/api.service';
import {Router} from '@angular/router';
declare var swal: any;
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  public _api:ApiService;
  public user:any=[];
  isTokenSet:boolean=false;
  public myFinalizedOrders:any=[];
  public billDetails:any=[];
  public partient_name="NA";
  tbill_no=null;
  public loading = [];
  constructor(_api :ApiService,private router:Router){
    this._api=_api;
   }

  ngOnInit() {
    this.tokenCheck(); 
    this.getHistory();
    window.scrollTo(0, 0);
    
  }
  tokenCheck(){
    if(localStorage.getItem('token')===null){
      this.isTokenSet=false;
    }else{
      this.isTokenSet=true;
     
      if(JSON.parse(localStorage.getItem('user'))){
        this.user=JSON.parse(localStorage.getItem('user'));
      }
    }
   }
    getHistory(){
      this.loading['getBills']=true;
      this._api.getToken().subscribe( 
        token => {
      this._api.POST('GetFinalizedOrderHistory', {TokenNo: token,'patientid':this.user.uid,'mobileno':''}).subscribe(data =>{
        this.myFinalizedOrders=JSON.parse(data.json).data;
        
       if(this.myFinalizedOrders==undefined){
         this.myFinalizedOrders=[];
        this.loading['getBills']=false;   
       }else if(this.myFinalizedOrders.length > 0){
         this.myFinalizedOrders= this.getBilltoArray(this.myFinalizedOrders);
      }
      this.loading['getBills']=false;
        });
      });
        }
    getBilltoArray(finalizedOrders:any){
      // var i=0;
      let retArray=[];
      finalizedOrders.forEach(function(val){
        let a=val.order_nos.split(",");
        val.order_nos=a;
        retArray.push(val);
        // i++;
      });
      retArray=retArray.sort();
      return retArray;
    }
  getBillDetails(bill_no){
   this.loading['billDetails']=true;
    this.billDetails=[];
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetOrderDetails', {TokenNo: token,'orderno':bill_no,'mobileno':''}).subscribe(data =>{
      this.billDetails=JSON.parse(data.json).data;
   this.partient_name=this.billDetails[0].patient_name;
   this.loading['billDetails']=false;
      });
    });
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
  deleteService(order_id,tid,bill_no){
   // swal("Sorry this service is currently unavailable,Please contact our customer care!!! \n9900099000");
   // return;
   //  let res=confirm("Are you sure? \nDo you want to remove this service?");
    // if(res){
    //   // 
    //   this.tbill_no=bill_no;
    //   this._api.POST('CancelOrder', {token: 'SomeTokenHere','orderid':order_id,'serviceid':tid}).subscribe(data =>{
    //     this.billDetails=JSON.parse(data.json).data;
    //  // console.log(this.billDetails);
    //  this.addCancelAmountTowallet(this.tbill_no);
    //     });
    // }

  }
  addCancelAmountTowallet(tbill_no){
    //update wallet here
    this.getBillDetails(tbill_no);
  }
  addMore(bill_no){
    swal("Sorry this service is currently unavailable,Please contact our customer care!!! \n9900099000");
    return;
    // localStorage.setItem("modify_bill",bill_no);
    // let m={"uid":this.billDetails[0].id,"user_name":this.billDetails[0].patient_name}
    // localStorage.setItem("modi_member",JSON.stringify(m));
    // this.router.navigate(['./book']);
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

}
