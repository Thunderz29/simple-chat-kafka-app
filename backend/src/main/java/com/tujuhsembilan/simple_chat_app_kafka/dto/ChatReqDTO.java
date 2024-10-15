package com.tujuhsembilan.simple_chat_app_kafka.dto;

import lombok.Data;

@Data
public class ChatReqDTO {
    private String sender;
    private String receiver;
    private String message;
}
