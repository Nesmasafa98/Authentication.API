/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async create(email: string, name: string, password: string): Promise<User> {
		const hashedPassword = await bcrypt.hash(password, 10);
		const createdUser = new this.userModel({ email, name, password: hashedPassword });
		try {
			return createdUser.save();
		} catch (error) {
			if (error?.code === 11000) {
				throw new ConflictException('Email already exists');
			}
			throw error;
		}
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.userModel.findOne({ email }).exec();
	}

	async findById(id: string): Promise<User | null> {
		return this.userModel.findOne({ id }).exec();
	}

	async validateUser(username: string, password: string): Promise<User | null> {
		const user = await this.findByEmail(username);
		if (user && (await bcrypt.compare(password, user.password))) {
			return user;
		}
		return null;
	}

	async updateRefreshToken(userId: string, refreshToken: string) {
		const hashedToken = await bcrypt.hash(refreshToken, 10);
		await this.userModel.findByIdAndUpdate(userId, {
			hashedRefreshToken: hashedToken
		});
	}

	async removeRefreshToken(userId: string) {
		await this.userModel.findByIdAndUpdate(userId, {
			hashedRefreshToken: null
		});
	}
}
