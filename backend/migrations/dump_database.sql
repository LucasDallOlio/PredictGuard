create database if not exists predict_guard;

use predict_guard;

create table if not exists usuarios(
	id int primary key auto_increment,
    nome varchar(255) not null,
    email varchar(255) unique not null,
    senha varchar(255) not null,
    tipo enum('admin', 'técnico') not null,
    foto varchar(255) default 'profile_placeholder.jpg',
    data_criacao datetime default current_timestamp,
    data_atualizacao datetime default current_timestamp on update current_timestamp
);

create table if not exists maquinas(
	id int primary key auto_increment,
    nome varchar(255) not null,
    codigo varchar(255) not null,
    modelo varchar(255) not null,
    tipo varchar(255) not null,
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
    unidade enum('celsius', 'g'),
    data_leitura datetime default current_timestamp
);



