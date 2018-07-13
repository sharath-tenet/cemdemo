import { Component, OnInit,ElementRef,ViewChild,AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  transtoken: any;
  paymentOpt: string;

  isTokenSet: any;
  user:any;
  invoice:any;
  order_id:any;
  customer_id:any;
  industry_type_id:any;
  channel_id:any;
  txn_amount:any;
  @ViewChild('payform') payform: ElementRef;
  constructor(private router:Router,private rou:ActivatedRoute) { 
    this.tokenCheck();
    this.transcheck();
    this.testCheck();
    if(this.paymentOpt=='3'){
      this.codSuccess();
    }
    
     
    
  }
  ngAfterViewInit(){
    if(this.transtoken===null){
      this.sub();
    }
    
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }
  transcheck(){
    this.transtoken=this.rou.snapshot.paramMap.get('token');
    setTimeout(()=>{
      if(this.transtoken!==null){
        let dt=atob(this.transtoken);
       
        localStorage.setItem("transtoken",dt);
         this.router.navigate(['./invoice']); 
      }
    },2500);
    
  }
  tokenCheck(){
    if(localStorage.getItem('token')===null){
      this.isTokenSet=false;
    }else{
      this.isTokenSet=true;
      if(JSON.parse(localStorage.getItem('user'))){
        this.user=JSON.parse(localStorage.getItem('user'));
      }
      this.paymentOpt=localStorage.getItem("paymentOpt");
      if(this.paymentOpt){
        localStorage.setItem("paymentOpt_slip",this.paymentOpt);
      }
      
      localStorage.removeItem("paymentOpt");
  
  
    }
  }
  sub(){
    this.payform.nativeElement.submit();
  }
  testCheck(){
      if(this.isTokenSet){
        this.invoice= JSON.parse(localStorage.getItem('invoice'))[0];
        this.txn_amount=JSON.parse(localStorage.getItem('tempTotal'));  
  //bring all test details name,location,slot time and date
  //payment gateway redirection here
      }
      
  }
  codSuccess(){
    this.router.navigate(['./invoice']); 
    
  }

}
