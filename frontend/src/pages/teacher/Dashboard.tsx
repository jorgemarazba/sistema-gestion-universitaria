export const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#374151] rounded-xl p-6 border border-gray-600">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-lg font-semibold text-white">Mis Cursos</h3>
          <p className="text-3xl font-bold text-emerald-400 mt-2">5</p>
          <p className="text-gray-400 text-sm">Cursos activos</p>
        </div>
        <div className="bg-[#374151] rounded-xl p-6 border border-gray-600">
          <div className="text-4xl mb-3">👨‍🎓</div>
          <h3 className="text-lg font-semibold text-white">Estudiantes</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">128</p>
          <p className="text-gray-400 text-sm">Total inscritos</p>
        </div>
        <div className="bg-[#374151] rounded-xl p-6 border border-gray-600">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-semibold text-white">Calificaciones</h3>
          <p className="text-3xl font-bold text-yellow-400 mt-2">12</p>
          <p className="text-gray-400 text-sm">Pendientes de subir</p>
        </div>
      </div>
    </div>
  );
};
