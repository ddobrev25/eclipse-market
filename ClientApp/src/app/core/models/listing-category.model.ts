export type ListingCategoryGetAllResponse = {
  id: number;
  title: string;
}[];

export type ListingCategoryGetByIdResponse = {
  id: number;
  title: string;
};

export type ListingCategoryAddRequest = {
  title: string;
};
export type ListingCategoryUpdateRequest = {
  id: number;
  title: string;
};
