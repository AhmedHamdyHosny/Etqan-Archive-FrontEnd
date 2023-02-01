import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-category-detail',
  moduleId: module.id,
  templateUrl: 'category.detail.component.html',
  styleUrls: ['category.detail.component.css']
})
export class CategoryDetailComponent implements OnInit, OnDestroy {
  categoryId!: string;
  category: Category = {
    categoryId: '',
    categoryName: ''
  };

  categoryGetSub: Subscription | undefined;

  constructor(
    private storageService: StorageService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.params['id'];
    this.onCategoryGET();
  }

  onCategoryGET(): void {
    this.categoryGetSub = this.storageService
      .onGetModelDetails('category', this.categoryId)
      .subscribe((data: any) => {
        this.category = data.result;
      });
  }

  ngOnDestroy() {
    this.categoryGetSub?.unsubscribe();
  }

  onCancel() {
    this.location.back();
  }
}

