import {Pipe, PipeTransform} from "@angular/core";
import {User} from "./user";


@Pipe({
  name: 'userAlias'
})
export class UserAliasPipe implements PipeTransform {
    transform(userId: number, users:  User[]) {
    let user: User;
    // @ts-ignore
    user = users.find((user) => {
      return user.id === userId
    });
    return user?.alias;
  }
}
