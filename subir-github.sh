#!/bin/bash

# Script para subir el proyecto a GitHub
# Ejecuta este archivo desde la carpeta del proyecto

echo "========================================"
echo "Subiendo Proyecto a GitHub"
echo "========================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "ERROR: No se encuentra package.json"
    echo "Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

echo "[1/7] Inicializando repositorio Git..."
git init

echo ""
echo "[2/7] Verificando archivos a subir..."
git status

echo ""
echo "========================================"
echo "IMPORTANTE: Verifica que NO aparezcan:"
echo "- serviceAccountKey.json.json"
echo "- .env"
echo "========================================"
echo ""
read -p "Presiona Enter para continuar..."

echo ""
echo "[3/7] Agregando todos los archivos (excepto los en .gitignore)..."
git add .

echo ""
echo "[4/7] Verificando archivos agregados..."
git status

echo ""
echo "========================================"
echo "Revisa la lista anterior"
echo "Si ves archivos sensibles, presiona Ctrl+C para cancelar"
echo "========================================"
echo ""
read -p "Presiona Enter para continuar..."

echo ""
echo "[5/7] Creando commit inicial..."
git commit -m "Initial commit: Sistema de control de asistencia con QR"

echo ""
echo "[6/7] Configurando rama main..."
git branch -M main

echo ""
echo "[7/7] Agregando repositorio remoto..."
git remote add origin https://github.com/cloudZell/proyecto_control.git

echo ""
echo "========================================"
echo "Subiendo a GitHub..."
echo "========================================"
echo ""
git push -u origin main

echo ""
echo "========================================"
echo "¡Proceso completado!"
echo "========================================"
echo ""
echo "Verifica en GitHub que:"
echo "- No hay archivos sensibles en el repositorio"
echo "- Los archivos .example están presentes"
echo "- El README.md está actualizado"
echo ""

