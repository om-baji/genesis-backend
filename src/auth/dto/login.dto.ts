import { IsEmail, IsString } from "class-validator";

export class LoginSchema {

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}