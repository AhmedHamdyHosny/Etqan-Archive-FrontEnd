import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-category-add',
  moduleId: module.id,
  templateUrl: 'category.add.component.html',
  styleUrls: ['category.add.component.css']
})
export class CategoryAddComponent implements OnInit, OnDestroy {
  category: Category = {
    categoryId: '',
    categoryName: '',
  };
  categoryGetSub:Subscription|undefined;
  categoryCreateSub:Subscription|undefined;

  constructor(
    private storageService: StorageService,
    private location: Location,
  ) {}


  ngOnInit(): void {
    this.onCreateCategoryGET();
  }


  onCreateCategoryGET(): void {
    this.categoryGetSub = this.storageService.onCreateModelGET('Category').subscribe((data: any) => {
      this.category = data.result.item;
    });
  }

  onCreateCategoryPOST() {
    this.categoryCreateSub = this.storageService
      .onCreateModelPOST('Category', {
        ...this.category,
      })
      .subscribe({
        next: ()=>{
          this.location.back();
        }
      });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.onCreateCategoryPOST();
    }
  }

  
  ngOnDestroy() {
    this.categoryGetSub?.unsubscribe();
    this.categoryCreateSub?.unsubscribe();
  }
}


