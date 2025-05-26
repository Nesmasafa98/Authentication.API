import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findAll(): Promise<User[]> {
		// lean to avoid mongoose virtual fields
		// discard unwanted fields.
		const users = await this.userModel.find({}, { password: 0, hashedRefreshToken: 0, __v: 0 }).lean();

		return users.map((user) => ({
			...user,
			id: user._id.toString()
		}));
	}

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
		if (!Types.ObjectId.isValid(id)) {
			return null;
		}
		return this.userModel.findById(id).exec();
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

		// Get from env to configure time accurately.
		const expiresInMs = 1 * 24 * 60 * 60 * 1000;

		await this.userModel.findByIdAndUpdate(userId, {
			hashedRefreshToken: hashedToken,
			refreshTokenExpiresAt: new Date(Date.now() + expiresInMs)
		});
	}

	async removeRefreshToken(userId: string) {
		await this.userModel.findByIdAndUpdate(userId, {
			hashedRefreshToken: null,
			refreshTokenExpiresAt: null
		});
	}
}
