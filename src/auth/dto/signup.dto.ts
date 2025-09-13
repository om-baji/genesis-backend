import { IsEmail, IsString } from "class-validator";

export class SignupSchema {

    @IsString()
    name : string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}