# Guia de Inicialização - Monitor de Motor Trifásico ESP32

## Passo 1: Definir IP Estático no Notebook

Abra o CMD como **Administrador** e rode:

```bash
netsh interface ip set address "Wi-Fi 2" static 192.168.4.200 255.255.255.0 192.168.4.1
```

## Passo 2: Iniciar o Broker Mosquitto

No mesmo CMD como **Administrador**, rode:

```bash
cd "C:\Program Files\mosquitto"
mosquitto -c mosquitto.conf -v
```

⚠️ **Importante:** Deixe essa janela aberta durante todo o uso.

## Passo 3: Ligar o ESP32

Conecte o ESP32 via USB. No **Monitor Serial** (115200 baud) aguarde aparecer:

```
MPU-6050 OK!
MLX90614 OK!
Calibrando... Motor DESLIGADO.
```

⚠️ **Não mexa nos sensores durante a calibração (~3 segundos).**

## Passo 4: Conectar Notebook na Rede do ESP32

Vá no **WiFi do Windows** e conecte em:

| Campo | Valor |
|-------|-------|
| **Rede** | `ESP32_MotorMonitor` |
| **Senha** | `12345678` |

## Passo 5: Confirmar Conexão MQTT

No **Monitor Serial** deve aparecer:

```
Conectando ao MQTT (notebook)... OK!
Temp: 28.2 C | Vibracao: 0.47 mm/s [NORMAL] | MQTT: OK | Clientes AP: 1
```

## Passo 6: Ver os Dados Chegando

Abra um **segundo CMD** e rode:

```bash
mosquitto_sub -h localhost -t "motor/#" -v
```

A cada 1 segundo vai aparecer:

```
motor/temperatura/motor 28.2
motor/vibracao/status NORMAL
```

## Finalizar os Testes

Quando terminar, **volte ao IP automático**:

```bash
netsh interface ip set address "Wi-Fi 2" dhcp
```

---

**Versão:** 1.0  
**Data:** Maio 2026
