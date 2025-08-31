export type IPerImageCreditFilterRequest = {
  searchTerm?: string | undefined;
};

export type IPerImageCreditCreateRequest = {
  creditCharged?: number; // optional; defaults to 0 in model
};
export type ICategoryRequest = {
  eventCategoryName: string;
};

export type ICategoryEditRequest = {
  eventCategoryName?: string;
};
