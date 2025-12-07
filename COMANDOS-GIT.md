# 📤 Comandos para Subir a GitHub

## ⚠️ IMPORTANTE: Antes de Ejecutar

1. **Verifica que Git esté instalado**:
   ```bash
   git --version
   ```

2. **Verifica que NO tengas archivos sensibles**:
   - `serviceAccountKey.json.json` NO debe estar en el repositorio
   - `.env` NO debe estar en el repositorio

## 🚀 Opción 1: Usar el Script Automático

### Windows:
```bash
subir-github.bat
```

### Linux/Mac:
```bash
chmod +x subir-github.sh
./subir-github.sh
```

## 🚀 Opción 2: Comandos Manuales

Ejecuta estos comandos **uno por uno** en tu terminal:

```bash
# 1. Inicializar repositorio (si no está inicializado)
git init

# 2. Verificar qué archivos se van a subir
git status

# ⚠️ IMPORTANTE: Verifica que NO aparezcan:
# - serviceAccountKey.json.json
# - .env
# Si aparecen, NO continúes. Revisa el .gitignore

# 3. Agregar todos los archivos (excepto los en .gitignore)
git add .

# 4. Verificar nuevamente qué se va a subir
git status

# 5. Crear el commit inicial
git commit -m "Initial commit: Sistema de control de asistencia con QR"

# 6. Configurar la rama main
git branch -M main

# 7. Agregar el repositorio remoto
git remote add origin https://github.com/cloudZell/proyecto_control.git

# 8. Subir a GitHub
git push -u origin main
```

## ✅ Verificación Post-Subida

Después de subir, verifica en GitHub:

1. Ve a: https://github.com/cloudZell/proyecto_control
2. Verifica que:
   - ✅ NO aparece `serviceAccountKey.json.json`
   - ✅ NO aparece `.env`
   - ✅ Aparecen los archivos `.example`
   - ✅ El `README.md` está actualizado
   - ✅ El `.gitignore` está presente

## 🔧 Si Git no está instalado

### Windows:
1. Descarga Git desde: https://git-scm.com/download/win
2. Instala con las opciones por defecto
3. Reinicia tu terminal

### Linux:
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # CentOS/RHEL
```

### Mac:
```bash
brew install git
```

## 🚨 Si accidentalmente subiste credenciales

Si subiste archivos sensibles por error:

1. **Elimina el archivo del historial**:
```bash
git rm --cached serviceAccountKey.json.json
git commit -m "Remove sensitive file"
git push origin main
```

2. **Rotar las credenciales en Firebase**:
   - Ve a Firebase Console
   - Genera nuevas credenciales
   - Elimina las antiguas

3. **Verifica el .gitignore**:
   Asegúrate de que incluya:
   ```
   serviceAccountKey.json.json
   .env
   ```

## 📝 Notas

- El README.md ya existe (no necesitas el comando `echo`)
- Usa `git add .` para agregar todos los archivos (no solo README.md)
- El `.gitignore` protegerá automáticamente los archivos sensibles

