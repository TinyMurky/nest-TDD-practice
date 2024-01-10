import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeeController } from './employee/employee.controller';

@Module({
  imports: [EmployeesModule, PrismaModule],
  controllers: [AppController, EmployeeController],
  providers: [AppService],
})
export class AppModule {}
