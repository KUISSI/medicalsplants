# Multi-stage Dockerfile for Spring Boot backend
# Build with Maven and run with a slim JRE

FROM maven:3.9.4-amazoncorretto-17 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -e -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
