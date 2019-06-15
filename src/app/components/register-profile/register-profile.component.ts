import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControlName, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-register-profile',
  templateUrl: './register-profile.component.html',
  styleUrls: ['./register-profile.component.scss']
})
export class RegisterProfileComponent implements OnInit {
  public registerProfileForm: FormGroup;
  constructor() { }

  matcher =  new MyErrorStateMatcher();

  ngOnInit() {
    this.registerProfileForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      lastname: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(7)]),
      confirmpassword: new FormControl('')
    }, { validators: this.passwordValidator });
  }

  get firstname() {return this.registerProfileForm.get('firstname')};
  get lastname() {return this.registerProfileForm.get('lastname')};
  get email() {return this.registerProfileForm.get('email')};
  get password() {return this.registerProfileForm.get('password')};
  get confirmpassword() {return this.registerProfileForm.get('confirmpassword')};

  submit(){
    debugger;
  }

  passwordValidator: ValidatorFn = (control: FormGroup): ValidationErrors  => {
    const password = control.get('password');
    const confirmpassword = control.get('confirmpassword');
  
    return password.value === confirmpassword.value ? null : { notSame: true }
  }
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}


