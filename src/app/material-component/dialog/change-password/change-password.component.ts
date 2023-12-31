import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';
import { UserService } from 'src/app/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {



  oldPassword = true;
  newPassword = true;
  confirmPassword = true;
  changePasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(
    private formBulider:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ChangePasswordComponent>,
    private snackbarService:SnackbarService,
    private ngxService:NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBulider.group({
      oldPassword:[null , Validators.required],
      newPassword:[null , Validators.required],
      confirmPassword:[null , Validators.required],
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value){
      return true;
    }else{
      return false;
    }
  }


  handlePasswordChangeSubmit(){
    this.ngxService.start();
    var formDate = this.changePasswordForm.value;
    var data = {
      oldPassword: formDate.oldPassword,
      newPassword: formDate.newPassword,
      confirmPassword: formDate.confirmPassword
    }

    this.userService.changePassword(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage , "success");
    },(error)=>{
      console.log(error);
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage =GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage , GlobalConstants.error);
    }
    );
  }


}
