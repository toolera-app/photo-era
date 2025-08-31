/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IGenericErrorMessage } from "./error";

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

// for socket
export type UserData = {
  userId: string;
};

export interface IGenericResponseRedis {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: any;
}

export interface IGenericErrorResponseRedis {
  statusCode: number;
  message: string;
  errorMessages: {
    path: string;
    message: string;
  }[];
}
