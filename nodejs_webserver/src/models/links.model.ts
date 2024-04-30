import { Table, Column, DataType, Model, ForeignKey, BelongsTo, HasOne, PrimaryKey, Default, AllowNull, AutoIncrement, Unique, HasMany } from "sequelize-typescript"
import { Movie } from "@models/movie.model";


@Table({ tableName: 'links', timestamps: false })
export class Link extends Model<Link> {
  @PrimaryKey
  @ForeignKey(() => Movie)
  @Column(DataType.INTEGER)
  moviesId: number;

  @AllowNull(true)
  @Column(DataType.CHAR(50))
  imdbId: string;

  @AllowNull(true)
  @Column(DataType.CHAR(50))
  tmdbId: string;

  @BelongsTo(() => Movie)
  movie: Movie
}