#!/usr/bin/env bash
export AWS_PROFILE=personal 
aws s3 sync ./js s3://personal-apps/js
aws s3 sync ./css s3://personal-apps/css
aws s3 sync ./images s3://personal-apps/images
aws s3 sync ./fonts s3://personal-apps/fonts
# Need to exlude everything. Then add all html. The exclude all files in directory below. Stupid aws cli.
aws s3 sync . s3://personal-apps/ --exclude "*" --include "*.html" --exclude "*/*"

# Now push pwa dist folder
aws s3 sync ./personal-pwa/dist s3://personal-apps/personal-pwa

