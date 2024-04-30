import boto3
from config import settings

client = boto3.client('s3',
    aws_access_key_id=settings.AWS_ACCESS_KEY,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
s3 = boto3.resource('s3',
    aws_access_key_id=settings.AWS_ACCESS_KEY,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
bucket = s3.Bucket('diplomaneuralbucket')