import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
// import { APIService } from './api.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { APIService } from '../../services/API.service';

@Component({
  selector: 'app-new-project',
  imports: [ReactiveFormsModule],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.css',
})
export class NewProjectComponent implements OnChanges {
  @Output() close = new EventEmitter<void>();
  @Output() addProject = new EventEmitter<any>();
  @Output() editProject = new EventEmitter<any>();
  @Input({ required: true }) userId!: string;
  @Input() currProjectData!: any;

  enteredTitle = '';
  enteredDescription = '';
  enteredDate = '';
  isEditing = false;

  newProjectForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(500),
    ]),
    dueDate: new FormControl('', [Validators.required]),
  });

  token = localStorage.getItem('token') || '';
  private apiService = inject(APIService);
  private router = inject(Router);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currProjectData'] && this.currProjectData) {
      this.isEditing = true;
      this.enteredTitle = this.currProjectData.title;
      this.enteredDescription = this.currProjectData.description;
      const date = new Date(this.currProjectData.deadline);
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      this.enteredDate = localDate.toISOString().slice(0, 16);

      this.newProjectForm.setValue({
        title: this.enteredTitle,
        description: this.enteredDescription,
        dueDate: this.enteredDate,
      });
    } else {
      this.isEditing = false;
      this.newProjectForm.reset();
    }
  }

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    if (this.isEditing) {
      this.apiService
        .editProject(
          this.currProjectData._id,
          {
            title: this.enteredTitle,
            description: this.enteredDescription,
            deadline: this.enteredDate,
          },
          this.token
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.editProject.emit(res.data);
            this.close.emit();
          },
          (error) => {
            console.log(error);
            this.router.navigate(['/error'], {
              state: { message: error.error.message },
            });
          }
        );
    } else {
      this.apiService
        .addProject(
          {
            title: this.enteredTitle,
            description: this.enteredDescription,
            deadline: this.enteredDate,
          },
          this.token
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.addProject.emit(res.data);
            this.close.emit();
          },
          (error) => {
            console.log(error);
            this.router.navigate(['/error'], {
              state: { message: error.error.message },
            });
          }
        );
    }
  }
}

// export class NewProjectComponent {
//   @Output() close = new EventEmitter<void>();
//   @Output() addProject = new EventEmitter<any>();
//   @Output() editProject = new EventEmitter<any>();
//   @Input({ required: true }) userId!: string;
//   @Input() currProjectData!: any;
//   enteredTitle = '';
//   enteredDescription = '';
//   enteredDate = '';
//   ngOnInit() {
//     if (this.currProjectData) {
//       this.enteredTitle = this.currProjectData.title;
//       this.enteredDescription = this.currProjectData.description;

//       // Convert dueDate to a valid date string format (YYYY-MM-DD)
//       const date = new Date(this.currProjectData.deadline);
//       this.enteredDate = date.toISOString().split('T')[0]; // Extract the date part only
//     }
//   }

//   newProjectForm = new FormGroup({
//     title: new FormControl(null, [
//       Validators.required,
//       Validators.minLength(3),
//       Validators.maxLength(100),
//     ]),
//     description: new FormControl(null, [
//       Validators.required,
//       Validators.minLength(3),
//       Validators.maxLength(500),
//     ]),
//     dueDate: new FormControl(null, [Validators.required]),
//   });
//   token = localStorage.getItem('token') || '';
//   private apiService = inject(APIService);

//   private router = inject(Router);

//   onCancel() {
//     this.close.emit();
//   }
//   onSubmit() {
//     // if (this.currProjectData) {
//     //   this.apiService
//     //     .editProject(
//     //       this.currProjectData._id,
//     //       {
//     //         title: this.enteredTitle,
//     //         description: this.enteredDescription,
//     //         dueDate: this.enteredDate,
//     //       },
//     //       this.token
//     //     )
//     //     .subscribe(
//     //       (res) => {
//     //         console.log(res);
//     //         this.addTask.emit({
//     //           title: this.enteredTitle,
//     //           description: this.enteredDescription,
//     //           dueDate: this.enteredDate,
//     //         });
//     //         this.close.emit();
//     //       },
//     //       (error) => {
//     //         console.log(error);
//     //         if (error.status == 403) {
//     //           this.router.navigate(['/payment']);
//     //         } else {
//     //           this.router.navigate(['/error'], {
//     //             state: { message: error.error.message },
//     //           });
//     //         }
//     //       }
//     //     );
//     //   return;
//     // }
//     this.apiService
//       .editProject(
//         this.currProjectData._id,
//         {
//           title: this.enteredTitle,
//           description: this.enteredDescription,
//           deadline: this.enteredDate,
//         },
//         this.token
//       )
//       .subscribe(
//         (res) => {
//           console.log(res);
//           this.addProject.emit({
//             title: this.enteredTitle,
//             description: this.enteredDescription,
//             dueDate: this.enteredDate,
//           });
//           this.addProject.emit(res.data);
//           this.close.emit();
//         },
//         (error) => {
//           console.log(error);

//           this.router.navigate(['/error'], {
//             state: { message: error.error.message },
//           });
//         }
//       );
//   }
// }
