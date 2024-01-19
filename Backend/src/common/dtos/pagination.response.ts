import { IPaginationMeta } from "common/interfaces/paginate.meta.interface";

export class PaginationResponseDto<T> {
  meta: {
    page_number: number;
    page_size: number;
    total_pages: number;
    total: number;
    previous_page: boolean;
    next_page: boolean;
  };
  data: T[];

  constructor(data: T[], meta: IPaginationMeta) {
    this.data = data;
    this.meta = meta;
  }
}