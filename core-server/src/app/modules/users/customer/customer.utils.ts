/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUpdateProfileReqAndResponse } from "./customer.interface";

type UpdateValueType = string | number | boolean;

type UpdateDataObject = {
  [dataName: string]: UpdateValueType | undefined | null;
};

export const updateMyProfileDataValue = (updates: UpdateDataObject): Partial<IUpdateProfileReqAndResponse> => {
  const filteredUpdates: Partial<IUpdateProfileReqAndResponse> = Object.entries(updates)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "") // Updated filter condition
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return filteredUpdates;
};
