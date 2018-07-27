
Pushing assets to s3 bucket.
```
export AWS_PROFILE=personal 
aws s3 cp ./*.html ./css/* ./js/* ./images/* ./fonts/**/*  s3://personal-apps --recursive
```

Must make sure it follows the same  folder structure as html served.