/* 
 * ============================================================ 
 *  MONITOR DE MOTOR TRIFÁSICO — ESP32  (v3 — AP + MQTT Local) 
 *  Sensores : MPU-6050 (vibração) + MLX90614 (temperatura IR) 
 *  Análise  : FFT via arduinoFFT + classificação ISO 10816-3 
 *  Conexão  : ESP32 cria rede WiFi (AP) → notebook conecta → 
 *             ESP32 publica MQTT no broker do notebook 
 * ============================================================ 
 * 
 *  Bibliotecas necessárias (instale pelo Library Manager): 
 *    - Adafruit MPU6050 
 *    - Adafruit MLX90614 
 *    - Adafruit Unified Sensor 
 *    - arduinoFFT  (v2.x — by kosme) 
 *    - PubSubClient (MQTT — by Nick O'Leary) 
 *    - WiFi         (inclusa no core ESP32) 
 * 
 *  Pinagem I2C (ESP32 padrão): 
 *    SDA = GPIO 21 
 *    SCL = GPIO 22 
 * 
 *  Como funciona: 
 *    1. ESP32 cria a rede "ESP32_MotorMonitor" 
 *    2. Notebook conecta nessa rede 
 *    3. Mosquitto roda no notebook (IP 192.168.4.2) 
 *    4. ESP32 publica nos tópicos MQTT: 
 *         motor/temperatura/motor   → float (°C) 
 *         motor/vibracao/status     → string (NORMAL/ATENCAO/ALERTA/CRITICO) 
 * ============================================================ 
 */

#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_MLX90614.h>
#include <arduinoFFT.h>

// ── Rede WiFi — Modo Access Point ─────────────────────────────────────────
// O ESP32 CRIA esta rede; o notebook conecta nela
const char* AP_SSID = "ESP32_MotorMonitor";
const char* AP_PASSWORD = "12345678"; // mínimo 8 caracteres

// ── MQTT — Broker no notebook ─────────────────────────────────────────────
// Quando o notebook conecta no AP do ESP32, recebe IP 192.168.4.2 (primeiro cliente) 
// Se o IP do notebook for diferente, ajuste aqui ou use o monitor serial para verificar 
const char* MQTT_BROKER  = "192.168.4.2";
const int MQTT_PORT = 1883;
const char* MQTT_CLIENT = "esp32_motor_monitor";

// Apenas 2 tópicos — temperatura e status de vibração
const char* TOPIC_TEMP = "motor/temperatura/motor";
const char* TOPIC_VIBRA = "motor/vibracao/status";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// ── Sensores ──────────────────────────────────────────────────────────────
Adafruit_MPU6050 mpu;
Adafruit_MLX90614 mlx;

// ── Parâmetros de amostragem para FFT ─────────────────────────────────────
const uint16_t AMOSTRAS_FFT = 512; 
const float FREQ_AMOSTRAGEM = 1000.0;

// Buffers separados por eixo
double vRealX[AMOSTRAS_FFT], vImagX[AMOSTRAS_FFT];
double vRealY[AMOSTRAS_FFT], vImagY[AMOSTRAS_FFT];
double vRealZ[AMOSTRAS_FFT], vImagZ[AMOSTRAS_FFT];

ArduinoFFT<double> fftX(vRealX, vImagX, AMOSTRAS_FFT, FREQ_AMOSTRAGEM);
ArduinoFFT<double> fftY(vRealY, vImagY, AMOSTRAS_FFT, FREQ_AMOSTRAGEM);
ArduinoFFT<double> fftZ(vRealZ, vImagZ, AMOSTRAS_FFT, FREQ_AMOSTRAGEM);

// ── Calibração ────────────────────────────────────────────────────────────
float baseX = 0, baseY = 0, baseZ = 0;
const int AMOSTRAS_CALIBRACAO = 500;

// ── Limiares de vibração — ISO 10816-3 ────────────────────────────────────
const float LIMIAR_NORMAL = 2.3f;
const float LIMIAR_ATENCAO = 4.5f;
const float LIMIAR_ALERTA = 7.1f;

// ── Temporização ──────────────────────────────────────────────────────────
unsigned long ultimaPublicacao = 0;
const unsigned long INTERVALO_PUBLICACAO = 1000;  // publica a cada 1 s

// ── Protótipos ────────────────────────────────────────────────────────────
float calcularVibracaoPorEixo();
float calcularRMSdoEixo(double* vReal, double* vImag, ArduinoFFT<double>& fft);
String classificarVibracao(float rmsMMpS);
void conectarWiFi();
void conectarMQTT();

// ==========================================================================
void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  Wire.setClock(100000);

  // ── Modo Access Point ───────────────────────────────────────────────────
  Serial.println("Criando rede WiFi (Access Point)...");
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASSWORD);
  delay(500);  // aguarda AP estabilizar
  Serial.printf("  Rede   : %s\n", AP_SSID);
  Serial.printf("  Senha  : %s\n", AP_PASSWORD);
  Serial.printf("  IP ESP : %s\n", WiFi.softAPIP().toString().c_str());
  Serial.println("  Aguardando notebook conectar nesta rede...");
  Serial.println();

  // ── MQTT ────────────────────────────────────────────────────────────────
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);

  // ── MPU-6050 ────────────────────────────────────────────────────────────
  Serial.println("Iniciando MPU-6050...");
  if (!mpu.begin()) {
    Serial.println("ERRO: MPU-6050 nao encontrado!");
    while (1) { delay(100); }
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_260_HZ);
  Serial.println("MPU-6050 OK!");

  // ── MLX90614 ────────────────────────────────────────────────────────────
  Serial.println("Iniciando MLX90614...");
  if (!mlx.begin()) {
    Serial.println("ERRO: MLX90614 nao encontrado!");
    while (1) { delay(100); }
  }
  Serial.println("MLX90614 OK!");

  // ── Calibração ──────────────────────────────────────────────────────────
  Serial.println("==============================");
  Serial.println("Calibrando... Motor DESLIGADO.");
  delay(2000);
  float somaX = 0, somaY = 0, somaZ = 0;
  for (int i = 0; i < AMOSTRAS_CALIBRACAO; i++) {
    sensors_event_t a, g, t;
    mpu.getEvent(&a, &g, &t);
    somaX += a.acceleration.x;
    somaY += a.acceleration.y;
    somaZ += a.acceleration.z;
    delay(5);
  }
  baseX = somaX / AMOSTRAS_CALIBRACAO;
  baseY = somaY / AMOSTRAS_CALIBRACAO;
  baseZ = somaZ / AMOSTRAS_CALIBRACAO;
  Serial.println("Calibracao concluida!");
  Serial.printf("  Base X: %.3f | Y: %.3f | Z: %.3f m/s2\n", baseX, baseY, baseZ);
  Serial.println("==============================");
  Serial.println();
  Serial.println("Iniciando monitoramento...");
  Serial.println();
  delay(500);
}

// ==========================================================================
  void loop() {

  // ── Reconexão MQTT (tenta a cada loop, sem bloquear) ────────────────────
  if (!mqttClient.connected()) {
    conectarMQTT();
  }
  mqttClient.loop();

  // ── FFT por eixo → status de vibração ───────────────────────────────────
  float rmsTotal = calcularVibracaoPorEixo();
  String statusVibra = classificarVibracao(rmsTotal);

  // ── Temperatura do objeto ───────────────────────────────────────────────
  float tempMotor = mlx.readObjectTempC();

  // ── Publica a cada 1 s ──────────────────────────────────────────────────
  unsigned long agora = millis();
  if (agora - ultimaPublicacao >= INTERVALO_PUBLICACAO) {
    ultimaPublicacao = agora;

    // Log serial (debug)
    Serial.printf("Temp: %.1f C  |  Vibracao: %.2f mm/s [%s]  |  MQTT: %s  |  Clientes AP: %d\n ", 
                  tempMotor, rmsTotal, statusVibra.c_str(),
                  mqttClient.connected() ? "OK" : "OFF",
                  WiFi.softAPgetStationNum());

    // Publica no broker MQTT do notebook
    if (mqttClient.connected()) {
      char bufTemp[16];
      snprintf(bufTemp, sizeof(bufTemp), "%.1f", tempMotor);

      mqttClient.publish(TOPIC_TEMP, bufTemp);
      mqttClient.publish(TOPIC_VIBRA, statusVibra.c_str());
    }
  }
}

// ==========================================================================
// Coleta amostras com micros(), FFT em cada eixo, retorna RMS total (mm/s)
// ==========================================================================
  float calcularVibracaoPorEixo() {
  const unsigned long intervalo_us = (unsigned long)(1000000.0f / FREQ_AMOSTRAGEM);
  unsigned long tProximo = micros();
  for (uint16_t i = 0; i < AMOSTRAS_FFT; i++) {
    tProximo += intervalo_us;
    sensors_event_t a, g, t;
    mpu.getEvent(&a, &g, &t);
    vRealX[i] = a.acceleration.x - baseX;
    vRealY[i] = a.acceleration.y - baseY;
    vRealZ[i] = a.acceleration.z - baseZ;
    vImagX[i] = 0.0;
    vImagY[i] = 0.0;
    vImagZ[i] = 0.0;
    while (micros() < tProximo) { /* espera ativa */
    }
  }
  float rmsX = calcularRMSdoEixo(vRealX, vImagX, fftX);
  float rmsY = calcularRMSdoEixo(vRealY, vImagY, fftY);
  float rmsZ = calcularRMSdoEixo(vRealZ, vImagZ, fftZ);
  return sqrt(rmsX * rmsX + rmsY * rmsY + rmsZ * rmsZ);
}

// ==========================================================================
// Aplica janela + FFT + integração espectral em um eixo → RMS (mm/s)
// ==========================================================================
  float calcularRMSdoEixo(double* vReal, double* vImag, ArduinoFFT<double>& fft) {
  fft.windowing(FFTWindow::Hann, FFTDirection::Forward);
  fft.compute(FFTDirection::Forward);
  fft.complexToMagnitude();
  float somaQuadrados = 0.0f;
  uint16_t metade = AMOSTRAS_FFT / 2;
  for (uint16_t i = 1; i < metade; i++) {
    float frequencia = (i * FREQ_AMOSTRAGEM) / AMOSTRAS_FFT;
    float amplitude = vReal[i] / (AMOSTRAS_FFT / 2.0f);
    float velocidade = (amplitude / (2.0f * PI * frequencia)) * 1000.0f;
    somaQuadrados += velocidade * velocidade;
  }
  return sqrt(somaQuadrados);
}

// ==========================================================================
// Classificação ISO 10816-3
// ==========================================================================
  String classificarVibracao(float rmsMMpS) {
  if (rmsMMpS < LIMIAR_NORMAL) return "NORMAL";
  if (rmsMMpS < LIMIAR_ATENCAO) return "ATENCAO";
  if (rmsMMpS < LIMIAR_ALERTA) return "ALERTA";
  return "CRITICO";
}

// ==========================================================================
// Conexão MQTT — não bloqueante (tenta uma vez por chamada)
// ==========================================================================
  void conectarMQTT() {
  // Só tenta se tem pelo menos 1 cliente conectado no AP
  if (WiFi.softAPgetStationNum() == 0) return;
  Serial.print("Conectando ao MQTT (notebook)... ");
  if (mqttClient.connect(MQTT_CLIENT)) {
    Serial.println("OK!");
  } else {
    Serial.printf("falha (rc=%d) — tentando no proximo ciclo\n", mqttClient.state());
  }
}