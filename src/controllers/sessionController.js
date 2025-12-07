const { v4: uuidv4 } = require('uuid');
const { createStudent, getStudentByStudentId, updateStudent, listStudents } = require("../models");

// Almacenamiento temporal de sesiones (en Firebase iría a realtime DB)
const sessions = new Map();

/**
 * Crear una nueva sesión QR para que los estudiantes escaneen
 * POST /api/sessions
 */
exports.createSession = (req, res) => {
  const { courseId, courseName, teacherId, teacherName } = req.body;

  if (!courseId || !teacherId) {
    return res.status(400).json({
      message: "courseId and teacherId are required",
    });
  }

  const sessionId = uuidv4();
  const qrUrl = `${req.protocol}://${req.get('host')}/scan?sessionId=${sessionId}`;

  const session = {
    sessionId,
    courseId,
    courseName,
    teacherId,
    teacherName,
    qrUrl,
    createdAt: new Date().toISOString(),
    status: 'active',
    attendees: [],
  };

  sessions.set(sessionId, session);

  console.log(`✓ Session created: ${sessionId} for course ${courseId}`);

  res.status(201).json({
    sessionId,
    qrUrl,
    message: "Session created successfully. Share this QR code with students.",
  });
};

/**
 * Obtener una sesión por ID
 * GET /api/sessions/:sessionId
 */
exports.getSession = (req, res) => {
  const { sessionId } = req.params;

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({
      message: "Session not found",
    });
  }

  res.json(session);
};

/**
 * Listar todas las sesiones activas
 * GET /api/sessions
 */
exports.listSessions = (req, res) => {
  const allSessions = Array.from(sessions.values()).filter(
    (s) => s.status === 'active'
  );
  res.json(allSessions);
};

/**
 * Cerrar una sesión (detener de aceptar asistencias)
 * PATCH /api/sessions/:sessionId/close
 */
exports.closeSession = (req, res) => {
  const { sessionId } = req.params;

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({
      message: "Session not found",
    });
  }

  session.status = 'closed';
  session.closedAt = new Date().toISOString();

  res.json({
    message: "Session closed successfully",
    session,
  });
};

/**
 * Marcar asistencia en una sesión (desde el escaneo QR)
 * POST /api/sessions/:sessionId/attendance
 */
exports.markAttendance = async (req, res) => {
  const { sessionId } = req.params;
  const { studentId, studentName, studentEmail, studentPhone } = req.body;

  if (!sessionId) {
    return res.status(400).json({
      message: "sessionId is required",
    });
  }

  if (!studentId && !studentName) {
    return res.status(400).json({
      message: "studentId or studentName is required",
    });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({
      message: "Session not found",
    });
  }

  if (session.status !== 'active') {
    return res.status(400).json({
      message: "This session is no longer active",
    });
  }

  // Verificar que no esté duplicado
  const exists = session.attendees.some(
    (a) => a.studentId === studentId
  );

  if (exists) {
    return res.status(400).json({
      message: "Student already marked as present in this session",
    });
  }

  const attendance = {
    studentId,
    studentName,
    studentEmail: studentEmail || null,
    studentPhone: studentPhone || null,
    markedAt: new Date().toISOString(),
  };

  session.attendees.push(attendance);

  // Guardar/actualizar estudiante en la base de datos
  try {
    const existingStudent = await getStudentByStudentId(studentId);
    if (existingStudent) {
      // Actualizar estudiante existente usando su id interno
      await updateStudent(existingStudent.id, {
        name: studentName,
        email: studentEmail || existingStudent.email,
        phone: studentPhone || existingStudent.phone,
      });
      console.log(`✓ Student updated: ${studentId}`);
    } else {
      // Crear nuevo estudiante
      await createStudent({
        name: studentName,
        email: studentEmail || '',
        studentId: studentId,
        phone: studentPhone || '',
      });
      console.log(`✓ New student created: ${studentId}`);
    }
  } catch (error) {
    console.error("Error saving student:", error);
    // No fallar la asistencia si hay error guardando el estudiante
  }

  console.log(
    `✓ Attendance marked: ${studentName || studentId} in session ${sessionId}`
  );

  res.status(201).json({
    message: "Attendance marked successfully",
    attendance,
  });
};

/**
 * Obtener reporte de asistencia de una sesión
 * GET /api/sessions/:sessionId/attendance
 */
exports.getSessionAttendance = (req, res) => {
  const { sessionId } = req.params;

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({
      message: "Session not found",
    });
  }

  res.json({
    sessionId,
    courseId: session.courseId,
    courseName: session.courseName,
    totalAttendees: session.attendees.length,
    attendees: session.attendees,
    createdAt: session.createdAt,
    closedAt: session.closedAt || null,
  });
};
