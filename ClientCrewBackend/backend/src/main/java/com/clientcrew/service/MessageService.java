package com.clientcrew.service;

import java.util.List;

import com.clientcrew.dto.ChatContactResponse;
import com.clientcrew.dto.MessageRequest;
import com.clientcrew.dto.MessageResponse;

public interface MessageService {

    List<ChatContactResponse> getAllowedContacts();

    List<MessageResponse> getConversation(Long otherUserId);

    MessageResponse sendMessage(MessageRequest request);

    void markMessagesAsRead(Long senderId);

    long getUnreadMessageCount();

    List<MessageResponse> getRecentMessages();
}