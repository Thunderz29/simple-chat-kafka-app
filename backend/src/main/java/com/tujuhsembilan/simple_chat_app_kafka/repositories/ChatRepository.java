package com.tujuhsembilan.simple_chat_app_kafka.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tujuhsembilan.simple_chat_app_kafka.models.Chat;

public interface ChatRepository extends MongoRepository<Chat, String> {
}
