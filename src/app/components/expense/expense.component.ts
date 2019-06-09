import { Component, OnInit } from '@angular/core';
import { CustomErrorStateMatcher } from 'src/app/services/custom-error-state-matcher';
import { Expense } from 'src/app/models/expense';
import {FormControl, FormGroup, Validators, ValidatorFn, AbstractControl} from'@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  public expenseForm: FormGroup
  model = new Expense();
  
  matcher = new CustomErrorStateMatcher();
  constructor(private route :ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get('id'));
    this.expenseForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      date: new FormControl(new Date(),[Validators.required]),
      amount:new FormControl('',[Validators.required,,numberValidationFunction(/^(?:\d*\.\d{1,2}|\d+)$/)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(500)])
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.expenseForm.controls[controlName].hasError(errorName);
  }

  submit(){
    debugger;

  }

}

export function numberValidationFunction(numberRegex: RegExp):ValidatorFn{

  return (control:AbstractControl):{[key:string]:any} |null => {
    const forbidden = numberRegex.test(control.value);
    return forbidden ? {'valueInvalid': {value: control.value}} : null;
  }
}
