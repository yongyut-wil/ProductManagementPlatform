import { Entity } from '../../../shared/core/entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  email: string;
  password?: string;
  name?: string | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  static create(props: UserProps, id?: string): User {
    // Add validation logic here if needed (e.g. email regex)
    return new User(props, id);
  }

  get email(): string { return this.props.email; }
  get password(): string | undefined { return this.props.password; }
  get role(): UserRole { return this.props.role; }
  get name(): string | null | undefined { return this.props.name; }
}
