import { successMessage } from "../../common/const";
import { IPaginationMeta } from "../../common/interfaces/paginate.meta.interface";

export class SuccessReponseDto<T> {
  status: boolean;
  message: string;
  data?: T;
  meta?: IPaginationMeta;

  constructor(
    status: boolean,
    data: T,
    message = successMessage,
    meta?: IPaginationMeta
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}