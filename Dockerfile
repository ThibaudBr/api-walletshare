FROM node:18
COPY . .
RUN npm install


EXPOSE 8081
ENV NODE_ENV=dev \
    PORT=8081 \
    TYPEORM_HOST_DEV=localhost \
    TYPEORM_USERNAME_DEV=username \
    TYPEORM_PASSWORD_DEV=password \
    TYPEORM_DATABASE_DEV=postgres \
    TYPEORM_PORT=5432 \
    TYPEORM_SYNCHRONIZE_DEV=true \
    TYPEORM_LOGGING_DEV=true \
    TYPEORM_ENTITIES='src/api/**/domain/entities/*.entity.ts' \

CMD ["npm", "start"]
