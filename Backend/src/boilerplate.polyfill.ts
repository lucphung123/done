import { PaginationResponseDto } from "./common/dtos/pagination.response";
import { FromMongoData } from "./database/mongo";
import { Collection } from "mongodb";

export const PageErrors = {
  PageLimit: new Error(`page must be less than equal to total pages `),
};

Collection.prototype["paginate"] = async function <T>(
  page_number: number = 1,
  page_size: number = 10,
  options?: any[]
): Promise<PaginationResponseDto<T>> {
  const query: any[] = [
    { $skip: (page_number - 1) * page_size },
    { $limit: page_size },
  ];

  const countConditions = [{ $count: "count" }];
  if (options && Array.isArray(options)) {
    query.unshift(...options);
    countConditions.unshift(...options);
  }

  const data = await this.aggregate(query).toArray();
  const checkCount = await this.aggregate(countConditions).toArray();

  const count = !Array.isArray(checkCount)
    ? +0
    : checkCount.length === +0
    ? +0
    : checkCount[0].count;

  const total_pages = count === +0 ? +1 : Math.ceil(count / page_size);

  if (page_number > total_pages) throw PageErrors.PageLimit;
  const paginate: PaginationResponseDto<T> = {
    data: FromMongoData.Many(data) as T[],
    meta: {
      page_number,
      page_size,
      total_pages,
      total: count,
      previous_page: page_number > +1,
      next_page: page_number < total_pages,
    },
  };

  return paginate;
};