"use client";

import { useState } from "react";

import { CardMotor } from "@/components/engines/card/card";
import { Button } from "@/components/ui/button";
import { IconEngine } from "@tabler/icons-react";
import { ModalMotorDetalhes } from "@/components/engines/modal/modal-motor";
import { ModalCriarMotor } from "@/components/engines/modal/ModalCriarMotor"; 

export default function MotoresPage() {
  // Estados do Modal de Detalhes
  const [open, setOpen] = useState(false);
  const [motorSelecionado, setMotorSelecionado] = useState(null);

  // Estado do Modal de Criação
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // Transformei os motores em Estado para você ver a adição funcionando na tela
  const [listaMotores, setListaMotores] = useState([
    {
      id: "1",
      nome: "Motor A-102",
      cod_registro: "MTR-001",
      modelo: "WEG W22",
      serie: "ABC123",
      tipo: "Trifásico",
      potencia_kw: 50,
      tensao_faixa: "220-380V",
      corrente_nominal_a: 120,
      frequencia_hz: 60,
      rotacao_rpm: 1750,
      grau_protecao_ip: "IP55",
      classe_isolamento: "F",
      fator_servico: 1.15,
      rendimento_percentual: 92.5,
      fator_potencia: 0.89,
      temperatura_ambiente_min_c: 5,
      temperatura_ambiente_max_c: 40,
      setor: "Linha 1",
      nivel_criticidade: "Média",
      status_operacional: "Ativa",
      status_saude: "Ok",
      temperatura: 75,
      vibracao: "Normal",
      imagem: "/motor1.png",
    },
    {
      id: "2",
      nome: "Motor B-210",
      cod_registro: "MTR-002",
      modelo: "Siemens XPT",
      serie: "XYZ789",
      tipo: "Monofásico",
      potencia_kw: 30,
      tensao_faixa: "110-220V",
      corrente_nominal_a: 90,
      frequencia_hz: 60,
      rotacao_rpm: 1500,
      grau_protecao_ip: "IP54",
      classe_isolamento: "B",
      fator_servico: 1.10,
      rendimento_percentual: 88.2,
      fator_potencia: 0.85,
      temperatura_ambiente_min_c: 10,
      temperatura_ambiente_max_c: 45,
      setor: "Linha 2",
      nivel_criticidade: "Alta",
      status_operacional: "Manutenção",
      status_saude: "Alerta",
      temperatura: 92,
      vibracao: "Alta",
      imagem: "/motor2.png",
    },
  ]);

  function handleDelete(id) {
    console.log("deletar", id);
    // Exemplo de como ficaria a exclusão visual:
    // setListaMotores(prev => prev.filter(motor => motor.id !== id));
  }

  // Função que recebe os dados do ModalCriarMotor
  function handleSaveNovoMotor(novoMotor) {
    console.log("Dados do novo motor:", novoMotor);
    
    // Simula a criação de um ID (no mundo real, o MySQL faria o Auto Increment)
    const motorComId = {
      ...novoMotor,
      id: Date.now().toString(),
    };

    // Atualiza a lista na tela colocando o novo motor no início
    setListaMotores((prev) => [motorComId, ...prev]);
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <IconEngine className="w-8 h-8 text-primary" />
              Motores
            </h1>
            <p className="text-muted-foreground text-sm">
              Gerencie e monitore todos os motores cadastrados
            </p>
          </div>

          {/* O onClick agora aciona o modal de criação */}
          <Button onClick={() => setOpenCreateModal(true)}>
            + Adicionar Motor
          </Button>
        </div>

        {/* LISTA */}
        <div className="grid gap-4">
          {listaMotores.map((motor) => (
            <CardMotor
              key={motor.id}
              motor={motor}
              onDelete={handleDelete}
              onClick={() => {
                setMotorSelecionado(motor);
                setOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* MODAL DETALHES / EDITAR */}
      <ModalMotorDetalhes
        open={open}
        setOpen={setOpen}
        motor={motorSelecionado}
        onDelete={handleDelete}
        // Se já tiver feito a função onEdit, pode passar aqui também
      />

      {/* MODAL CRIAR NOVO MOTOR */}
      <ModalCriarMotor 
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        onSave={handleSaveNovoMotor}
      />
    </div>
  );
}