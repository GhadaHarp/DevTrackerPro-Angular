import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../../services/API.service';
import { ProjectsComponent } from '../projects/projects.component';
import { NewProjectComponent } from '../new-project/new-project.component';
import { NewTaskComponent } from '../new-task/new-task.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    ProjectsComponent,
    NewProjectComponent,
    NewTaskComponent,
    HeaderComponent,
    CommonModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  token!: string;
  userId!: string;
  user: any;
  userProjects: any[] = [];
  userTasks: any;
  isAddingProject = false;
  isAddingTask = false;
  project: any;
  task: any;
  tasks: any;
  currProjectId!: string;
  currTaskId!: string;
  isLoading!: Observable<boolean>;
  isLoadingPrimitive = false;
  loadingTasksMap: { [projectId: string]: boolean } = {};

  errorMessage: string = '';
  router = inject(Router);

  constructor(private apiService: APIService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.userId = localStorage.getItem('userID') || '';
    this.isLoading = this.apiService.loading$;

    this.cdr.detectChanges();

    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.userId) {
      console.error('No user ID found.');
      return;
    }
    setTimeout(() => {
      this.apiService.setLoading(true);
      this.isLoadingPrimitive = true;

      this.apiService.getUser(this.userId).subscribe(
        (res) => {
          this.user = res.data;
          this.fetchProjects();
        },
        (error) => {
          this.router.navigate(['/error'], {
            state: {
              message: error.error?.message || 'Unexpected error',
            },
          });
        },
        () => {
          this.apiService.setLoading(false);
          this.isLoadingPrimitive = false;
        }
      );
    }, 0);
  }

  fetchProjects(): void {
    setTimeout(() => {
      this.apiService.setLoading(true);
      this.isLoadingPrimitive = true;
      this.apiService.getUserProjects(this.token).subscribe(
        (res) => {
          console.log(res);
          this.userProjects = res.data;
          this.cdr.detectChanges();
        },
        (error) => {
          this.cdr.detectChanges();
          console.log(error);
          this.router.navigate(['/error'], {
            state: {
              message: error.error?.message || 'Failed to fetch projects',
            },
          });
        },
        () => {
          this.apiService.setLoading(false);
          this.isLoadingPrimitive = false;
        }
      );
    }, 0);
  }

  onStartAddProject(): void {
    this.isAddingProject = true;
    this.project = null;
  }

  onStartEditProject(projectId: string): void {
    this.apiService.getProject(projectId, this.token).subscribe(
      (res) => {
        this.isAddingProject = true;
        console.log(res);
        this.project = res.data;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/error'], {
          state: { message: error.error?.message || 'Failed to edit project' },
        });
      }
    );
  }

  updateProject(project: any): void {
    this.project = { ...project };
    const index = this.userProjects.findIndex(
      (p: any) => p._id === project._id
    );
    if (index !== -1) {
      this.userProjects[index] = project;
      this.userProjects = [...this.userProjects];
      this.cdr.markForCheck();
      this.fetchProjects();
    }

    console.log('Updated project', this.project);
    this.fetchProjectTasks(project._id);
    this.cdr.detectChanges();
  }

  fetchProjectTasks(projectId: string): void {
    console.log('Fetching tasks for project:', projectId);
    setTimeout(() => {
      this.apiService.setLoading(true);
      this.isLoadingPrimitive = true;
      this.apiService.getProjectTasks(projectId, this.token).subscribe(
        (res) => {
          console.log('Received tasks:', res.data);
          const updatedTasks = [...res.data];

          this.userProjects = this.userProjects.map((project) =>
            project._id === projectId
              ? { ...project, tasks: updatedTasks }
              : project
          );
          console.log('Updated userProjects:', this.userProjects);
          this.cdr.detectChanges();
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/error'], {
            state: {
              message: error.error?.message || 'Failed to fetch project tasks',
            },
          });
        },
        () => {
          this.apiService.setLoading(false);
          this.isLoadingPrimitive = false;
        }
      );
    }, 0);
  }

  onAddProject(newProject: any): void {
    const existingProjectIndex = this.userProjects.findIndex(
      (project) => project._id === newProject._id
    );

    if (existingProjectIndex !== -1) {
      this.userProjects[existingProjectIndex] = newProject;
    } else {
      this.userProjects.push(newProject);
    }

    this.isAddingProject = false;
    this.cdr.detectChanges();
  }

  onDeleteProject(projectId: string): void {
    this.apiService.deleteProject(projectId, this.token).subscribe(
      (res) => {
        console.log(res);
        this.userProjects = this.userProjects.filter(
          (project: any) => project._id !== projectId
        );
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/error'], {
          state: {
            message: error.error?.message || 'Failed to delete project',
          },
        });
      }
    );
  }

  updateTask(newTask: any): void {
    console.log('Updating task', newTask);
    this.updateProject(newTask.project);
  }

  onStartAddTask(projectId: any): void {
    this.isAddingTask = true;
    this.currProjectId = projectId;
  }

  onAddTask(newTask: any): void {
    console.log('Adding task:', newTask);
    this.fetchProjectTasks(newTask.project);
    this.cdr.detectChanges();
  }

  onEditTask(task: any): void {
    this.isAddingTask = true;
    this.task = task;
  }

  onDeleteTask(taskId: any): void {
    console.log(taskId);
    this.tasks = this.tasks.filter((task: any) => task._id != taskId);
    this.fetchProjects();
  }

  onClose(): void {
    this.isAddingProject = false;
    this.isAddingTask = false;
    this.task = null;
  }
}
