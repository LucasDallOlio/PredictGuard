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
  tipo_alerta enum('temperatura','vibracao','tendencia','offline') not null,
  severidade enum('baixa','media','alta','critica') not null default 'media',
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
    servico_status enum('Solcitado', 'Em Andamento', "Concluído"),
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
    on delete restrict,

    constraint fk_servicos_usuario_solicitante
    foreign key (usuario_solicitante_id) references usuarios(id)
    on update cascade
    on delete restrict
);

create table if not exists logs (
    id int primary key auto_increment,
    usuario_id,
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

    foreign key (usuario_id) references usuarios(id)
    on delete set null
)