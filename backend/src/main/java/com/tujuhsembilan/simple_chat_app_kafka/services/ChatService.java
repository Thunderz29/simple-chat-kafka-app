package com.tujuhsembilan.simple_chat_app_kafka.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tujuhsembilan.simple_chat_app_kafka.dto.ChatReqDTO;
import com.tujuhsembilan.simple_chat_app_kafka.models.Chat;
import com.tujuhsembilan.simple_chat_app_kafka.repositories.ChatRepository;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public List<Chat> getChat() {
        return chatRepository.findAll();
    }

    public String insertChat(ChatReqDTO postChatRequest) {
        chatRepository.insert(Chat.builder()
                .sender(postChatRequest.getSender())
                .receiver(postChatRequest.getReceiver())
                .message(postChatRequest.getMessage())
                .build());
        return "success";
    }
}