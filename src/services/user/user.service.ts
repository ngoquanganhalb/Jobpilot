import { UpdateUserDto } from "@/dtos/user/update-user.dto";
import { BaseService } from "@services/base.service";

export class UserService extends BaseService {
  constructor() {
    super("/users");
  }
  public async editUser(data: Partial<UpdateUserDto>) {
    return this.post("/edit", data);
  }
  public async findUser(ids: number[]) {
    const idsQuery = ids.join(",");
    return this.get(`/find-user?ids=${idsQuery}`);
  }
}
export const userService = new UserService();
