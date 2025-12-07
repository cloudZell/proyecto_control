# 🚀 Guía Rápida de Configuración

## ✅ Checklist Pre-GitHub

Antes de subir a GitHub, verifica:

- [ ] El archivo `.gitignore` incluye todos los archivos sensibles
- [ ] No hay credenciales hardcodeadas en el código
- [ ] Los archivos de ejemplo (`.example`) están creados
- [ ] El README.md está actualizado

## 📦 Archivos que NO se subirán a GitHub

Gracias al `.gitignore`, estos archivos están protegidos:
- ✅ `.env`
- ✅ `serviceAccountKey.json.json`
- ✅ `node_modules/`
- ✅ Archivos temporales y logs

## 🔧 Configuración Local

1. **Crea tu archivo `.env`**:
```bash
cp env.example .env
```

2. **Edita `.env`** con tus credenciales de Firebase

3. **Coloca tu `serviceAccountKey.json.json`** en la raíz del proyecto

4. **Instala dependencias**:
```bash
npm install
```

5. **Ejecuta el proyecto**:
```bash
npm start
```

## 📤 Subir a GitHub

Sigue los comandos en `.git-commands.md`:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/cloudZell/proyecto_control.git
git push -u origin main
```

## 🌐 Desplegar en Render

1. **Prepara el JSON del Service Account**:
```bash
npm run prepare-env
```
Esto te dará el valor para `FIREBASE_SERVICE_ACCOUNT_JSON`

2. **Sigue la guía completa en `DEPLOY.md`**

## 🔍 Verificación Final

Después de subir a GitHub, verifica que:
- ✅ No hay archivos sensibles en el repositorio
- ✅ Los archivos `.example` están presentes
- ✅ El README.md es claro y completo

