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
    data_atualizacao datetime default current_timestamp on update current_timestamp
);

create table if not exists maquinas(
	id int primary key auto_increment,
    nome varchar(255) not null,
    cod_registro varchar(255) not null,
    modelo varchar(255) not null,
    serie varchar(20) not null,
    tipo varchar(255) not null,
    potencia_kw decimal(10,2) not null,
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
    nivel_criticidade enum('Baixa', 'Média', 'Alta'),
    status_operacional enum('Ativa', 'Parada', 'Manutenção'),
    status_saude enum('Ok', 'Alerta'),
    data_criacao datetime default current_timestamp,
    data_atualizacao datetime default current_timestamp on update current_timestamp
);

create table if not exists sensores(
    id int primary key auto_increment,
    maquina_id int not null,
    modelo varchar(255) not null,
    tipo enum('temperatura', 'acelerômetro'),
    data_criacao datetime default current_timestamp,
    data_atualizacao datetime default current_timestamp on update current_timestamp
);

create table if not exists leituras(
	id int primary key auto_increment,
    sensor_id int not null,
    valor decimal(10,2) not null,
    unidade enum('celsius', 'g') not null,
    data_leitura datetime default current_timestamp
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
  data_alerta datetime default current_timestamp
);



