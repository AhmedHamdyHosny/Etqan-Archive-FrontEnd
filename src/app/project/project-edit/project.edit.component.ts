import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/shared/models/project';

@Component({
  selector: 'app-project-edit',
  moduleId: module.id,
  templateUrl: 'project.edit.component.html',
  styleUrls: ['project.edit.component.css']
})
export class ProjectEditComponent implements OnInit, OnDestroy {
  project: Project = {
    projectId: '',
    projectName: '',
    projectLocation: ''
  };
  projectId!: string;
  projectGetSub:Subscription|undefined;
  projectEdittSub:Subscription|undefined;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private storageService: StorageService,
    private location: Location,
  ) {}


  ngOnInit(): void {
    this.projectId = this.activatedRoute.snapshot.params['id'];
    this.onEditProjectGET();
  }


  onEditProjectGET(): void {
    this.projectGetSub = this.storageService.onEditModelGET('project', this.projectId).subscribe((data: any) => {
      this.project = data.result.item;
    });
  }

  onEditProjectPOST() {
    this.projectEdittSub = this.storageService
      .onEditModelPOST('project', this.projectId, {
        ...this.project,
      })
      .subscribe({
        next: ()=>{
          this.location.back();
        }
      });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.onEditProjectPOST();
    }
  }

  onCancel() {
    this.location.back();
  }

  
  ngOnDestroy() {
    this.projectGetSub?.unsubscribe();
    this.projectEdittSub?.unsubscribe();
  }
}


