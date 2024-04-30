import os
import pathlib
from functools import lru_cache
from dotenv import load_dotenv
load_dotenv()
class BaseConfig:
    BASE_DIR: pathlib.Path = pathlib.Path(__file__).parents[1]

    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL"
    )
    AWS_ACCESS_KEY: str = os.environ.get(
        "AWS_ACCESS_KEY"
    )
    AWS_SECRET_ACCESS_KEY: str = os.environ.get(
        "AWS_SECRET_ACCESS_KEY"
    )
    DATABASE_CONNECT_DICT: dict = {}


class DevelopmentConfig(BaseConfig):
    pass


class ProductionConfig(BaseConfig):
    pass


class TestingConfig(BaseConfig):
    pass


@lru_cache()
def get_settings():
    config_cls_dict = {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
        "testing": TestingConfig,
    }

    config_name = os.environ.get("FASTAPI_CONFIG", "development")
    config_cls = config_cls_dict[config_name]
    return config_cls()


settings = get_settings()