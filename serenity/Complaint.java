package com.serenity.entity.society;

import com.serenity.constant.society.ComplaintPriority;
import com.serenity.constant.society.ComplaintStatus;
import com.serenity.constant.society.ComplaintType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long societyId;

    @Column(nullable = false)
    private Long blockId;

    @Column(nullable = false)
    private Long unitId;

    @Column(nullable = false)
    private Long appUserId;

    private boolean defaulter;

    @Column(nullable = false, length = 2000)
    private String details;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintPriority priority; // LOW, MEDIUM, HIGH, CRITICAL

    private Long assignedToUserId;
    private Long assignedByUserId;
    private LocalDateTime assignedDate;

    private Long attendedByUserId;
    private LocalDateTime attendedDate;

    @Column(length = 2000)
    private String resolutionDetails;
    private LocalDateTime resolutionDate;

    private int reopeningCount;
    private int escalationLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status; // OPEN, IN_PROGRESS, RESOLVED, REOPENED, CLOSED

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintType type;

    @ElementCollection
    @CollectionTable(name = "complaint_attachments", joinColumns = @JoinColumn(name = "complaint_id"))
    @Column(name = "attachment_url")
    private List<String> attachments;

    @ElementCollection
    @CollectionTable(name = "complaint_comments", joinColumns = @JoinColumn(name = "complaint_id"))
    @Column(name = "comment")
    private List<String> comments;

    private LocalDateTime lastUpdated;
    private String lastUpdatedBy;

    private String createdBy;
    private LocalDateTime createdDate;

    public void addComment(String comment) {
        if (comment != null && !comment.trim().isEmpty()) {
            this.comments.add(comment);
        } else {
            throw new IllegalArgumentException("Comment cannot be null or empty");
        }
    }

    public String getHistory() {
        StringBuilder history = new StringBuilder();
        history.append("Complaint ID: ").append(id).append("\n")
               .append("Created By: ").append(createdBy).append("\n")
               .append("Complaint Type: ").append(type).append("\n")
               .append("Details: ").append(details).append("\n")
               .append("Status: ").append(status).append("\n")
               .append("Priority: ").append(priority).append("\n")
               .append("Assigned To: ").append(assignedToUserId).append("\n")
               .append("Comments:\n");
        for (String comment : comments) {
            history.append("- ").append(comment).append("\n");
        }
        return history.toString();
    }
}
