package com.tujuhsembilan.simple_chat_app_kafka.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.tujuhsembilan.simple_chat_app_kafka.dto.ChatReqDTO;

@Controller
public class WebSocketController {

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatReqDTO send(ChatReqDTO chatMessage) {
        return chatMessage;
    }
}
