import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-category-edit',
  moduleId: module.id,
  templateUrl: 'category.edit.component.html',
  styleUrls: ['category.edit.component.css']
})
export class CategoryEditComponent implements OnInit, OnDestroy {
  category: Category = {
    categoryName: '',
    categoryId: ''
  };
  
  categoryId!: string;
  categoryGetSub:Subscription|undefined;
  categoryEdittSub:Subscription|undefined;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private storageService: StorageService,
    private location: Location,
  ) {}


  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.params['id'];
    this.onEditCategoryGET();
  }


  onEditCategoryGET(): void {
    this.categoryGetSub = this.storageService.onEditModelGET('category', this.categoryId).subscribe((data: any) => {
      this.category = data.result.item;
    });
  }

  onEditCategoryPOST() {
    this.categoryEdittSub = this.storageService
      .onEditModelPOST('category', this.categoryId, {
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
      this.onEditCategoryPOST();
    }
  }

  onCancel() {
    this.location.back();
  }

  
  ngOnDestroy() {
    this.categoryGetSub?.unsubscribe();
    this.categoryEdittSub?.unsubscribe();
  }
}
