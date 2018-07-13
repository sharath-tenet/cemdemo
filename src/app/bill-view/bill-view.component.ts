import { Component, OnInit } from '@angular/core';
import { ApiService } from "../common/api.service";
import { ActivatedRoute,  Router } from '@angular/router';
import { AppComponent } from "../app.component";
@Component({
  selector: 'app-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.css']
})
export class BillViewComponent implements OnInit {
  server_url: string;
  pdf: { 'message': any; 'ordNo': any; };
  ismobile: boolean;
  user: any;
  bill_no: string;
  partient_name: any;
  billDetails: any[];
  loading: any=[];
  statusMan:any={"Bill Done":1,"Collected Samples":2,"Sample Received":3,"Result Done":4,"Verified":5,"Approved":6,"Dispatched":7,"Cancelled":0}
  constructor(private _api :ApiService,private router :ActivatedRoute,private route :Router,private app:AppComponent) {
this.loading['billDetails']=false;
this.ismobile=this.app.isMobile();
this.server_url=this._api.other_url;
   }

  ngOnInit() {
    this.bill_no=this.router.snapshot.paramMap.get('bill');
   
    if(this.app.isLoggedIn){
      this.getBillDetails(this.bill_no);
      this.user=JSON.parse(localStorage.getItem("user"));
    }else{
      this.app.getNotify("Login to view the bill");
      this.route.navigate(['./home']);
    }

  }
  getBillDetails(bill_no){
 
   this.loading['billDetails']=true;
    this.billDetails=[];
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetOrderDetails', {TokenNo: token,'orderno':bill_no,'mobileno':'',"type":""}).subscribe(data =>{
      
      this.billDetails=JSON.parse(data.json).data;
      let i=0;
      this.billDetails.forEach(element => {
        this.billDetails[i]['test_status_original']=element.test_status;
        this.billDetails[i]['test_status']=this.getStatusNumber(element.test_status);
        
        i++;
      });
      
   this.partient_name=this.billDetails[0].patient_name;
   this.loading['billDetails']=false;
      });
    });
  }
  getStatusNumber(val){
   if(this.statusMan[val]){
     return this.statusMan[val];
   }else{
     return 0;
   }
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
    window.open('http://208.163.37.165/Intgtenet/orderinvoice/'+file, '_blank');
  }
  payDue(bill:any,due:any){
    let billarr=[];
    billarr.push(bill);
    this.finalizeOrder(billarr);
    localStorage.setItem('tempTotal', JSON.stringify(due));
  }
  finalizeOrder(fiorder_no:any){
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('FinalizeOrder', {TokenNo: token,'Referenceid':this.user.uid,'order_no':fiorder_no.join(),'payment_type':'1',is_due:"Y"}).subscribe(data =>{
      let inv=JSON.parse(data.json).data;
      sessionStorage.setItem('invoice', JSON.stringify(inv));
      localStorage.setItem('invoice', JSON.stringify(inv));
      localStorage.setItem("paymentOpt","1");
      if(inv[0].final_order_no){
        this.route.navigate(['./payment']);
      }
      // debugger;
    console.log("payment gateway redirection here");
     });
    });
  }
  getInvoice(ord_no){
    this.loading['billDetails']=true;
    this._api.getToken().subscribe( 
      token => { 
        this._api.POST('GetOrderInvoice', {TokenNo: token,orderno: ord_no}).subscribe(data =>{
          
                  let tmp=JSON.parse(data.json).data;
        this.pdf={'message':tmp[0].message,'ordNo':ord_no}
        this.loading['billDetails']=false;
        window.open(
          this.server_url+'/orderinvoice/'+this.pdf.message,
          '_blank' // <- This is what makes it open in a new window.
        );
       });
      });
  }
  getInv(){
    if(this.pdf==null||this.pdf==undefined){
      return false;
    }
    if(this.pdf.message===null){
      return false;
    }else{
      return true;
    }
  }

}
