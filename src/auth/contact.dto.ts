import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ContactDto {
  @IsNotEmpty({ message: 'o nome não pode estar vazio' })
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: 'o email não pode estar vazio' })
  @IsString()
  @MaxLength(100)
  email: string;

  @IsNotEmpty({ message: 'a mensagem não pode estar vazia' })
  @IsString()
  @MaxLength(5000)
  message: string;
}
