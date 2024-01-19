export enum HttpMethods {
    GET = 200,
    POST = 201,
    PUT = 200,
    PATCH = 200,
    DELETE = 204
  }
  
  export const enum HttpStatusCodes {
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    MethodNotAllowed = 405,
    UnprocessableEntity = 422,
  }
  
  export class HttpError extends Error {
    constructor(message: string, private __httpStatusCode: number) {
      super(message);
    }
  
    HttpStatusCode() {
      return this.__httpStatusCode;
    }
  }
  
  export function HttpNotFound(msg = "not found") {
    return new HttpError(msg, HttpStatusCodes.NotFound);
  }
  
  export function HttpBadRequest(msg = "bad input") {
    return new HttpError(msg, HttpStatusCodes.BadRequest);
  }
  
  export function HttpUnprocessableEntity(msg = "unprocessable entity") {
    return new HttpError(msg, HttpStatusCodes.UnprocessableEntity);
  }
  
  export const HttpParamValidators = {
    MustBeString(obj: any, key: string, min = 1, max = 512) {
      const v = obj[key];
      if (typeof v !== "string") {
        throw HttpUnprocessableEntity(`${key} must be string`);
      }
      if (v.length < min) {
        throw HttpUnprocessableEntity(`${key} must be at least ${min} characters`);
      }
      if (v.length > max) {
        throw HttpUnprocessableEntity(`${key} must be shorter than ${max} characters`);
      }
      return v;
    },
    MustBeOneOf<T>(obj: any, key: string, values: T[] = []): T {
      const value = obj[key];
      for (const v of values) {
        if (v === value) {
          return v;
        }
      }
      throw HttpUnprocessableEntity(`${key} must be one of ${values.join(",")}`);
    },
  };