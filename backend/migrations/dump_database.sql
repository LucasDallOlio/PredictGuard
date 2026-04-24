create database if not exists predict_guard;

use predict_guard;

create table if not exists usuarios(
	id int primary key auto_increment,
    nome varchar(255) not null,
    email varchar(255) unique not null,
    senha varchar(255) not null,
    telefone varchar(20) not null,
    tipo enum('admin', 'técnico') not null,
    foto varchar(255) default 'profile_placeholder.jpg',
    data_criacao datetime default current_timestamp,
    data_atualizacao datetime default current_timestamp on update current_timestamp,

    index idx_usuarios_tipo (tipo)
);

create table if not exists maquinas(
	id int primary key auto_increment,
    nome varchar(255) not null,
    cod_registro varchar(255) not null,
    modelo varchar(255),
    serie varchar(20),
    tipo varchar(255),
    potencia_kw decimal(10,2),
    tensao_faixa varchar(50),
    corrente_nominal_a decimal(10,2),
    frequencia_hz decimal(6,2),
    rotacao_rpm int,
    grau_protecao_ip varchar(10),
    classe_isolamento varchar(10),
    fator_servico decimal(4,2),
    rendimento_percentual decimal(5,2),
    fator_potencia decimal(4,3),
    temperatura_ambiente_min_c decimal(5,2),
    temperatura_ambiente_max_c decimal(5,2),
    certificacao_norma varchar(255),
    imagem varchar(255) default 'maquina_placeholder.jpg',
    setor enum('Linha 1', 'Linha 2', 'Linha 3'),
    nivel_criticidade enum('Baixa', 'Média', 'Alta') not null default 'Média',
    status_operacional enum('Ativa', 'Parada', 'Manutenção') not null,
    status_saude enum('Ok', 'Alerta') not null default 'Ok',
    temperatura_limite_c decimal(10,2) not null,
    aceleracao_limite_g decimal(10,2) not null,
    data_criacao datetime default current_timestamp,
    data_atualizacao datetime default current_timestamp on update current_timestamp,

    index idx_maquinas_cod_registro (cod_registro),
    index idx_maquinas_status_setor (status_operacional, status_saude, setor),
    index idx_maquinas_criticidade (nivel_criticidade),

    constraint chk_maquinas_limites_positivos
    check (temperatura_limite_c > 0 and aceleracao_limite_g > 0),

    constraint chk_maquinas_temp_ambiente_intervalo
    check (
        temperatura_ambiente_min_c <= temperatura_ambiente_max_c
    )
);

create table if not exists sensores(
    id int primary key auto_increment,
    maquina_id int not null,
    modelo varchar(255) not null,
    tipo enum('temperatura', 'acelerômetro'),
    data_criacao datetime default current_timestamp,
    data_atualizacao datetime default current_timestamp on update current_timestamp,

    index idx_sensores_maquina_tipo (maquina_id, tipo),

    constraint fk_sensores_maquinas
    foreign key (maquina_id) references maquinas(id)
    on update cascade
    on delete cascade
);

create table if not exists leituras(
	id int primary key auto_increment,
    sensor_id int not null,
    valor decimal(10,2) not null,
    unidade enum('celsius', 'g') not null,
    data_leitura datetime default current_timestamp,

    index idx_leituras_sensor_data (sensor_id, data_leitura),
    index idx_leituras_data (data_leitura),

    constraint chk_leituras_valor_positivo
    check (valor >= 0),

    constraint fk_leituras_sensores
    foreign key (sensor_id) references sensores(id)
    on update cascade
    on delete cascade
);

create table if not exists alertas (
  id int primary key auto_increment,
  maquina_id int not null,
  sensor_id int null,
  tipo_alerta enum('temperatura','vibração','tendência','offline') not null,
  severidade enum('baixa','média','alta','crítica') not null default 'media',
  valor_detectado decimal(10,2) null,
  limite_configurado decimal(10,2) null,
  unidade enum('celsius','g') null,
  mensagem varchar(500) not null,
  data_alerta datetime default current_timestamp,

    index idx_alertas_maquina_data (maquina_id, data_alerta),
    index idx_alertas_sensor_data (sensor_id, data_alerta),
    index idx_alertas_severidade_data (severidade, data_alerta),

    constraint chk_alertas_valores_nao_negativos
        check (
            (valor_detectado is null or valor_detectado >= 0)
            and (limite_configurado is null or limite_configurado >= 0)
        ),

  constraint fk_alertas_maquinas
    foreign key (maquina_id) references maquinas(id)
    on update cascade
    on delete cascade,

    constraint fk_alertas_sensores
    foreign key (sensor_id) references sensores(id)
    on update cascade
    on delete cascade
);

create table if not exists servicos (
    id int primary key auto_increment,
    maquina_id int not null,
    usuario_responsavel_id int not null,
    usuario_solicitante_id int not null,
    tipo enum('Manutenção Preditiva', 'Manutenção Preventiva', 'Manutenção Corretiva', 'Alerta de Falha'),
    servico_status enum('Solicitado', 'Em Andamento', "Concluído"),
    descricao varchar(500),
    observacao varchar(500),
    data_alerta datetime default current_timestamp,
    data_criacao datetime default current_timestamp,
    data_encerramento datetime,

    index idx_servicos_maquina_status_data (maquina_id, servico_status, data_criacao),
    index idx_servicos_responsavel (usuario_responsavel_id),
    index idx_servicos_solicitante (usuario_solicitante_id),

    constraint chk_servicos_data_encerramento
    check (data_encerramento is null or data_encerramento >= data_criacao),

    constraint fk_servicos_maquinas
    foreign key (maquina_id) references maquinas(id)
    on update cascade
    on delete restrict,

    constraint fk_servicos_usuario_responsavel
    foreign key (usuario_responsavel_id) references usuarios(id)
    on update cascade
    on delete cascade,

    constraint fk_servicos_usuario_solicitante
    foreign key (usuario_solicitante_id) references usuarios(id)
    on update cascade
    on delete cascade
);

create table if not exists logs (
    id int primary key auto_increment,
    usuario_id int,
    rota varchar(255) not null,
    metodo varchar(10) not null,
    ip_address varchar(45),
    user_agent text,
    status_code int,
    tempo_resposta_ms int,
    data_hora datetime default current_timestamp,
    dados_requisicao JSON,
    dados_resposta JSON,

    index idx_logs_usuario_id (usuario_id),
    index idx_logs_data_hora (data_hora),
    index idx_logs_rota (rota),
    index idx_logs_metodo (metodo),
    index idx_logs_status_code (status_code),

    constraint fk_logs_usuario
    foreign key (usuario_id) references usuarios(id)
    on update cascade
    on delete set null
);

-- =========================
-- DADOS INICIAIS (SEED)
-- =========================

insert into usuarios (id, nome, email, senha, telefone, tipo, foto) values
    (1, 'Ana Souza', 'ana.souza@predictguard.com', '$2b$10$BXX0.935RtQgW8I6NM0CRer8RZS5drRODGIAfmFs6GTLe/DkEUQj2', '(11) 99999-1001', 'admin', 'ana.jpg'),
    (2, 'Bruno Lima', 'bruno.lima@predictguard.com', '$2b$10$ijRQlhhvmVZmSfT5xcPhMeVB61M24PICwpjc9R2/UCPiPGaMM1akO', '(11) 99999-1002', 'técnico', 'bruno.jpg'),
    (3, 'Carla Mendes', 'carla.mendes@predictguard.com', '$2b$10$Zyi8QFjqDI4/GD8F2QCk1.FXOGaujsHB3llx0eG0p/s0XZc.Qdtuu', '(11) 99999-1003', 'técnico', 'carla.jpg'),
    (4, 'Diego Ramos', 'diego.ramos@predictguard.com', '$2b$10$x8/sTEVdHjAnesrhSK.BBOlBa23DqLnHZrRgGD3s6A/R6PSt/i3Ku', '(11) 99999-1004', 'admin', 'diego.jpg');

insert into maquinas (
    id, nome, cod_registro, modelo, serie, tipo, potencia_kw, tensao_faixa,
    corrente_nominal_a, frequencia_hz, rotacao_rpm, grau_protecao_ip,
    classe_isolamento, fator_servico, rendimento_percentual, fator_potencia,
    temperatura_ambiente_min_c, temperatura_ambiente_max_c, certificacao_norma,
    imagem, setor, nivel_criticidade, status_operacional, status_saude,
    temperatura_limite_c, aceleracao_limite_g
) values
    (1, 'Motor Esteira A1', 'MTR-L1-001', 'WEG W22', 'A1S2026', 'Motor de Inducao Trifasico', 15.00, '220-380V', 45.50, 60.00, 1750, 'IP55', 'F', 1.15, 93.20, 0.890, 10.00, 45.00, 'IEC 60034', 'motor_a1.jpg', 'Linha 1', 'Média', 'Ativa', 'Ok', 85.00, 3.50),
    (2, 'Motor Prensa B2', 'MTR-L2-014', 'Siemens SD100', 'B2S1825', 'Motor de Inducao Trifasico', 30.00, '380-440V', 58.20, 60.00, 1780, 'IP56', 'F', 1.15, 94.10, 0.910, 8.00, 40.00, 'IEC 60034', 'motor_b2.jpg', 'Linha 2', 'Alta', 'Ativa', 'Alerta', 80.00, 2.80),
    (3, 'Compressor C3', 'MTR-L3-007', 'ABB M3AA', 'C3S5521', 'Compressor', 22.00, '220-380V', 49.80, 60.00, 1760, 'IP55', 'H', 1.20, 92.80, 0.870, 12.00, 42.00, 'NBR 17094', 'compressor_c3.jpg', 'Linha 3', 'Baixa', 'Manutenção', 'Ok', 90.00, 4.20),
    (4, 'Ventilador Exaustao D4', 'MTR-L1-021', 'WEG W50', 'D4S3302', 'Ventilador Industrial', 7.50, '220V', 22.30, 60.00, 1720, 'IP54', 'F', 1.10, 90.40, 0.850, 10.00, 38.00, 'IEC 60034', 'ventilador_d4.jpg', 'Linha 1', 'Baixa', 'Parada', 'Ok', 75.00, 2.20);

insert into sensores (id, maquina_id, modelo, tipo) values
    (1, 1, 'PT100-XR', 'temperatura'),
    (2, 1, 'VIB-MEMS-200', 'acelerômetro'),
    (3, 2, 'PT100-XR', 'temperatura'),
    (4, 2, 'VIB-MEMS-200', 'acelerômetro'),
    (5, 3, 'PT100-IND', 'temperatura'),
    (6, 3, 'VIB-PIEZO-500', 'acelerômetro'),
    (7, 4, 'PT100-STD', 'temperatura'),
    (8, 4, 'VIB-MEMS-150', 'acelerômetro');

insert into leituras (id, sensor_id, valor, unidade, data_leitura) values
    (1, 1, 68.30, 'celsius', '2026-03-30 08:00:00'),
    (2, 2, 1.80, 'g', '2026-03-30 08:00:00'),
    (3, 3, 82.40, 'celsius', '2026-03-30 08:05:00'),
    (4, 4, 3.10, 'g', '2026-03-30 08:05:00'),
    (5, 5, 74.20, 'celsius', '2026-03-30 08:10:00'),
    (6, 6, 2.40, 'g', '2026-03-30 08:10:00'),
    (7, 7, 39.00, 'celsius', '2026-03-30 08:15:00'),
    (8, 8, 0.90, 'g', '2026-03-30 08:15:00'),
    (9, 1, 70.10, 'celsius', '2026-03-30 09:00:00'),
    (10, 2, 2.10, 'g', '2026-03-30 09:00:00'),
    (11, 3, 84.80, 'celsius', '2026-03-30 09:05:00'),
    (12, 4, 3.45, 'g', '2026-03-30 09:05:00');

insert into alertas (
    id, maquina_id, sensor_id, tipo_alerta, severidade,
    valor_detectado, limite_configurado, unidade, mensagem, data_alerta
) values
    (1, 2, 3, 'temperatura', 'alta', 84.80, 80.00, 'celsius', 'Temperatura acima do limite configurado na Maquina 2.', '2026-03-30 09:06:00'),
    (2, 2, 4, 'vibração', 'crítica', 3.45, 2.80, 'g', 'Vibracao critica detectada no conjunto de rolamentos da Maquina 2.', '2026-03-30 09:06:30'),
    (3, 1, 2, 'tendência', 'média', 2.10, 3.50, 'g', 'Tendencia de aumento gradual de vibracao na Maquina 1.', '2026-03-30 09:07:00'),
    (4, 4, null, 'offline', 'baixa', null, null, null, 'Sensor da Maquina 4 ficou offline por mais de 5 minutos.', '2026-03-30 09:08:00');

insert into servicos (
    id, maquina_id, usuario_responsavel_id, usuario_solicitante_id,
    tipo, servico_status, descricao, observacao,
    data_alerta, data_criacao, data_encerramento
) values
    (1, 2, 2, 1, 'Alerta de Falha', 'Em Andamento', 'Inspecionar aumento de temperatura e vibracao na Maquina 2.', 'Prioridade alta. Verificar alinhamento e lubrificacao.', '2026-03-30 09:06:00', '2026-03-30 09:10:00', null),
    (2, 3, 3, 4, 'Manutenção Preventiva', 'Solicitado', 'Troca programada de rolamentos e reaperto geral.', 'Agendar para o proximo turno sem impacto de producao.', '2026-03-29 10:00:00', '2026-03-29 10:10:00', null),
    (3, 1, 2, 1, 'Manutenção Preditiva', 'Concluído', 'Analise preditiva executada com ajustes finos no acoplamento.', 'Sem anomalias criticas apos ajuste.', '2026-03-28 14:00:00', '2026-03-28 14:15:00', '2026-03-28 16:40:00');
