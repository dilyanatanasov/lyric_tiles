import {CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from "./Generic";

export type UserId = string;
export type UserUsername = string;
export type UserPassword = string;
export type UserFirstName = string;
export type UserLastName = string;
export type UserAuthData = string;

export type User = {
    _id: UserId,
    username?: UserUsername;
    password?: UserPassword;
    firstName?: UserFirstName;
    lastName?: UserLastName;
    authData?: UserAuthData;
    createdBy: CreatedBy,
    createdAt: CreatedAt,
    updatedBy?: UpdatedBy,
    updatedAt?: UpdatedAt
}
