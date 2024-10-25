# Используем базовый образ с JDK
FROM openjdk:17-jdk-alpine

# Указываем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем скомпилированный WAR файл в контейнер
COPY build/libs/*.war lnm-backend.war


# Указываем команду для запуска приложения
ENTRYPOINT ["sh", "-c", "java -jar /app/lnm-backend.war"]

EXPOSE 8080
