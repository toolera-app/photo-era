FROM node:20.11.1-alpine3.19

# set the working directory
WORKDIR /app

# copy dependencies file
COPY package.json ./


# COPY ENV variable
# COPY .env ./
# Install dependencies within the container
RUN yarn install --frozen-lockfile

# COPY tsconfig.json file
# COPY tsconfig.json ./

# Install dependencies
# RUN yarn install

# Copy everything 
COPY . .

EXPOSE 9000


RUN yarn build

# run the project
# CMD ["yarn", "start"]

# Run the server
CMD ["node", "dist/server.js"]