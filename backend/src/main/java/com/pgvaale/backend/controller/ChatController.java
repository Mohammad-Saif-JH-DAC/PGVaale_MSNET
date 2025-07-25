package com.pgvaale.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;

// Import ChatMessageRepository and ChatMessage
import com.pgvaale.backend.repository.ChatMessageRepository;
import com.pgvaale.backend.entity.ChatMessage;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatRepo;

    @PostMapping("/message")
    public ResponseEntity<ChatMessage> saveMessage(@RequestBody ChatMessage message) {
        return ResponseEntity.ok(chatRepo.save(message));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@RequestParam String region) {
        return ResponseEntity.ok(chatRepo.findByRegionOrderByTimestampAsc(region));
    }
}
