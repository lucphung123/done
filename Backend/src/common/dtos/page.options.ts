export class PageOptionsDto {
    page: number;
    limit: number;
  
    constructor(page?: number, limit?: number) {
      this.page = page ? page : +1;
      this.limit = limit ? (limit > +20 ? +20 : limit) : +10;
    }
    
  }