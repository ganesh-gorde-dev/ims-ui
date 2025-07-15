import { Category } from './../../models/category.model';
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
import { SharedModule } from '../../../../shared/shared.module';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category-home',
  imports: [SharedModule, CategoryListComponent],
  templateUrl: './category-home.component.html',
  styleUrl: './category-home.component.css',
})
export class CategoryHomeComponent {
  @ViewChild(CategoryListComponent)
  categoryListComponent!: CategoryListComponent;

  @ViewChild('addCategoryDialog') addCategoryDialog!: TemplateRef<any>;
  @ViewChild('deleteCategoryDialog') deleteCategoryDialog!: TemplateRef<any>;

  addCategoryForm!: FormGroup;

  searchTerm: string = '';
  private searchChanged: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _apiService: ApiService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Subscribe to search changes if needed
    this.searchChanged
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((term: string) => {
        this.categoryListComponent.loadCategories(
          1,
          this.categoryListComponent.pageSize,
          term
        );
      });
  }

  onSearchChange(term: string) {
    this.searchChanged.next(term);
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
      autoFocus: false,
      restoreFocus: false,
    });

    this.addCategoryForm.reset();
    this.addCategoryForm.markAsUntouched();
  }

  onEmitEvent(event: any) {
    switch (event.action) {
      case 'edit':
        this.handleEditCategory(event.category);
        break;
      case 'delete':
        this.handleDeleteCategory(event.category);
        break;
      default:
        console.warn('Unknown event action:', event.action);
    }
  }

  dialogData: any;
  handleEditCategory(category: Category) {
    this.dialogData = { isEdit: true, category };
    // Logic to handle edit action
    this.addCategoryForm.patchValue({
      categoryCode: category.category_code,
      categoryName: category.category_name,
    });

    this._dialog.open(this.addCategoryDialog, {
      width: '600px',
      id: 'addCategoryDialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  selectedCategory: Category | null = null;

  handleDeleteCategory(category: Category) {
    // Logic to handle delete action
    this.selectedCategory = category;
    this._dialog.open(this.deleteCategoryDialog, {
      width: '400px',
      id: 'deleteCategoryDialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  async onAddCategorySave() {
    this.addCategoryForm.markAllAsTouched();
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

  async onEditCategory() {
    this.addCategoryForm.markAllAsTouched();
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

  async onDeleteCategory() {
    await this._apiService.delete(
      `category/${this.selectedCategory!.category_id}`
    );
    this._dialog.closeAll();
    this.categoryListComponent.loadCategories();
  }
}
