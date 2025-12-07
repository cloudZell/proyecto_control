#!/usr/bin/env node

/**
 * Script para preparar las variables de entorno para Render
 * Convierte el archivo serviceAccountKey.json.json a formato de una sola línea
 */

const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ No se encontró el archivo serviceAccountKey.json.json');
  console.log('💡 Asegúrate de tener el archivo en la raíz del proyecto');
  process.exit(1);
}

try {
  // Leer el archivo JSON
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  // Convertir a una sola línea
  const oneLine = JSON.stringify(serviceAccount);
  
  console.log('✅ JSON convertido a una sola línea:');
  console.log('\n📋 Copia este valor para FIREBASE_SERVICE_ACCOUNT_JSON en Render:\n');
  console.log(oneLine);
  console.log('\n💡 Nota: Este valor ya está listo para pegar en Render');
  
  // Guardar en un archivo temporal (no se sube a git)
  const outputPath = path.join(__dirname, '../.env.render');
  fs.writeFileSync(outputPath, `FIREBASE_SERVICE_ACCOUNT_JSON=${oneLine}\n`, 'utf8');
  console.log(`\n✅ También se guardó en: ${outputPath}`);
  console.log('⚠️  Este archivo está en .gitignore, no se subirá a Git');
  
} catch (error) {
  console.error('❌ Error procesando el archivo:', error.message);
  process.exit(1);
}

