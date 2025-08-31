export type IOrderFilterRequest = {
  searchTerm?: string | undefined;
};

export type IOrderCreateRequest = {
  paymentNumber: string;
  amount: number;
  transactionId: string;
  reference?: string;
};
export type ICategoryRequest = {
  eventCategoryName: string;
};

export type ICategoryEditRequest = {
  eventCategoryName?: string;
};
