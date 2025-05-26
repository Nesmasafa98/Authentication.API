import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
	readonly _id: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: false })
	hashedRefreshToken?: string;

	// To auto-remove the field/document after this date
	@Prop({
		type: Date,
		index: { expires: 0 }
	})
	refreshTokenExpiresAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
