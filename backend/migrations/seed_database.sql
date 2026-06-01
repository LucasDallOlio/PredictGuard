use predict_guard;

-- =========================
-- DADOS INICIAIS (SEED)
-- =========================

insert into usuarios (id, nome, email, senha, telefone, tipo, foto) values
    (1, 'Ana Souza', 'ana.souza@predictguard.com', '$2b$10$BXX0.935RtQgW8I6NM0CRer8RZS5drRODGIAfmFs6GTLe/DkEUQj2', '(11) 99999-1001', 'admin', 'ana.jpg'),
    (2, 'Bruno Lima', 'bruno.lima@predictguard.com', '$2b$10$ijRQlhhvmVZmSfT5xcPhMeVB61M24PICwpjc9R2/UCPiPGaMM1akO', '(11) 99999-1002', 'tecnico', 'bruno.jpg'),
    (3, 'Carla Mendes', 'carla.mendes@predictguard.com', '$2b$10$Zyi8QFjqDI4/GD8F2QCk1.FXOGaujsHB3llx0eG0p/s0XZc.Qdtuu', '(11) 99999-1003', 'tecnico', 'carla.jpg'),
    (4, 'Diego Ramos', 'diego.ramos@predictguard.com', '$2b$10$x8/sTEVdHjAnesrhSK.BBOlBa23DqLnHZrRgGD3s6A/R6PSt/i3Ku', '(11) 99999-1004', 'admin', 'diego.jpg');

insert into maquinas (
    id, nome, cod_registro, modelo, serie, tipo, potencia_kw, tensao_faixa,
    corrente_nominal_a, frequencia_hz, rotacao_rpm, grau_protecao_ip,
    classe_isolamento, fator_servico, rendimento_percentual, fator_potencia,
    temperatura_ambiente_min_c, temperatura_ambiente_max_c, certificacao_norma,
    imagem, setor, nivel_criticidade, status_operacional, status_saude,
    temperatura_limite_c, aceleracao_limite_mms
) values
    (1, 'Motor Esteira A1', 'MTR-L1-001', 'WEG W22', 'A1S2026', 'Motor de Inducao Trifasico', 15.00, '220-380V', 45.50, 60.00, 1750, 'IP55', 'F', 1.15, 93.20, 0.890, 10.00, 45.00, 'IEC 60034', 'motor_a1.jpg', 'linha_1', 'media', 'ativa', 'ok', 85.00, 3.50),
    (2, 'Motor Prensa B2', 'MTR-L2-014', 'Siemens SD100', 'B2S1825', 'Motor de Inducao Trifasico', 30.00, '380-440V', 58.20, 60.00, 1780, 'IP56', 'F', 1.15, 94.10, 0.910, 8.00, 40.00, 'IEC 60034', 'motor_b2.jpg', 'linha_2', 'alta', 'ativa', 'alerta', 80.00, 2.80),
    (3, 'Compressor C3', 'MTR-L3-007', 'ABB M3AA', 'C3S5521', 'Compressor', 22.00, '220-380V', 49.80, 60.00, 1760, 'IP55', 'H', 1.20, 92.80, 0.870, 12.00, 42.00, 'NBR 17094', 'compressor_c3.jpg', 'linha_3', 'baixa', 'manutencao', 'ok', 90.00, 4.20),
    (4, 'Ventilador Exaustao D4', 'MTR-L1-021', 'WEG W50', 'D4S3302', 'Ventilador Industrial', 7.50, '220V', 22.30, 60.00, 1720, 'IP54', 'F', 1.10, 90.40, 0.850, 10.00, 38.00, 'IEC 60034', 'ventilador_d4.jpg', 'linha_1', 'baixa', 'parada', 'ok', 75.00, 2.20);

insert into sensores (id, maquina_id, modelo, tipo) values
    (1, 1, 'PT100-XR', 'temperatura'),
    (2, 1, 'VIB-MEMS-200', 'acelerometro'),
    (3, 2, 'PT100-XR', 'temperatura'),
    (4, 2, 'VIB-MEMS-200', 'acelerometro'),
    (5, 3, 'PT100-IND', 'temperatura'),
    (6, 3, 'VIB-PIEZO-500', 'acelerometro'),
    (7, 4, 'PT100-STD', 'temperatura'),
    (8, 4, 'VIB-MEMS-150', 'acelerometro');

insert into leituras (id, sensor_id, valor, unidade, data_leitura) values
    (1, 1, 68.30, 'celsius', '2026-03-30 08:00:00'),
    (2, 2, 1.80, 'mm/s', '2026-03-30 08:00:00'),
    (3, 3, 82.40, 'celsius', '2026-03-30 08:05:00'),
    (4, 4, 3.10, 'mm/s', '2026-03-30 08:05:00'),
    (5, 5, 74.20, 'celsius', '2026-03-30 08:10:00'),
    (6, 6, 2.40, 'mm/s', '2026-03-30 08:10:00'),
    (7, 7, 39.00, 'celsius', '2026-03-30 08:15:00'),
    (8, 8, 0.90, 'mm/s', '2026-03-30 08:15:00'),
    (9, 1, 70.10, 'celsius', '2026-03-30 09:00:00'),
    (10, 2, 2.10, 'mm/s', '2026-03-30 09:00:00'),
    (11, 3, 84.80, 'celsius', '2026-03-30 09:05:00'),
    (12, 4, 3.45, 'mm/s', '2026-03-30 09:05:00');

insert into alertas (
    id, maquina_id, sensor_id, tipo_alerta, severidade,
    valor_detectado, limite_configurado, unidade, mensagem, data_alerta
) values
    (1, 2, 3, 'temperatura', 'alta', 84.80, 80.00, 'celsius', 'Temperatura acima do limite configurado na Maquina 2.', '2026-03-30 09:06:00'),
    (2, 2, 4, 'vibração', 'crítica', 3.45, 2.80, 'mm/s', 'Vibracao critica detectada no conjunto de rolamentos da Maquina 2.', '2026-03-30 09:06:30'),
    (3, 1, 2, 'tendência', 'média', 2.10, 3.50, 'mm/s', 'Tendencia de aumento gradual de vibracao na Maquina 1.', '2026-03-30 09:07:00'),
    (4, 4, null, 'offline', 'baixa', null, null, null, 'Sensor da Maquina 4 ficou offline por mais de 5 minutos.', '2026-03-30 09:08:00');

insert into servicos (
    id, maquina_id, usuario_responsavel_id, usuario_solicitante_id,
    tipo, servico_status, descricao, observacao,
    data_alerta, data_criacao, data_encerramento
) values
    (1, 2, 2, 1, 'analise_de_falha', 'em_andamento', 'Inspecionar aumento de temperatura e vibracao na Maquina 2.', 'Prioridade alta. Verificar alinhamento e lubrificacao.', '2026-03-30 09:06:00', '2026-03-30 09:10:00', null),
    (2, 3, 3, 4, 'manutencao_preventiva', 'solicitado', 'Troca programada de rolamentos e reaperto geral.', 'Agendar para o proximo turno sem impacto de producao.', '2026-03-29 10:00:00', '2026-03-29 10:10:00', null),
    (3, 1, 2, 1, 'manutencao_preditiva', 'concluido', 'Analise preditiva executada com ajustes finos no acoplamento.', 'Sem anomalias criticas apos ajuste.', '2026-03-28 14:00:00', '2026-03-28 14:15:00', '2026-03-28 16:40:00');
