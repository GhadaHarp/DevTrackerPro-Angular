import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProjectsComponent } from '../projects/projects.component';
import { NewProjectComponent } from '../new-project/new-project.component';
import { NewTaskComponent } from '../new-task/new-task.component';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { APIService } from '../../services/API.service';

@Component({
  selector: 'app-home',
  imports: [
    ProjectsComponent,
    NewProjectComponent,
    NewTaskComponent,
    HeaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
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
  currTasktId!: string;
  router = inject(Router);
  constructor(private apiService: APIService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.userId = localStorage.getItem('userID') || '';
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.userId) {
      console.error('No user ID found.');
      return;
    }

    this.apiService.getUser(this.userId).subscribe(
      (res) => {
        console.log(this.userId);
        console.log(res);
        this.user = res.data;

        if (this.user) {
          this.fetchProjects();
        }
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/error'], {
          state: {
            message: error.error?.message || 'An unexpected error occurred',
          },
        });
      }
    );
  }

  fetchProjects() {
    this.apiService.getUserProjects(this.token).subscribe(
      (res) => {
        console.log(res);
        this.userProjects = res.data;

        console.log(this.userProjects);
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
    this.isAddingProject = true;
    this.project = null;
  }

  onStartEditProject(projectId: string) {
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
          state: { message: error.error.message },
        });
      }
    );
  }

  updateProject(project: any) {
    this.project = { ...project };
    const index = this.userProjects.findIndex(
      (p: any) => p._id === project._id
    );
    if (index !== -1) {
      this.userProjects[index] = project;
      this.userProjects = [...this.userProjects];
      this.cdr.markForCheck();
      console.log(this.userProjects);
      this.fetchProjects();
    }

    console.log('jjjjjjjjjjjjjj', this.project);
    // ✅ Fetch tasks for the updated project
    this.fetchProjectTasks(project._id);

    this.cdr.detectChanges();
  }

  // // ✅ New function to fetch tasks
  // fetchProjectTasks(projectId: string) {
  //   console.log('project id', projectId);
  //   this.apiService.getProjectTasks(projectId, this.token).subscribe(
  //     (res) => {
  //       this.tasks = res.data.tasks;
  //       console.log(this.tasks);
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.router.navigate(['/error'], {
  //         state: { message: error.error.message },
  //       });
  //     }
  //   );
  // }
  fetchProjectTasks(projectId: string) {
    console.log('Fetching tasks for project:', projectId);
    this.apiService.getProjectTasks(projectId, this.token).subscribe(
      (res) => {
        console.log('Received tasks:', res.data.tasks);
        const updatedTasks = [...res.data.tasks]; // ✅ Ensure a new array reference

        // ✅ Find project and update its reference
        this.userProjects = this.userProjects.map((project) =>
          project._id === projectId
            ? { ...project, tasks: updatedTasks } // ✅ New object reference
            : project
        );

        console.log('Updated userProjects:', this.userProjects);
        this.cdr.detectChanges(); // ✅ Force UI update
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/error'], {
          state: { message: error.error.message },
        });
      }
    );
  }

  onAddProject(newProject: any) {
    const existingProjectIndex = this.userProjects.findIndex(
      (project) => project._id === newProject._id
    );

    if (existingProjectIndex !== -1) {
      // Edit existing project
      this.userProjects[existingProjectIndex] = newProject;
    } else {
      // Add new project
      this.userProjects.push(newProject);
    }

    this.isAddingProject = false;
    this.cdr.detectChanges();
  }

  onDeleteProject(projectId: string) {
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
          state: { message: error.error.message },
        });
      }
    );
  }
  updateTask(newTask: any) {
    console.log('updating task', newTask);
    this.updateProject(newTask.project);
    // this.fetchProjectTasks(newTask.project._id);
  }
  onStartAddTask(projectId: any) {
    this.isAddingTask = true;
    this.currProjectId = projectId;
  }

  // onAddTask(newTask: any) {
  //   console.log('addingtask', newTask);

  //   this.fetchProjectTasks(newTask.project);
  // }
  onAddTask(newTask: any) {
    console.log('Adding task:', newTask);
    this.userProjects = this.userProjects.map((project) =>
      project._id === newTask.project
        ? { ...project, tasks: [...project.tasks, newTask] } // ✅ New object reference
        : project
    );

    console.log('Updated userProjects:', this.userProjects);
    this.cdr.detectChanges(); // ✅ Ensure UI refresh
  }

  onEditTask(task: any) {
    this.isAddingTask = true;
    // console.log(task);
    this.task = task;
  }
  onClose() {
    this.isAddingProject = false;
    this.isAddingTask = false;
    this.task = null;
  }
}
