// Student/Teacher QR Generator Firebase Realtime Database Integration
// Script para crear sesiones QR y monitorear asistencia en tiempo real
//
// IMPORTANTE: Reemplaza las credenciales con las de tu proyecto Firebase
// O mejor aún, configura estas variables desde el servidor usando variables de entorno

const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_AUTH_DOMAIN_AQUI",
    databaseURL: "https://TU_PROJECT-default-rtdb.firebaseio.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase si no está inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const database = firebase.database();

// ... resto del código ...

