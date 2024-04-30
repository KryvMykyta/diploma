import sequelize from "@/config/sequelize";
import { Link } from "@/models/links.model";
import { Movie } from "@/models/movie.model";
import { Rating } from "@models/rating.model";

export class RatingDAO {
  constructor() {}

  public static getAllRatings = async () => {
    const ratings = await Rating.findAll();
    return ratings
  };

  public static getRatingById = async (id: string) => {
    const rating = await Rating.findByPk(id)
    return rating
  };

  public static getUserMovieRating = async (userId: string, movieId: string) => {
    const rating = await Rating.findOne({
      where: {
        userId,
        movieId
      }
    })
    return rating
  };

  public static getUserRatings = async (userId: string, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const rating = await Rating.findAndCountAll({
      where: {
        userId
      },
      include: [
        {
          model: Movie,
          include: [Link],
          attributes: {
            include: [
              [sequelize.literal(`(SELECT ROUND(AVG(rating.rating), 2) FROM ratings AS rating WHERE rating.movieId = Rating.movieId)`), 'avgRating']
            ]
          },
        }
      ],
      limit,
      offset
    })
    return rating
  };

  public static createRating = async (data: Partial<Rating>) => {
    const rating = await Rating.create(data)
    return rating
  };

  public static deleteRating = async (id: string) => {
    await Rating.destroy({
      where: {
        id
      }
    })
    return true
  };

  public static updateRating = async (id: string, updateData: Partial<Rating>) => {
    const updatedRating = await Rating.update(updateData, {
      where: {
        id: id,
      },
      returning: true
    })
    return updatedRating
  };
}