import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CategoryListComponent } from '../category-list/category-list.component';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../../../core/services/api-interface.service';
import { CategoryPayload } from '../../models/category.model';

@Component({
  selector: 'app-category-home',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    CategoryListComponent,
  ],
  templateUrl: './category-home.component.html',
  styleUrl: './category-home.component.css',
})
export class CategoryHomeComponent {
  @ViewChild(CategoryListComponent)
  categoryListComponent!: CategoryListComponent;

  @ViewChild('addCategoryDialog') addCategoryDialog!: TemplateRef<any>;

  addCategoryForm!: FormGroup;

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _apiService: ApiService
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.addCategoryForm = this._fb.group({
      categoryCode: ['', Validators.required],
      categoryName: ['', Validators.required],
    });
  }

  onAddCategory() {
    const dialogRef = this._dialog.open(this.addCategoryDialog, {
      width: '600px',
      id: 'addCategoryDialog',
    });

    this.addCategoryForm.reset();
    this.addCategoryForm.markAsUntouched();

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        if (this.addCategoryForm.valid) {
          const formValues = this.addCategoryForm.value;

          const CategoryPayload: CategoryPayload = {
            category_code: formValues.categoryCode,
            category_name: formValues.categoryName,
          };

          // Update existing tenant
          await this._apiService.post(`category`, CategoryPayload);
          this.addCategoryForm.reset();
          this._dialog.closeAll();
          this.categoryListComponent.loadCategories();
        }
      }
    });
  }

  onEmitEvent(event: any) {}
}
