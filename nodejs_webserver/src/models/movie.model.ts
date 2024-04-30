import { Table, Column, DataType, Model, ForeignKey, BelongsTo, HasOne, PrimaryKey, Default, AllowNull, AutoIncrement, Unique, HasMany } from "sequelize-typescript"
import { Rating } from "@models/rating.model";
import { Link } from "@models/links.model";


@Table({ tableName: 'movies', timestamps: false })
export class Movie extends Model<Movie> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  genres: string;

  @HasMany(() => Rating)
  ratings: Rating[]

  @HasOne(() => Link)
  link: Link
}