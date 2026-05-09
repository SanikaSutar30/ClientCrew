package com.clientcrew.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.clientcrew.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
        SELECT m FROM Message m
        WHERE 
        (m.sender.userId = :loggedInUserId AND m.receiver.userId = :otherUserId)
        OR
        (m.sender.userId = :otherUserId AND m.receiver.userId = :loggedInUserId)
        ORDER BY m.sentAt ASC
    """)
    List<Message> findConversation(Long loggedInUserId, Long otherUserId);

    @Query("""
        SELECT m FROM Message m
        WHERE 
        (m.sender.userId = :loggedInUserId AND m.receiver.userId = :otherUserId)
        OR
        (m.sender.userId = :otherUserId AND m.receiver.userId = :loggedInUserId)
        ORDER BY m.sentAt DESC
    """)
    List<Message> findLatestConversationMessage(
            Long loggedInUserId,
            Long otherUserId
    );

    List<Message> findByReceiver_UserIdAndSender_UserIdAndReadStatusFalse(
            Long receiverId,
            Long senderId
    );

    long countByReceiver_UserIdAndReadStatusFalse(Long receiverId);

    long countByReceiver_UserIdAndSender_UserIdAndReadStatusFalse(
            Long receiverId,
            Long senderId
    );

    List<Message> findTop10ByReceiver_UserIdOrderBySentAtDesc(Long receiverId);
}