use predict_guard;

-- =========================
-- EVENT SCHEDULER
-- =========================

set global event_scheduler = on;

create event if not exists ev_limpar_leituras
on schedule every 1 day
starts current_timestamp + interval 1 day
on completion preserve
enable
DO
  delete from leituras
  where data_leitura < now() - interval 30 day;
