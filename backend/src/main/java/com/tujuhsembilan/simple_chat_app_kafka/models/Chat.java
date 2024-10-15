package com.tujuhsembilan.simple_chat_app_kafka.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Document(collection = "chat")
public class Chat {
    @Id
    private String id;
    private String sender;
    private String receiver;
    private String message;
}
