export interface IUser {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	avatar: string;

	createdAt: Date;
	updatedAt: Date;
}
