import { Component, OnInit, ViewChild } from '@angular/core';
import { Expense } from 'src/app/models/expense';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'date', 'amount','description'];
  dataSource = new MatTableDataSource<Expense>(EXPENSES);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
}

const EXPENSES: Expense[] = [
  { id: '1', title: 'one', date: new Date(), description: "one", userId: '1',amount:1.0 },
  { id: '2', title: 'TWO', date: new Date(), description: "one", userId: '1',amount:1.0  },
  { id: '3', title: 'three', date: new Date(), description: "one", userId: '1',amount:1.0  },
  { id: '4', title: 'four', date: new Date(), description: "one", userId: '1',amount:1.0  },
  { id: '5', title: 'five', date: new Date(), description: "one", userId: '1',amount:1.0  },
  { id: '6', title: 'six', date: new Date(), description: "one", userId: '1',amount:1.0  },
  { id: '7', title: 'seven', date: new Date(), description: "one", userId: '1',amount:1.0  },
  { id: '8', title: 'eight', date: new Date(), description: "one", userId: '1',amount:1.0  },
  { id: '9', title: 'nine', date: new Date(), description: "one", userId: '1',amount:1.0  },
  { id: '10', title: 'ten', date: new Date(), description: "one", userId: '1',amount:1.0  },
  { id: '11', title: 'eleven', date: new Date(), description: "one", userId: '1',amount:1.0  }


]
