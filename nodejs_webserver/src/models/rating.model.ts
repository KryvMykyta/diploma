import { Table, Column, DataType, Model, ForeignKey, BelongsTo, HasOne, PrimaryKey, Default, AllowNull, AutoIncrement, Index } from "sequelize-typescript"
import { User } from "@models/user.model"
import { Movie } from "@models/movie.model"

@Table({tableName: "ratings", timestamps: false})
export class Rating extends Model<Rating> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: string
    
    @AllowNull(false)
    @ForeignKey(() => Movie)
    @Index('movie-rating')
    @Column(DataType.INTEGER)
    movieId: string

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId: string

    @AllowNull(false)
    @Column(DataType.FLOAT)
    rating: number

    @BelongsTo(() => Movie, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    movie: Movie

    @BelongsTo(() => User, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    user: User
}