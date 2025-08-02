package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRegionOrderByTimestampAsc(String region);
    
    List<ChatMessage> findByReceiverId(Long receiverId);
    
    List<ChatMessage> findBySenderId(Long senderId);
}
