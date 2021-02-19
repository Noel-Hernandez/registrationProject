import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from '@app/_models/issue.model';
import{AccountServicee} from '@app/_services/issue.service';
@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.less']
})
export class AddIssueComponent implements OnInit {
  issueForm: FormGroup;
  constructor(private fb: FormBuilder, private route:ActivatedRoute ,
    private rest:AccountServicee, private router: Router) { 


      this.issueForm = this.fb.group({
        studentId: 0,
        description: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
        email: ['', [Validators.required]],
        referenceAddress: ['', [Validators.required]],
        service: ['', [Validators.required]],
    })



    }

  ngOnInit(): void {
  }
  addStudent() {

    if (!this.issueForm.valid) {
      return;
    }

    this.rest.AddIssue(this.issueForm.value).subscribe((result) => {
      this.router.navigate(['/students']);
    }, (err) => {
      console.log(err);
    });
  }
}
