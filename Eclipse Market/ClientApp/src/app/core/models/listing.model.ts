export type ListingGetAllResponse = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  authorId: number;
  views: number;
  timesBookmarked: number;
  listingCategory: string;
  imageBase64String: string[];
}[];

export type ListingGetByIdResponse = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  authorId: number;
  views: number;
  timesBookmarked: number;
  listingCategory: string;
  imageBase64String: string[];
};

export type ListingGetByIdWithAuthorResponse = {
  id?: number;
  title: string;
  description: string;
  price: number;
  location: string;
  author: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateCreated: string;
    listings: {
      id: number;
      title: string;
      description: string;
      price: number;
      location: string;
      views: number;
      timesBookmarked: number;
      listingCategory: string;
      imageBase64String: string;
    }[];
  };
  views: number;
  timesBookmarked: number;
  listingCategory: string;
  imageBase64String: string[];
};

export type ListingGetRecommendedResponse = ListingGetAllResponse;

export type ListingAddRequest = {
  title: string;
  description: string;
  price: number;
  location: string;
  listingCategoryId: number;
  imageBase64Strings: string[];
};

export type ListingUpdateRequest = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  listingCategoryId: number;
  imageBase64String: string[];
};
