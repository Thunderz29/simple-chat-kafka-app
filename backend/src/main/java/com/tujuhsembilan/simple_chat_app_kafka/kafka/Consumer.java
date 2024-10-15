package com.tujuhsembilan.simple_chat_app_kafka.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tujuhsembilan.simple_chat_app_kafka.dto.ChatReqDTO;
import com.tujuhsembilan.simple_chat_app_kafka.services.ChatService;

@Service
public class Consumer {

    @Autowired
    private ChatService chatService;

    @KafkaListener(topics = "chat", groupId = "z")
    public void listen(String message) throws JsonMappingException, JsonProcessingException {
        chatService.insertChat(new ObjectMapper().readValue(message, ChatReqDTO.class));
    }
}
