import { Component, OnInit } from '@angular/core';
import {ApiService} from '../common/api.service';
import {BookComponent} from '../book/book.component';
import { HttpModule } from '@angular/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
   providers:[BookComponent]
})

export class WishlistComponent implements OnInit {
user:any = [];
obj:any = [];
wishList:any=[];
public _api:ApiService;
_bookComponent:BookComponent;
wishlistItems:any=[];

status:string;
loc_id:number;
is_wishlist:number;
temp:any=[];

  constructor(private router :Router,_api :ApiService,_bookComponent:BookComponent) {
  	this._api=_api;
  	this._bookComponent=_bookComponent;
  	 this.getTestWishList();  
   }
  ngOnInit() {
 	
  }
  getTestWishList(){
	    let flag:number = 1;
	    this.user = localStorage.getItem("user");
        this.user = JSON.parse(this.user);
   
      this._api.getToken().subscribe( 
        token => { 
	     this._api.POST('GetTestWishList', {"TokenNo":token,"uid":this.user.uid,"flag":flag}).subscribe(data =>{
	        this.wishList = JSON.parse(data.json).data;
	        
	       
         });
        });
	  }

	getTestDetails(id:number){
     this.router.navigate(['./book/test-details', {testId:id}]);
     }

     getAddTestCart2(tests:any){
      this._bookComponent.getAddTestCart(tests,'test','');
    
    }

   deleteWishlistItem(uid:number,tid:number){

            this.status='D';
            let loc_id:number=1;
            let is_wishlist:number=1;
            this._api.getToken().subscribe( 
              token => { 
            this._api.POST('AddtoWishList', {"TokenNo":token,"uid":uid,"test_id":tid,"loc_id":loc_id,"status":this.status,"is_wishlist":is_wishlist}).subscribe(data =>{
            this.wishList = JSON.parse(data.json).data;
                
             });
            });
   }

}
