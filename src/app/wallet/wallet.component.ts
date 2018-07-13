import { Component, OnInit } from '@angular/core';
import {ApiService} from '../common/api.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
	public _api:ApiService;
	isTokenSet:boolean=false;
	user:any=[];
	wallet:any=[];
	wa:any=[];
	addW:boolean=false;
	tmp:boolean=false;
	updatedWI:any=[];
	walletHistory:any=[];
  constructor(_api :ApiService) {
  	this._api=_api;
   }

  ngOnInit() {
  	this.tokenCheck();
  	this.GetWallet();
  	this.GetWalletHistory();
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

   GetWallet(){
   
     this._api.getToken().subscribe( 
      token => { 
   	this._api.POST('GetWallet', {'TokenNo': token,'userid':this.user.uid}).subscribe(data =>{
        this.wallet=JSON.parse(data.json).data;
        if(this.wallet==undefined){
          this.wa.wallet_amount=0;
        }else{
        
        this.wa = this.wallet[0];
        }
        
        });
      });
   }

   AW(){
   	this.addW=true;
   	this.tmp=false;
   }

   hm2(){
   	this.addW=false;
		this.tmp=true;
   }

    GetWalletHistory(){
      this._api.getToken().subscribe( 
        token => { 
	   	this._api.POST('GetWalletHistory', {'TokenNo': token,'userid':this.user.uid}).subscribe(data =>{
	        this.walletHistory=JSON.parse(data.json).data;
          if(this.walletHistory == undefined){
            this.walletHistory=[]; 
          }else{
            for(let key in this.walletHistory){
              this.walletHistory[key].create_date=this.getHumanDate(this.walletHistory[key].create_date);
            }
            
          }
	       
          });
        });
	   }


   addAmount(form:any){
	
		let data={
			"TokenNo":'SomeTokenHere',
			"userid":form.userid,
      "type":1,
			"amount":form.amount
		};
  
  this._api.getToken().subscribe( 
    token => { 
      data.TokenNo=token;
   	 	this._api.POST('UpdateWallet', data).subscribe(data =>{
        this.updatedWI = JSON.parse(data.json).data;
       
        this.tmp=true;
        this.GetWallet();
        this.GetWalletHistory();
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

}
