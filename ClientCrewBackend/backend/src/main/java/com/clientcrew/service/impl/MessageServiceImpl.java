package com.clientcrew.service.impl;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.clientcrew.dto.ChatContactResponse;
import com.clientcrew.dto.MessageRequest;
import com.clientcrew.dto.MessageResponse;
import com.clientcrew.entity.ActivityType;
import com.clientcrew.entity.Message;
import com.clientcrew.entity.Project;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.User;
import com.clientcrew.repository.MessageRepository;
import com.clientcrew.repository.ProjectRepository;
import com.clientcrew.repository.UserRepository;
import com.clientcrew.service.ActivityLogService;
import com.clientcrew.service.MessageService;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ActivityLogService activityLogService;

    public MessageServiceImpl(
            MessageRepository messageRepository,
            UserRepository userRepository,
            ProjectRepository projectRepository,
            ActivityLogService activityLogService
    ) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.activityLogService = activityLogService;
    }

    @Override
    public List<ChatContactResponse> getAllowedContacts() {
        User loggedInUser = getLoggedInUser();

        Set<User> contacts = new LinkedHashSet<>();

        if (loggedInUser.getUserRole() == Role.ADMIN) {
            contacts.addAll(userRepository.findByUserRole(Role.MANAGER));
            contacts.addAll(userRepository.findByUserRole(Role.EMPLOYEE));
            contacts.addAll(userRepository.findByUserRole(Role.CUSTOMER));
        }

        else if (loggedInUser.getUserRole() == Role.MANAGER) {
            addAdmins(contacts);

            List<Project> projects =
                    projectRepository.findByAssignedEmployees_UserEmail(
                            loggedInUser.getUserEmail()
                    );

            for (Project project : projects) {
                addUserByEmail(contacts, project.getCustomerEmail());
                contacts.addAll(project.getAssignedEmployees());
            }
        }

        else if (loggedInUser.getUserRole() == Role.EMPLOYEE) {
            addAdmins(contacts);

            List<Project> projects =
                    projectRepository.findByAssignedEmployees_UserEmail(
                            loggedInUser.getUserEmail()
                    );

            for (Project project : projects) {
                addUserByEmail(contacts, project.getManagerEmail());
                addUserByEmail(contacts, project.getCustomerEmail());
                contacts.addAll(project.getAssignedEmployees());
            }
        }

        else if (loggedInUser.getUserRole() == Role.CUSTOMER) {
            addAdmins(contacts);

            List<Project> projects =
                    projectRepository.findByCustomerEmail(
                            loggedInUser.getUserEmail()
                    );

            for (Project project : projects) {
                addUserByEmail(contacts, project.getManagerEmail());
                contacts.addAll(project.getAssignedEmployees());
            }
        }

        contacts.removeIf(user ->
                user.getUserId().equals(loggedInUser.getUserId())
        );

        return contacts.stream()
                .map(user -> toContactResponse(user, loggedInUser))
                .sorted((a, b) -> {
                    if (a.getLastMessageTime() == null && b.getLastMessageTime() == null) {
                        return 0;
                    }

                    if (a.getLastMessageTime() == null) {
                        return 1;
                    }

                    if (b.getLastMessageTime() == null) {
                        return -1;
                    }

                    return b.getLastMessageTime().compareTo(a.getLastMessageTime());
                })
                .toList();
    }

    @Override
    public List<MessageResponse> getConversation(Long otherUserId) {
        User loggedInUser = getLoggedInUser();

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("Selected user not found"));

        if (!isAllowedToChat(loggedInUser, otherUser)) {
            throw new RuntimeException("You are not allowed to view this conversation");
        }

        return messageRepository
                .findConversation(loggedInUser.getUserId(), otherUserId)
                .stream()
                .map(this::toMessageResponse)
                .toList();
    }

    @Override
    public MessageResponse sendMessage(MessageRequest request) {
        User sender = getLoggedInUser();

        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new RuntimeException("Message content cannot be empty");
        }

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (!isAllowedToChat(sender, receiver)) {
            throw new RuntimeException("You are not allowed to message this user");
        }

        Project project = null;

        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setProject(project);
        message.setContent(request.getContent().trim());

        Message savedMessage = messageRepository.save(message);

        activityLogService.createActivity(
                ActivityType.MESSAGE_SENT,
                "MESSAGE",
                savedMessage.getMessageId(),
                receiver.getUserFullName(),
                sender.getUserEmail().equalsIgnoreCase(receiver.getUserEmail())
                ? "New message received"
                : "New message sent",
                sender.getUserFullName()
                + " sent a message to "
                + receiver.getUserFullName(),
                null,
                request.getContent(),
                sender,
                project != null ? project.getManagerEmail() : null,
                project != null ? project.getCustomerEmail() : null,
                receiver.getUserEmail()
        );

        return toMessageResponse(savedMessage);
    }

    @Override
    public void markMessagesAsRead(Long senderId) {
        User loggedInUser = getLoggedInUser();

        List<Message> unreadMessages =
                messageRepository.findByReceiver_UserIdAndSender_UserIdAndReadStatusFalse(
                        loggedInUser.getUserId(),
                        senderId
                );

        for (Message message : unreadMessages) {
            message.setReadStatus(true);
        }

        messageRepository.saveAll(unreadMessages);
    }

    @Override
    public long getUnreadMessageCount() {
        User loggedInUser = getLoggedInUser();

        return messageRepository
                .countByReceiver_UserIdAndReadStatusFalse(
                        loggedInUser.getUserId()
                );
    }

    @Override
    public List<MessageResponse> getRecentMessages() {
        User loggedInUser = getLoggedInUser();

        return messageRepository
                .findTop10ByReceiver_UserIdOrderBySentAtDesc(
                        loggedInUser.getUserId()
                )
                .stream()
                .map(this::toMessageResponse)
                .toList();
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));
    }

    private void addAdmins(Set<User> contacts) {
        contacts.addAll(userRepository.findByUserRole(Role.ADMIN));
    }

    private void addUserByEmail(Set<User> contacts, String email) {
        if (email != null && !email.isBlank()) {
            userRepository.findByUserEmail(email)
                    .ifPresent(contacts::add);
        }
    }

    private boolean isAllowedToChat(User loggedInUser, User otherUser) {
        return getAllowedContacts()
                .stream()
                .anyMatch(contact ->
                        contact.getUserId().equals(otherUser.getUserId())
                );
    }

    private ChatContactResponse toContactResponse(
            User user,
            User loggedInUser
    ) {
        long unreadCount =
                messageRepository
                        .countByReceiver_UserIdAndSender_UserIdAndReadStatusFalse(
                                loggedInUser.getUserId(),
                                user.getUserId()
                        );

        List<Message> latestMessages =
                messageRepository.findLatestConversationMessage(
                        loggedInUser.getUserId(),
                        user.getUserId()
                );

        Message latestMessage =
                latestMessages.isEmpty() ? null : latestMessages.get(0);

        return new ChatContactResponse(
                user.getUserId(),
                user.getUserFullName(),
                user.getUserEmail(),
                user.getUserRole().name(),
                user.getUserImage(),
                unreadCount,
                latestMessage != null ? latestMessage.getContent() : null,
                latestMessage != null ? latestMessage.getSentAt() : null
        );
    }

    private MessageResponse toMessageResponse(Message message) {
        Project project = message.getProject();

        return new MessageResponse(
                message.getMessageId(),

                message.getSender().getUserId(),
                message.getSender().getUserFullName(),
                message.getSender().getUserEmail(),
                message.getSender().getUserRole().name(),

                message.getReceiver().getUserId(),
                message.getReceiver().getUserFullName(),
                message.getReceiver().getUserEmail(),
                message.getReceiver().getUserRole().name(),

                project != null ? project.getId() : null,
                project != null ? project.getProjectName() : null,

                message.getContent(),
                message.getSentAt(),
                message.isReadStatus()
        );
    }
}