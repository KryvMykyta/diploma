import { Movie } from "@models/movie.model";
import { Includeable, Op } from 'sequelize'
import { Link } from "@/models/links.model";
import sequelize from "@config/sequelize";
import { Rating } from "@models/rating.model";


export class MovieDAO {
  constructor() {}

  public static getMovies = async (page: number, limit: number, search: string, user: User | null = null) => {
    const offset = (page - 1) * limit;
    let whereConfig : Record<string,any> = {}
    if (search) {
      whereConfig.title = {
        [Op.like]: `%${search}%`
      }
    }
    const includeConfig: any[] = [Link]

    if(user) {
      includeConfig.push({
        model: Rating,
        where: {
          userId: user.id
        },
        required: false
      })
    }

    const movies = await Movie.findAll({
      limit,
      offset,
      where: whereConfig,
      attributes: {
        include: [
          [sequelize.literal(`(SELECT ROUND(AVG(rating.rating), 2) FROM ratings AS rating WHERE rating.movieId = Movie.id)`), 'avgRating']
        ]
      },
      include: includeConfig,
      order: [['title', 'DESC']]
    });
    return movies
  };

  public static getTotalMovies = async (search: string) => {
    const moviesCount = await Movie.count({
      where: {
        title: {
          [Op.like]: `%${search}%`
        }
      }
    })
    return moviesCount
  }

  public static getMoviesFromIdList = async (movieIds: number[]) => {
    const movies = await Movie.findAll({
        include: [Link],
        attributes: {
          include: [
            [sequelize.literal(`(SELECT ROUND(AVG(rating.rating), 2) FROM ratings AS rating WHERE rating.movieId = Movie.id)`), 'avgRating']
          ]
        },
        where: {
          id: {
            [Op.in]: movieIds
          }
        },
    });
    return movies
  };
}