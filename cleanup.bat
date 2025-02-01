@echo off
cd /d "c:\Users\bstit\CascadeProjects\eco-fashion-store"

REM Supprimer les vidéos
del "7568000-hd_1920_1080_25fps.mp4"
del "7653877-uhd_4096_2160_25fps.mp4"

REM Supprimer les images inutiles
del "Accessoires.jpg"
del "Edition limitee.jpg"
del "Printemps.jpg"
del "logo.png"

REM Supprimer les fichiers de déploiement
del ".htaccess"
del "Procfile"
del "netlify.toml"
del "eco-fashion-site.zip"

REM Supprimer les dossiers inutiles
rmdir /s /q "node_modules"
rmdir /s /q "uploads"
rmdir /s /q "public"
rmdir /s /q "scripts"
rmdir /s /q "img"

echo Nettoyage terminé !
