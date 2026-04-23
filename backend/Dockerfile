FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -q -DskipTests package

FROM tomcat:11.0-jdk17-temurin

COPY --from=build /app/target/hypeculture.war /usr/local/tomcat/webapps/hypeculture.war

EXPOSE 8080
