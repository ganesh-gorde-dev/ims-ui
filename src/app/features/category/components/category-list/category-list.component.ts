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
import {
  Category,
  CategoryQueryParams,
  CategoryResponse,
} from '../../models/category.model';
import { ApiService } from '../../../../core/services/api-interface.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-category-list',
  imports: [SharedModule],
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
    pageSize: number = this.pageSize,
    params?: { category_name: string; category_code: string } | null
  ) {
    const queryParams: CategoryQueryParams = {
      ispagination: true,
      page: pageNumber,
      pagesize: pageSize,
    };

    if (params) {
      // Filter out null key value from params
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== null)
      );
      Object.assign(queryParams, filteredParams);
    }

    const categoryData = await this._apiService.get<CategoryResponse>(
      'category',
      queryParams
    );

    this.dataSource = new MatTableDataSource<Category>(categoryData.list);
    this.totalCount = categoryData.pagination.count;
  }

  handleAction(action: string, category: Category) {
    // Logic to handle edit action
    this.emitEvent.emit({ action: action, category });
  }
}
