import { Role } from "../../users/roles/entities/role.entity";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { RoleNameEnum } from "../../users/roles/constants.enum";
import { User } from "../../users/entities/users.entity";
import { hashPassword } from "../../users/utils";

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);
    const userRepository = dataSource.getRepository(User);

    const superAdminRole = await roleRepository.findOne({
      where: { name: RoleNameEnum.SUPER_ADMIN },
    });
    const adminRole = await roleRepository.findOne({
      where: { name: RoleNameEnum.ADMIN },
    });

    const adminPassword = await hashPassword("Super123!");

    const users = [
      {
        email: "okparaifeanyi21@gmail.com",
        userName: "Ifeanyi Okpara",
        password: adminPassword,
        roles: [superAdminRole],
      },
      {
        email: "chquickmorris@gmail.com",
        userName: "Chickqui Morris",
        password: adminPassword,
        roles: [adminRole],
      },
    ];

    for (const user of users) {
      const { email } = user;
      const isUserExists = await userRepository.findOne({ where: { email } });
      if (!isUserExists) {
        await userRepository.save({ ...user });
      }
    }
    console.log("------------>Users Updated<---------------");
  }
}
