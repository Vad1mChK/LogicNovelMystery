# Используем базовый образ с JDK
FROM openjdk:17-jdk-alpine

# Указываем рабочую директорию внутри контейнера
WORKDIR /app


COPY build/libs/lnm-backend-0.0.1-SNAPSHOT.war lnm-backend.war
# Указываем команду для запуска приложения
ENTRYPOINT ["sh", "-c", "java -jar /app/lnm-backend.war"]

EXPOSE 8080
