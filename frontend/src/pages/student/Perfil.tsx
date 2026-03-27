export const StudentPerfil = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
      <div className="bg-[#374151] rounded-xl p-8 border border-gray-600">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
            E
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Estudiante</h2>
            <p className="text-gray-400">estudiante@universidad.edu</p>
          </div>
        </div>
        <p className="text-gray-400">Gestiona tu información personal y preferencias</p>
      </div>
    </div>
  );
};
