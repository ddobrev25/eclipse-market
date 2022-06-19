export interface IRoleResponse {
    id: number,
    name: string,
    claims: string[]
}
export type IRole = IRoleResponse;
export type IRoles = IRoleResponse[];