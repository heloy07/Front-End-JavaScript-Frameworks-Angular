import { Component, OnInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-dishdetail',
    templateUrl: './dishdetail.component.html',
    styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
    @ViewChild('fform') commentFormDirective;
    dish: Dish;
    dishIds: string[];
    next: string;
    prev: string;

    commentForm: FormGroup;
    comment: Comment = {
        rating: 5,
        comment: '',
        author: '',
        date: '',
    };

    formErrors = {
        'author': '',
        'comment': ''
    };
    validationMessages = {
        'author': {
            'required': 'Author\'s name is required.',
            'minlength': 'Author\'s name must be at least 2 characters long.',
            'maxlength': 'Author\'s name cannot be more than 25 characters long.'
        },
        'comment': {
            'required': 'comment is required.',
            'minlength': 'comment must be at least 2 characters long.',
            'maxlength': 'comment cannot be more than 300 characters long.'
        }

    };
    

    constructor(private dishService: DishService,
        private route: ActivatedRoute,
        private location: Location,
        private fb: FormBuilder) {
        this.createForm();
    }
    createForm() {
        this.commentForm = this.fb.group({
            author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
            comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
            rating : [ 5 ,Validators.required ]

        });
        this.commentForm.valueChanges
            .subscribe(data => this.onValueChanged(data));

    }
    onValueChanged(data?: any) {
        if (!this.commentForm) { return; }
        const form = this.commentForm;
        for (const field in this.formErrors) {
          if (this.formErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
              const messages = this.validationMessages[field];
              for (const key in control.errors) {
                if (control.errors.hasOwnProperty(key)) {
                  this.formErrors[field] += messages[key] + ' ';
                }
              }
            }
          }
        }
      }

    ngOnInit() {
        this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
        this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
            .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }
    goBack(): void {
        this.location.back();
    }
    setPrevNext(dishId: string) {
        const index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
    onSubmit() {
        this.comment = this.commentForm.value;
        this.comment.date = new Date().toISOString();
        this.dish.comments.push(this.comment);
        this.commentForm.reset();
        this.commentFormDirective.resetForm({rating:5});
        
    }




}
