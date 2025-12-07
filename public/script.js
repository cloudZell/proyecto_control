// Client logic to read Realtime Database (ES module)
import { db } from './firebase-config.js';
import { ref, onValue, get, child, set, push, update, remove } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

// ========== LECTURA DE DATOS ==========

// Utility: read and return a snapshot once
export async function readOnce(path) {
  const dbRef = ref(db, path);
  const snap = await get(dbRef);
  return snap.exists() ? snap.val() : null;
}

// Live listener for a node
export function listen(path, callback) {
  const dbRef = ref(db, path);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
  return unsubscribe; // Retornar función para desuscribirse
}

// ========== ESCRITURA DE DATOS ==========

// Crear/escribir datos en un path específico
export async function writeData(path, data) {
  try {
    await set(ref(db, path), data);
    console.log(`✅ Data written to ${path}`);
    return data;
  } catch (error) {
    console.error(`❌ Error writing to ${path}:`, error);
    throw error;
  }
}

// Agregar datos con clave autogenerada (push)
export async function pushData(path, data) {
  try {
    const newRef = push(ref(db, path));
    await set(newRef, data);
    console.log(`✅ Data pushed to ${path} with id: ${newRef.key}`);
    return { id: newRef.key, ...data };
  } catch (error) {
    console.error(`❌ Error pushing to ${path}:`, error);
    throw error;
  }
}

// Actualizar datos (merge)
export async function updateData(path, data) {
  try {
    await update(ref(db, path), data);
    console.log(`✅ Data updated at ${path}`);
    return data;
  } catch (error) {
    console.error(`❌ Error updating ${path}:`, error);
    throw error;
  }
}

// Eliminar datos
export async function deleteData(path) {
  try {
    await remove(ref(db, path));
    console.log(`✅ Data deleted at ${path}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting ${path}:`, error);
    throw error;
  }
}

// ========== FUNCIONES ESPECÍFICAS PARA ESTUDIANTES ==========

export async function loadStudentsOnce() {
  const data = await readOnce('students');
  console.log('Students (once):', data);
  renderStudents(data);
  return data;
}

export function watchStudents(callback) {
  return listen('students', (data) => {
    console.log('Students (live):', data);
    if (callback) callback(data);
    renderStudents(data);
  });
}

// Crear estudiante
export async function createStudentInDB({ name, email, studentId, phone }) {
  const studentData = {
    name,
    email,
    studentId,
    phone,
    createdAt: new Date().toISOString()
  };
  return await pushData('students', studentData);
}

// ========== FUNCIONES ESPECÍFICAS PARA CURSOS ==========

export async function loadCoursesOnce() {
  const data = await readOnce('courses');
  console.log('Courses:', data);
  renderCourses(data);
  return data;
}

export function watchCourses(callback) {
  return listen('courses', (data) => {
    console.log('Courses (live):', data);
    if (callback) callback(data);
    renderCourses(data);
  });
}

// Crear curso
export async function createCourseInDB({ name, code, description, schedule, teacher }) {
  const courseData = {
    name,
    code,
    description,
    schedule,
    teacher,
    createdAt: new Date().toISOString()
  };
  return await pushData('courses', courseData);
}

// ========== FUNCIONES ESPECÍFICAS PARA ASISTENCIA ==========

export async function loadAttendanceOnce() {
  const data = await readOnce('attendance');
  console.log('Attendance:', data);
  renderAttendance(data);
  return data;
}

export function watchAttendance(callback) {
  return listen('attendance', (data) => {
    console.log('Attendance (live):', data);
    if (callback) callback(data);
    renderAttendance(data);
  });
}

// Registrar asistencia
export async function recordAttendance({ studentId, courseId, studentName, studentDni }) {
  const attendanceData = {
    studentId,
    courseId,
    studentName,
    studentDni,
    timestamp: new Date().toISOString()
  };
  return await pushData('attendance', attendanceData);
}

// ========== FUNCIONES ESPECÍFICAS PARA SESIONES ==========

export async function loadSessionsOnce() {
  const data = await readOnce('sessions');
  console.log('Sessions:', data);
  return data;
}

export function watchSessions(callback) {
  return listen('sessions', (data) => {
    console.log('Sessions (live):', data);
    if (callback) callback(data);
  });
}

// Crear sesión QR
export async function createSessionInDB({ courseId, teacherName, duration = 60 }) {
  const sessionData = {
    courseId,
    teacherName,
    duration,
    createdAt: new Date().toISOString(),
    isActive: true,
    attendees: {}
  };
  return await pushData('sessions', sessionData);
}

// Cerrar sesión
export async function closeSessionInDB(sessionId) {
  return await updateData(`sessions/${sessionId}`, { isActive: false, closedAt: new Date().toISOString() });
}

// Agregar asistencia a sesión
export async function addAttendeeToSession(sessionId, studentId, studentName) {
  const attendeeData = {
    studentId,
    studentName,
    timestamp: new Date().toISOString()
  };
  return await writeData(`sessions/${sessionId}/attendees/${studentId}`, attendeeData);
}

// ========== FUNCIONES DE RENDERIZADO EN DOM ==========

function renderStudents(studentsObj) {
  const container = document.getElementById('students-list');
  if (!container) return;
  container.innerHTML = '';
  if (!studentsObj) return (container.innerHTML = '<p>No students found</p>');
  
  Object.entries(studentsObj).forEach(([id, student]) => {
    const el = document.createElement('div');
    el.className = 'student-item';
    el.innerHTML = `
      <strong>${student.name ?? id}</strong><br>
      Email: ${student.email ?? 'N/A'}<br>
      ID: ${student.studentId ?? 'N/A'}
    `;
    container.appendChild(el);
  });
}

function renderCourses(coursesObj) {
  const container = document.getElementById('courses-list');
  if (!container) return;
  container.innerHTML = '';
  if (!coursesObj) return (container.innerHTML = '<p>No courses found</p>');
  
  Object.entries(coursesObj).forEach(([id, course]) => {
    const el = document.createElement('div');
    el.className = 'course-item';
    el.innerHTML = `
      <strong>${course.name ?? id}</strong><br>
      Código: ${course.code ?? 'N/A'}<br>
      Profesor: ${course.teacher ?? 'N/A'}
    `;
    container.appendChild(el);
  });
}

function renderAttendance(attObj) {
  const container = document.getElementById('attendance-list');
  if (!container) return;
  container.innerHTML = '';
  if (!attObj) return (container.innerHTML = '<p>No attendance records</p>');
  
  Object.entries(attObj).forEach(([id, rec]) => {
    const el = document.createElement('div');
    el.className = 'attendance-item';
    const timestamp = new Date(rec.timestamp).toLocaleString('es-ES');
    el.innerHTML = `
      <strong>${rec.studentName ?? rec.studentId}</strong><br>
      Curso: ${rec.courseId}<br>
      Hora: ${timestamp}
    `;
    container.appendChild(el);
  });
}

// Auto-start: cuando el DOM esté listo, cargar datos iniciales
window.addEventListener('DOMContentLoaded', () => {
  // Cargar datos iniciales
  loadStudentsOnce().catch(console.error);
  loadCoursesOnce().catch(console.error);
  loadAttendanceOnce().catch(console.error);
  
  // Iniciar listeners en tiempo real (opcional)
  // Descomenta estas líneas para escuchar cambios en vivo
  // watchStudents();
  // watchCourses();
  // watchAttendance();
})