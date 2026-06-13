@echo off
rmdir /S /Q .git
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VivekhaShreeK/SnipLink---URL-Shortner-with-Analytics.git
git push -u origin main -f
