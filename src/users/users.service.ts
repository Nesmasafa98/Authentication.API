/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async create(username: string, password: string): Promise<User> {
		const hashedPassword = await bcrypt.hash(password, 10);
		const createdUser = new this.userModel({ email: username, password: hashedPassword });
		return createdUser.save();
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.userModel.findOne({ email: email }).exec();
	}

	async validateUser(username: string, password: string): Promise<User | null> {
		const user = await this.findByEmail(username);
		if (user && (await bcrypt.compare(password, user.password))) {
			return user;
		}
		return null;
	}
}
