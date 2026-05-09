package com.clientcrew.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clientcrew.dto.ChatContactResponse;
import com.clientcrew.dto.MessageRequest;
import com.clientcrew.dto.MessageResponse;
import com.clientcrew.service.MessageService;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<ChatContactResponse>> getContacts() {
        return ResponseEntity.ok(messageService.getAllowedContacts());
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(messageService.getConversation(userId));
    }

    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(
            @RequestBody MessageRequest request
    ) {
        return ResponseEntity.ok(messageService.sendMessage(request));
    }

    @PatchMapping("/read/{senderId}")
    public ResponseEntity<String> markMessagesAsRead(
            @PathVariable Long senderId
    ) {
        messageService.markMessagesAsRead(senderId);
        return ResponseEntity.ok("Messages marked as read");
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadMessageCount() {
        return ResponseEntity.ok(messageService.getUnreadMessageCount());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<MessageResponse>> getRecentMessages() {
        return ResponseEntity.ok(messageService.getRecentMessages());
    }
}