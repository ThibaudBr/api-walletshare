FROM node:18
COPY . .
RUN npm install


EXPOSE 8081
ENV NODE_ENV=development \
    SECRET=tressecret \
    PORT=8081 \
    ALLOW_ORIGIN=localhost:4200 \
    JWT_ACCESS_TOKEN_SECRET=trestressecret \
    JWT_ACCESS_TOKEN_EXPIRATION_TIME=3000000 \
    JWT_REFRESH_TOKEN_EXPIRATION_TIME=3000000 \
    JWT_SECRET=sczcret \
    JWT_REFRESH_TOKEN_SECRET=secret \
    TYPEORM_CONNECTION=postgres \
    TYPEORM_HOST=localhost \
    TYPEORM_USERNAME=username \
    TYPEORM_PASSWORD=password \
    TYPEORM_DATABASE=postgres \
    TYPEORM_PORT=5432 \
    TYPEORM_SYNCHRONIZE=true \
    TYPEORM_LOGGING=true \
    TYPEORM_ENTITIES='src/api/**/domain/entities/*.entity.ts' \
    MAIL_HOST=server.stmp.fr \
    MAIL_USER=example@email.fr \
    MAIL_PASSWORD=password \
    MAIL_FROM=example@email.fr \
    LEVENSHTEIN_SCORE_THRESHOLD=1 \
    LEVENSHTEIN_SCORE_THRESHOLD_POST=50 \
    LEVENSHTEIN_SCORE_THRESHOLD_GROUP=5

CMD ["npm", "start"]
