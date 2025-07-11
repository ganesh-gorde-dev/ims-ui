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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
  dataSource = new MatTableDataSource<Category>();
  totalCount: number = 0;
  pageSize: number = 10;
  pageChangeSubscription: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _apiService: ApiService) {
    // Initialization logic can go here
    this.loadCategories();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Any additional initialization logic can go here
    // Pagination setup can be done here if needed
    this.dataSource.paginator = this.paginator;
    this.pageChangeSubscription = this.paginator?.page.subscribe(pageEvent => {
      this.pageSize = pageEvent.pageSize;
      this.loadCategories(pageEvent.pageIndex + 1, pageEvent.pageSize);
    });
  }

  async loadCategories(
    pageNumber: number = 1,
    pageSize: number = this.pageSize
  ) {
    const categoryData = await this._apiService.get<CategoryResponse>(
      'category',
      { ispagination: true, page: pageNumber, pagesize: pageSize }
    );

    this.dataSource = new MatTableDataSource<Category>(categoryData.list);
    this.totalCount = categoryData.pagination.count;
  }

  handleAction(action: string, category: Category) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, category });
  }
}
