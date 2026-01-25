@echo off
REM Exemple de script Windows pour lancer le backend Spring Boot avec JWT_SECRET
REM Personnalisez la ligne ci-dessous avec votre secret local
set "JWT_SECRET=VOTRE_SECRET_ICI"
mvn spring-boot:run
