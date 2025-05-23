import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb://localhost/nest-auth'), // use env var for prod
		AuthModule
	]
})
export class AppModule {}
