package com.example.testapi.borrowing;

import java.time.LocalDateTime;

public class BorrowingRequestDTO {
    private Long id;
    private String itemName;
    private String description;
    private String purpose;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private byte[] itemImage;
    private String requesterName;
    private byte[] requesterImage;
    private LocalDateTime createdAt;
    private String status;
    private Long requesterId;
    private int offerCount;

    public int getOfferCount() {
        return offerCount;
    }

    public void setOfferCount(int offerCount) {
        this.offerCount = offerCount;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public byte[] getItemImage() { return itemImage; }
    public void setItemImage(byte[] itemImage) { this.itemImage = itemImage; }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public byte[] getRequesterImage() {
        return requesterImage;
    }

    public void setRequesterImage(byte[] requesterImage) {
        this.requesterImage = requesterImage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
