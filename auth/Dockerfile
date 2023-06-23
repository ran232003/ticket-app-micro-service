#use exsiting docker image as base 

FROM node:14-alpine
# Step 2: specify root directory

WORKDIR /app 

# Step 2: copy package.json
COPY ./package.json ./
# Step 2: Download and install dependency
RUN npm install --omit=dev
# Step 2: copy all other diles
COPY ./ ./
# Step 3: Tell the image what to do when it starts as container

CMD ["npm","start"]

#19ab24557c544c63be16f83c7ee68759c428c8fc7a920d978dfc9bfc014b4d5d