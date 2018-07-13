import { Component, OnInit } from '@angular/core';
import {ApiService} from '../common/api.service';
import { AccountComponent } from '../account/account.component';
import {Router} from '@angular/router';
import { BookComponent } from "../book/book.component";
import { AppComponent } from "../app.component";
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  providers:[AccountComponent,BookComponent]
})
export class InvoiceComponent implements OnInit {
  server_url: string;
  ismobileview: boolean;
  paymentOpt: string;
  pdf: any = [];
  nearestLabLocation:any;
  public _api:ApiService;
  orderno:string;
  tmp:any=[];
  temp:any=[];
  toArray:any=[];
  order_data:any=[];
  user:any=[];
  userInfo:any=[];
  public accountComponent:any;
  orderDetails:any=[];
  orderInfo:any=[];
  orderInfo1:any=[];
  testInstrs:any=[];
  ti:boolean=false;
  pdf1:string;
  res:any=[];
  loading: any = [];
  constructor(_api :ApiService, private router :Router,accountComponent:AccountComponent,private bookComponent:BookComponent,private _appComponent :AppComponent) {
    this._api=_api;
    this.server_url=this._api.other_url;
    this.accountComponent =accountComponent;
    this._appComponent=_appComponent;
    this.ismobileview=this._appComponent.isMobile();
    this.paymentOpt=localStorage.getItem("paymentOpt_slip");
    console.log(this.paymentOpt);
    if(this.paymentOpt=="1"){
      this.getOrderPaymentStatus();
    }else {
     
      this.getOrderDetails();
    }
    
    this.user = JSON.parse(localStorage.getItem('user'));

   }

  ngOnInit() {
    this.getNearestLab();
    if(localStorage.getItem('tests')!==null){
      if(JSON.parse(localStorage.getItem('tests')).length>0){
        this.bookComponent._appComponent.clearCart();
       }
    }
    
   
    window.scrollTo(0, 0);
  }

  getNearestLab(){
    if(localStorage.getItem('nearestLabLocation')===null){
      this.nearestLabLocation="";
    }else{
      this.nearestLabLocation=JSON.parse(localStorage.getItem('nearestLabLocation'));
    }
  }

  getOrderInvoice(){
    this.loading['invoice']=true;
   if(sessionStorage.getItem('invoice')){
        let orderInfo = JSON.parse(sessionStorage.getItem('invoice'));
         if(orderInfo[0].order_nos.indexOf(',') > -1) {
            let ord_nos  = orderInfo[0].order_nos.split(',');
            this.order_data=[];
              for (let ord_no of ord_nos) {
                  this.pdf=[];
                  this._api.getToken().subscribe( 
                    token => { 
                      this._api.POST('GetOrderInvoice', {TokenNo: token,orderno: ord_no}).subscribe(data =>{
                        this.loading['invoice']=false;
                      this.tmp=JSON.parse(data.json).data;
                      this.pdf={'message':this.tmp[0].message,'ordNo':ord_no}
                      if(this.pdf){
                       this.order_data.push(this.pdf);
                      }
                     });
                    });
                     
              }

           }else{
            this.pdf=[];
           
            this._api.getToken().subscribe( 
              token => { 
              this._api.POST('GetOrderInvoice', {TokenNo: token,orderno: orderInfo[0].order_nos}).subscribe(data =>{
                this.loading['invoice']=false;
                this.tmp=JSON.parse(data.json).data;
                this.pdf = this.tmp[0].message;
                this.pdf={'message':this.tmp[0].message,'ordNo':orderInfo[0].order_nos}
                if(this.pdf){
                       this.order_data.push(this.pdf);
                      }
                
               });
              });
           }
      }
    
  }



  getOrderDetails(){

  this.user = JSON.parse(localStorage.getItem('user'));
   let orderInfo = JSON.parse(sessionStorage.getItem('invoice'));
   this.loading['details']=true;
     if(orderInfo[0].order_nos.indexOf(',') > -1) {
            let ord_nos  = orderInfo[0].order_nos.split(',');
            this.orderDetails=[];
              for (let ord_no of ord_nos) {
                this._api.getToken().subscribe( 
                  token => {
                  this._api.POST('GetOrderDetails', {TokenNo: token,orderno: ord_no,mobileno:'',type:"B"}).subscribe(data =>{
                    this.loading['details']=false;
                     this.orderDetails=JSON.parse(data.json).data;

                      if(this.orderDetails.length>0){
                        let ords:any=[];
                        this.orderDetails.forEach(element => {
                                  element.schedule_dt= this.getHumanDate(element.schedule_dt);
                                  this.getTestInstructions(element.tid);
                                  ords.push(element);
                                   
                                });
                                
                        this.orderInfo.push(ords);
                        
                     }else{}

                   });
                  });
                   
               }
              
           }else{
            let invpdf:any;
            this._api.getToken().subscribe( 
              token => {
              this._api.POST('GetOrderDetails', {TokenNo:token,orderno: orderInfo[0].order_nos,mobileno:'',type:"B"}).subscribe(data =>{
                this.loading['details']=false;
              this.orderInfo1=JSON.parse(data.json).data;
              
                  this.orderInfo1.forEach(element => {
                    element.schedule_dt= this.getHumanDate(element.schedule_dt);
                     this.getTestInstructions(element.tid);
                            }); 
               });
              });

           }
           

  }

   getOrderInvoice1(billNo:string){
    this.loading['invoice']=true;
    this._api.getToken().subscribe( 
      token => { 
      this._api.POST('GetOrderInvoice', {TokenNo: token,orderno: billNo}).subscribe(data =>{
        this.loading['invoice']=false;
        this.tmp=JSON.parse(data.json).data;
        this.pdf = this.tmp[0].message;
        this.pdf={'message':this.tmp[0].message,'ordNo':billNo}
        if(this.pdf){
             
              window.open(this.server_url+'/orderinvoice/'+this.pdf.message,"_blank");
              }
              this.loading['invoice']=false;
       
       });
      });
       }


  getHumanDate(date:any){
    date=date.replace("/Date(","");
    date=date.replace(")/","");
    date=date.split("+");

    let fdt=parseInt(date[0]);
    let theDate = new Date(fdt);
    let dateString = theDate.toLocaleString();
    return dateString;
  }

  getTestInstructions(tid:any){
    this._api.getToken().subscribe( 
      token => {
     this._api.POST('GetOrderInstructions', {TokenNo: token,serviceid:tid}).subscribe(data =>{
                
                  let inst=JSON.parse(data.json).data;
                  this.testInstrs[tid]=[];
                  this.testInstrs[tid]=inst;  
                  console.log('a',this.testInstrs[tid][0]);    
                 });
                });
  }

  testInst(){
    this.ti=false;
  }
  getOrderPaymentStatus(){
    let transdata=localStorage.getItem("transtoken");
    if(transdata!==null){
      transdata=JSON.parse(transdata);
      let orderid=transdata['orderid'];
      let transid=transdata['transid'];
      this._api.getToken().subscribe( 
        token => {
       this._api.POST('GetOrderPaymentStatus', {TokenNo: token,orderno:orderid,tranno:transid}).subscribe(data =>{
                  
                    let inst=JSON.parse(data.json).data;
                    let inlen=inst.length;
                    let k=0;
                    let l=0;
                    inst.forEach(element => {
                  if(element['due_amount']>0){
                    k++;
                  }
                  l++;
                  if(l==inlen){
                    if(k>0){
                      alert("Your Payment Failed,Please try later");
                    }else{
                    
                      this.getOrderDetails();
                    }
                  }
                 

                });
                   });
                  });
    }
    

  }

}
