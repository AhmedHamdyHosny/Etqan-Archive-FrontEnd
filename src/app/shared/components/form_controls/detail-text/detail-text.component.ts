import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-text',
  templateUrl: './detail-text.component.html',
  styleUrls: ['./detail-text.component.css']
})
export class DetailTextComponent implements OnInit {

  @Input() label:string = '';
  @Input() value: string | number | undefined | null;
  
  constructor() { }

  ngOnInit(): void {
  }
 
}
