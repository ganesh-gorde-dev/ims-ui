import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Category, CategoryResponse } from '../../models/category.model';
import { ApiService } from '../../../../core/services/api-interface.service';

@Component({
  selector: 'app-category-list',
  imports: [MatTableModule, CommonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  displayedColumns: string[] = ['category_name', 'category_code', 'actions'];
  dataSource: Category[] = [];
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _apiService: ApiService) {
    // Initialization logic can go here
    this.loadCategories();
  }

  ngOnInit() {
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadCategories();
    });
  }

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
  }

  async loadCategories() {
    const categoryData = await this._apiService.get<CategoryResponse>(
      'category'
    );

    this.dataSource = categoryData.list;
    this.totalCount = categoryData.pagination.count;
  }

  handleAction(action: string, category: Category) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, category });
  }
}
