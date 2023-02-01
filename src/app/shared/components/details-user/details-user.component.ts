import { Component, Input, OnInit } from '@angular/core';

export interface DetailsUser {
  createdOn: string | null;
  createdBy: string | null;
  modefiedOn: string | null;
  modefiedBy: string | null;
}


@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.css']
})
export class DetailsUserComponent implements OnInit {

@Input() detailsUser: DetailsUser | undefined;
  constructor() { }

  ngOnInit(): void {
  
  }
}
