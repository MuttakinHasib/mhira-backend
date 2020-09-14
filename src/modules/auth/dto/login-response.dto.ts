import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/modules/user/models/user.model';

@ObjectType()
export class LoginResponseDto extends User {
  @Field()
  accessToken: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  guard?: string;
}
