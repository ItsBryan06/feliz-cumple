#!/bin/bash

# Limpiar cache de npm y node_modules
echo "Limpiando dependencias..."
rm -rf node_modules
rm -f package-lock.json

# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
echo "📦 Reinstalando dependencias..."
npm install --legacy-peer-deps

echo "Dependencias instaladas correctamente!"
echo "Ahora puedes ejecutar: npm run dev"
