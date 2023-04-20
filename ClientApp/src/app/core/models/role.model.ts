export type RoleGetByIdResponse = {
  id: number;
  name: string;
  claims: string[];
}
export type RoleGetAllResponse = {
  id: number;
  name: string;
  claims: string[];
}[];

export type RoleAddRequest = {
  id: number;
  name: string;
  claims: string[];
};

export type RoleUpdateRequest = {
  currentId: number;
  name: string;
  claims: string[];
};
