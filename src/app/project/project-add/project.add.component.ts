import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Project } from 'src/app/shared/models/project';

@Component({
  selector: 'app-project-add',
  moduleId: module.id,
  templateUrl: 'project.add.component.html',
  styleUrls: ['project.add.component.css']
})
export class ProjectAddComponent implements OnInit, OnDestroy {
  project: Project = {
    projectId: '',
    projectName: '',
    projectLocation: ''
  };
  projectGetSub:Subscription|undefined;
  projectCreateSub:Subscription|undefined;

  constructor(
    private storageService: StorageService,
    private location: Location,
  ) {}


  ngOnInit(): void {
    // this.onCreateProjectGET();
  }


  onCreateProjectGET(): void {
    this.projectGetSub = this.storageService.onCreateModelGET('project').subscribe((data: any) => {
      this.project = data.result.item;
    });
  }

  onCreateProjectPOST() {
    this.projectCreateSub = this.storageService
      .onCreateModelPOST('project', {
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
      this.onCreateProjectPOST();
    }
  }

  
  ngOnDestroy() {
    this.projectGetSub?.unsubscribe();
    this.projectCreateSub?.unsubscribe();
  }
}

