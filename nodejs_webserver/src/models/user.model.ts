import { Table, Column, DataType, Model, ForeignKey, BelongsTo, HasOne, PrimaryKey, Default, AllowNull, AutoIncrement, Unique, HasMany } from "sequelize-typescript"
import { Rating } from "@models/rating.model";


@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  username: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @HasMany(() => Rating)
  ratings: Rating[]
}