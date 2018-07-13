<div class="content" style="min-height:800px;">
    <div class="container">
      <div class="row" style="">
          <div class="col-md-1"></div>
            <div class="col-md-5">
                  <h1 class="bigtitle text-center"><strong>REGISTRATION</strong> </h1>
                  <div class="row">
                    <div class="col-md-12">
                      <form #f="ngForm" novalidate (ngSubmit)="save(f,f.valid);">
                        
                        <div class="form-group">
                                <input type="text" class="form-control theme" placeholder="Mobile *" pattern="[0-9]*" minlength="10" maxlength="10" ngModel name="Mobile" required #Mobile="ngModel"/>
                                <div style="color:#fc6107" 
                                *ngIf="Mobile.errors && (Mobile.dirty || Mobile.touched || f.submitted || Mobile.minlength || Mobile.pattern)">
                                  <p *ngIf="Mobile.errors.required">
                                      The Mobile Number is required
                                  </p>
                                   <p *ngIf="Mobile.errors.minlength">
                                        Mobile number should be 10 digit
                                  </p>
                                  <p *ngIf="Mobile.errors.minlength">
                                       Mobile number should be only numbers
                                  </p>

                                </div>
                         </div>
                          <div class="form-group">
                            <input type="password" class="form-control theme" placeholder="Password*" minlength="6" name="password" ngModel  required #password="ngModel"/>

                            <div style="color:#fc6107" 
                            *ngIf="password.errors && (password.dirty || password.touched || f.submitted || password.minlength)">
                              <p *ngIf="password.errors.required">
                                  The Password is required
                              </p>
                               <p *ngIf="password.errors.minlength">
                                   The Password must be at least 5 characters long.
                              </p>

                         
                            </div>

                          </div>
                           
                          <div class="form-group">
                                    <input type="password" class="form-control theme" placeholder="Confirm Password" required 
                         validateEqual="password"
                        name="confirmPassword" ngModel
                         #confirmPassword="ngModel">

                           <div [hidden]="confirmPassword.valid || confirmPassword.pristine" style="color:#fc6107">
                            Passwords did not match
                           </div>
                        </div>

                        <div style="color:#fc6107" 
                            *ngIf="confirmPassword.errors && (confirmPassword.dirty || confirmPassword.touched || f.submitted)">
                              <p *ngIf="confirmPassword.errors.required">
                                  The Confirm password is required
                              </p>
                        </div>
                        

              <!-- <div class="form-group">
                                <input class="form-control theme" required placeholder="Email Id*"/>
                            </div>
              <div class="form-group">
                                <input class="form-control theme" required placeholder="Date of Birth*"/>
                            </div>
              <div class="form-group">
                                <input class="form-control theme" required placeholder="Gender*"/>
                            </div>
              <div class="form-group">
                                <input class="form-control theme" required placeholder="Phone Number*"/>
                            </div>
              <div class="form-group">
                <textarea class="form-control theme" placeholder="Address"></textarea>
              </div> -->
              <div class="form-group text-right">
                <button class="btn btn-brand" type="submit">SIGN UP</button>
              </div>
                        </form>
                    </div>
                  </div>
            </div>
            <div class="col-md-1"></div>
            <div class="col-md-5" *ngIf="tmp">
                  <h1 class="bigtitle text-center"><strong>LOGIN</strong> </h1>
                  <div class="row">
                    <div class="col-md-12">
                      <form  #lf="ngForm" novalidate (ngSubmit)="loginSubmit(lf.value); lf.resetForm()">
                         <div class="form-group">
                            <strong  class="form-text text-danger" *ngIf="ivup">Invalid authentication</strong>
                          </div>
                          <div class="form-group">
                                <input type="email" #email name="email" class="form-control theme"  placeholder="User Name" ngModel required/>
                                    <div style="color:#fc6107" 
                                *ngIf="email.errors && (email.dirty || email.touched || f.submitted)">
                                      <p *ngIf="email.errors.required">
                                          The Mobile Number is required
                                      </p>
                                  </div>
                          </div>
                          <div class="form-group">
                                <input type="password" name="password1" #password1 class="form-control theme" ngModel  placeholder="Password" required/>
                          </div>
                          <div class="form-group">
                              <a routerLink="/login" (click)="fp1()" class="card-link">Forgot Password</a>
                          </div>
                          <div class="form-check">
                            <label class="form-check-label">
                              <input type="checkbox" class="form-check-input" name="rm" #rm [checked]="rememberMe" ngModel>
                              Remember me 
                            </label>
                          </div>
                          <div class="form-group text-right">
                            <button class="btn btn-brand" type="submit">LOGIN</button>
                          </div>
                        </form>
                    </div>
                  </div>
            </div>
            <!--login -->
            <!-- FP -->
              <div class="col-md-5" *ngIf="fp">
                  <h4 class="bigtitle text-center">FORGOT PASSWORD</h4>
                  <div class="row">
                    <div class="col-md-12">
                      <form action="javascript:void(0)" #forgotForm="ngForm" novalidate (ngSubmit)="getForgotPassword(forgotForm.value)">

                          <div class="form-group">
                                <input type="text" class="form-control theme" ngModel #mobile="ngModel" placeholder="Enter Mobile Number" name="mobile"/>
                                <small id="emailHelp" class="form-text text-muted">OTP will send to your registered Mobile number</small>
                          </div>
                          
                          <div class="form-group text-right">
                            <button class="btn btn-brand" type="submit">Submit</button>
                          </div>
                        </form>
                    </div>
                  </div>
            </div> 
            <!--FP-->

            <!--OTP Verification -->
            <div class="col-md-5" *ngIf="votp">
                  <h4 class="bigtitle text-center">Verify OTP</h4>
                  <div class="row">
                    <div class="col-md-12">
                      <form action="javascript:void(0)" #votpForm="ngForm" novalidate (ngSubmit)="getOtpVerification(votpForm.value)">

                          <div class="form-group">
                                <input type="text" name="otp" class="form-control theme" ngModel #otp="ngModel"  placeholder="Enter OTP Here"/>
                                <input type="hidden" class="form-control theme" name="user_id" [(ngModel)] = "uid" ngModel #user_id="ngModel">

                          </div>
                          
                          <div class="form-group text-right">
                            <button class="btn btn-brand" type="submit">Submit</button>
                          </div>
                        </form>
                    </div>
                  </div>
            </div>
            <!--OTP Verification -->
            <!--CP Form-->
              <div class="col-md-5" *ngIf="cp">
                  <h4 class="bigtitle text-center">Change Password</h4>
                  <div class="row">
                    <div class="col-md-12">
                      <form action="javascript:void(0)" #cp="ngForm" novalidate (ngSubmit)="changePassword(cp.value)">
                          <input type="hidden" name="user_id" [(ngModel)]="uid">
                          <div class="form-group">
                                <input type="password" class="form-control theme" id="oldpassword" placeholder="Old Password" name="oldpassword" ngModel #oldpassword="ngModel"/>
                          </div>
                          <div class="form-group">
                                    <input type="password" class="form-control theme" placeholder="New Password" name="newpassword" ngModel #newpassword="ngModel">
                          </div>

                          <div class="form-group">
                                    <input type="password" class="form-control theme" placeholder="Confirm Password" required
           validateEqual="newpassword" name="cpassword" ngModel #cpassword="ngModel">
                          </div>
                          <div [hidden]="cpassword.valid || cpassword.pristine" style="color:#fc6107">
                          Passwords did not match
                          </div>
                          
                          <div class="form-group text-right">
                            <button class="btn btn-brand" type="submit">Done</button>
                          </div>
                        </form>
                    </div>
                  </div>
                </div>
            <!--CP Form-->
        </div>
     
     </div>
</div>