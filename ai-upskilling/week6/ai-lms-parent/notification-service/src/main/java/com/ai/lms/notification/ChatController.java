package com.ai.lms.notification;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage message) {
        return message;
    }

    @MessageMapping("/chat.announce")
    @SendTo("/topic/announcements")
    public ChatMessage announce(ChatMessage message) {
        message.setType("ANNOUNCEMENT");
        return message;
    }
} 