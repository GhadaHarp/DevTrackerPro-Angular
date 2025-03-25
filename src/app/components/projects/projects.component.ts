import {
  Component,
  EventEmitter,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { ProjectComponent } from '../project/project.component';
import { APIService } from '../../services/API.service';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [ProjectComponent, UpperCasePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  @Output() addProject = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<any>();
  userProjects = input.required<any>();
  userId = localStorage.getItem('userID') || '';
  token = localStorage.getItem('token') || '';
  user: any;
  @Output() deleteProject = new EventEmitter<any>();
  @Output() editProject = new EventEmitter<any>();
  @Output() editTask = new EventEmitter<any>();
  constructor(private apiService: APIService, private router: Router) {}
  ngOnInit(): void {
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.getUser(this.userId).subscribe(
      (res) => {
        console.log(res);
        this.user = res.data;
      },
      (error) => {
        console.log(error);

        this.router.navigate(['/error'], {
          state: { message: error.error.message },
        });
      }
    );
  }
  onStartAddProject() {
    this.addProject.emit();
  }
  onStartAddTask(projectId: string) {
    this.addTask.emit(projectId);
  }
  onDeleteProject(projectId: string) {
    this.deleteProject.emit(projectId);
  }
  onEditProject(projectId: string) {
    this.editProject.emit(projectId);
  }
  onEditTask(task: any) {
    this.editTask.emit(task);
  }
}
