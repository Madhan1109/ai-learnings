package com.ai.lms.notification;

public class ChatMessage {
    private String from;
    private String content;
    private String type; // CHAT, JOIN, LEAVE, ANNOUNCEMENT
    private String timestamp;

    // Getters and setters
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
} 