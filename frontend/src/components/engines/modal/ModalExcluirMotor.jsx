"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export function ModalExcluirMotor({
  open,
  setOpen,
  motor,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);

  if (!open || !motor) return null;

  const handleExcluir = async () => {
    setLoading(true);

    try {
      await onConfirm(motor.id);

      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir motor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-zinc-700">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>

        <h2 className="text-lg font-bold text-gray-800 dark:text-zinc-100 text-center">
          Excluir Motor
        </h2>

        <p className="text-sm text-gray-500 dark:text-zinc-400 text-center mt-2">
          Tem certeza que deseja excluir{" "}
          <span className="font-semibold text-gray-700 dark:text-zinc-200">
            {motor.nome}
          </span>{" "}
          (Código: {motor.cod_registro})?
        </p>

        <p className="text-red-500 text-sm text-center mt-2 font-medium">
          Essa ação não poderá ser desfeita.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleExcluir}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? "Excluindo..." : "Sim, excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}