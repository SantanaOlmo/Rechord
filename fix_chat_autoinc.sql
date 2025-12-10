TRUNCATE TABLE chat_mensajes;
ALTER TABLE chat_mensajes DROP PRIMARY KEY, ADD PRIMARY KEY (id_mensaje), MODIFY id_mensaje int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE chat_mensajes ADD INDEX idx_conversation_fix (id_conversacion);
