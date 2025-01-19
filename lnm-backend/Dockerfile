# Используем базовый образ с JDK
FROM azul/zulu-openjdk:17-latest
VOLUME /tmp
COPY build/libs/*.jar app.jar
# Указываем команду для запуска приложения
#ENTRYPOINT ["sh", "-c", "java -jar /app.jar"]
ENTRYPOINT ["java","-jar","/app.jar"]

EXPOSE 8080
