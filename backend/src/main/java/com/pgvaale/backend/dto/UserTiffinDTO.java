package com.pgvaale.backend.dto;

import com.pgvaale.backend.entity.UserTiffin;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTiffinDTO {
    private Long id;
    private Long userId;
    private Long tiffinId;
    private String userName;
    private String tiffinName;
    private String status;
    private LocalDateTime assignedDateTime;
    private LocalDateTime deletionDateTime;
    
    public static UserTiffinDTO fromEntity(UserTiffin userTiffin) {
        return UserTiffinDTO.builder()
                .id(userTiffin.getId())
                .userId(userTiffin.getUser().getId())
                .tiffinId(userTiffin.getTiffin().getId())
                .userName(userTiffin.getUser().getName())
                .tiffinName(userTiffin.getTiffin().getName())
                .status(userTiffin.getStatus().name())
                .assignedDateTime(userTiffin.getAssignedDateTime())
                .deletionDateTime(userTiffin.getDeletionDateTime())
                .build();
    }
} 