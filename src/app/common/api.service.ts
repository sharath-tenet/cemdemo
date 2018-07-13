import {Injectable} from '@angular/core';

import { Http, Response, Headers, RequestOptions, RequestMethod,Request } from '@angular/http';
//import {BookComponent} from '../book/book.component';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { parseString } from 'xml2js';

@Injectable()
export class ApiService {
    http:any;
    // bookcomponent:any;
    public labDetails=[];
    token:any=null;
    //private url:any='http://192.168.0.169:2007/api/';
    mdata:any=[];
    public other_url:string="http://208.163.37.165/intgtenet";
   private url:any='http://208.163.37.165/intgtenet/CemsDataRequest.asmx/';
    private url1:any='http://208.163.37.165/intgtenet/CemsDataRequest.asmx/GetAuthorization';
    private ticketurl:any='https://tenetmedcorp.freshdesk.com/api/v2/tickets';
     constructor(http: Http){
         this.http=http;
        // this.labDetails =[];
        
        this.mdata=[];
         
     }
     getToken(){
        
        var headers = new Headers();
        headers.append('Content-Type', 'x-www-form-urlencoded');
        return this.http.get(this.url1).map(data => {
          let data2= JSON.parse(this.trimxmltag(data._body));
          localStorage.setItem('req_token',this.token);
          return this.token = data2.data[0].GUID
          
    });
     }
    //  push(token:any,url:any,data:any){

    //  } 
    masterCall(url, data){

        
        //data.TokenNo=localStorage.getItem('req_token')
        let body=this.transform(data);
       // console.log(body);
        return this.http.post(this.url + url,body,{
             headers : {
                 'Accept': 'application/xml',
                 'Content-Type' : 'application/x-www-form-urlencoded'
             }
             
         })
         .map((res: Response) => {
            let res1=this.trimxmltag(res['_body']);
            //console.log(res1);
            let tstat=JSON.parse(res1).status;
             if (tstat==1){
                 return { status: tstat, json: res1 }
             }else{
                 return { status: tstat, json: "[]" }
             }
         });

    }

     POST(url, data){
         //request token here
         //localStorage.setItem('req_token','');
       this.getToken().map(
                data2 => {
                    this.token = data2.data[0].GUID
                    localStorage.setItem('req_token',this.token);
                }
            );
            return this.masterCall(url,data).debounceTime(2000).map((res)=>{
                return this.mdata=res;
            });
            

       
        
    }

    trimxmltag(dt:any){
        var re0='<?xml version="1.0" encoding="utf-8"?>';
        var re = '<string xmlns="http://Suvarna.org/">'; 
        var re1 = '</string>'; 
        var str = dt;
        var newstr = str.replace(re, ""); 
        var newstr = newstr.replace(re1, "");
        var newstr = newstr.replace(re0, ""); 
        //var newstr = newstr.replace(null, ""); 
        let parsed_data=newstr.trim();
        return parsed_data;
    }
    transform(data:any):any{
        let ret="";
        let i=0;
        for (let key in data) {
            if(i==0){
                ret=ret+''+key+'='+data[key];
            }else{
                ret=ret+'&'+key+'='+data[key];
            }
           
           i++;
          }
          //console.log(ret);
          return ret;
    }
    PinByGoogle(req_url):any{ 
         //console.log(req_url);
        return this.http.get(req_url).map(data => {
           return JSON.parse(this.trimxmltag(data._body)).results;
     });
    }
    ticketsHandling(data){
         return this.http.post(this.ticketurl,data,{
              headers : {
                  'Content-Type' : 'application/json',
                  'Authorization':'Basic c3Jpbml2YXNAdGVuZXRtZWRjb3JwLmNvbTp0ZW5ldEAzMjE='
              }
              
          })
          .map((res: Response) => {
          return res;
          });
    }

}
