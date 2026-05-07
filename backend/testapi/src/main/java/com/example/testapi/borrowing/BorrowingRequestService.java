package com.example.testapi.borrowing;

import com.example.testapi.auth.User;
import com.example.testapi.auth.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Base64;

@Service
public class BorrowingRequestService {

    private final BorrowingRequestRepository borrowingRequestRepository;
    private final UserRepository userRepository;
    private final com.example.testapi.offer.OfferRepository offerRepository;

    public BorrowingRequestService(BorrowingRequestRepository borrowingRequestRepository, UserRepository userRepository, com.example.testapi.offer.OfferRepository offerRepository) {
        this.borrowingRequestRepository = borrowingRequestRepository;
        this.userRepository = userRepository;
        this.offerRepository = offerRepository;
    }

    public BorrowingRequestDTO createRequest(CreateBorrowingRequestDTO createDTO) {
        User requester = userRepository.findById(createDTO.getRequesterId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        BorrowingRequest request = new BorrowingRequest();
        request.setRequester(requester);
        request.setItemName(createDTO.getItemName());
        request.setDescription(createDTO.getDescription());
        request.setPurpose(createDTO.getPurpose());
        request.setStartDate(createDTO.getStartDate());
        request.setEndDate(createDTO.getEndDate());
        request.setStatus("POSTED");

        if (createDTO.getItemImage() != null && !createDTO.getItemImage().isEmpty()) {
            request.setItemImage(Base64.getDecoder().decode(createDTO.getItemImage()));
        }

        BorrowingRequest saved = borrowingRequestRepository.save(request);
        return mapToDTO(saved);
    }

    public List<BorrowingRequestDTO> getAllRequests() {
        List<BorrowingRequest> requests = borrowingRequestRepository.findAllByOrderByCreatedAtDesc();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        for (BorrowingRequest request : requests) {
            if ("POSTED".equals(request.getStatus())) {
                if (now.isAfter(request.getStartDate())) {
                    request.setStatus("EXPIRED");
                    borrowingRequestRepository.save(request);
                }
            }
        }

        return requests.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BorrowingRequestDTO confirmBorrow(Long requestId) {
        BorrowingRequest request = borrowingRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Borrowing request not found"));
        if (!"MATCHED".equalsIgnoreCase(request.getStatus()) && !"ONGOING".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Can only confirm receipt for MATCHED requests.");
        }
        request.setStatus("BORROWED");
        BorrowingRequest saved = borrowingRequestRepository.save(request);
        return mapToDTO(saved);
    }

    private BorrowingRequestDTO mapToDTO(BorrowingRequest request) {
        BorrowingRequestDTO dto = new BorrowingRequestDTO();
        dto.setId(request.getId());
        dto.setItemName(request.getItemName());
        dto.setDescription(request.getDescription());
        dto.setPurpose(request.getPurpose());
        dto.setStartDate(request.getStartDate());
        dto.setEndDate(request.getEndDate());
        dto.setItemImage(request.getItemImage());
        dto.setRequesterName(request.getRequester().getFullName());
        dto.setRequesterId(request.getRequester().getId());
        dto.setRequesterImage(request.getRequester().getProfileImage());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setStatus(request.getStatus());
        dto.setOfferCount((int) offerRepository.countByBorrowingRequestId(request.getId()));
        return dto;
    }

    public BorrowingRequestDTO confirmReturn(Long requestId, Long userId) {
        BorrowingRequest request = borrowingRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Borrowing request not found"));

        String currentStatus = request.getStatus().toUpperCase();
        if (!"BORROWED".equals(currentStatus) && 
            !"BORROWER_RETURNED".equals(currentStatus) && 
            !"LENDER_RETURNED".equals(currentStatus)) {
            throw new RuntimeException("Can only return items that are currently BORROWED.");
        }

        boolean isBorrower = request.getRequester().getId().equals(userId);
        
        com.example.testapi.offer.Offer acceptedOffer = offerRepository.findByBorrowingRequest(request)
            .stream()
            .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Accepted offer not found"));
            
        boolean isLender = acceptedOffer.getLender().getId().equals(userId);

        if (!isBorrower && !isLender) {
            throw new RuntimeException("Unauthorized user attempting to confirm return.");
        }

        if (isBorrower) {
            if ("BORROWER_RETURNED".equals(currentStatus)) {
                throw new RuntimeException("You have already marked this item as returned.");
            }
            if ("LENDER_RETURNED".equals(currentStatus)) {
                request.setStatus("RETURNED");
            } else {
                request.setStatus("BORROWER_RETURNED");
            }
        } else {
            if ("LENDER_RETURNED".equals(currentStatus)) {
                throw new RuntimeException("You have already confirmed the return of this item.");
            }
            if ("BORROWER_RETURNED".equals(currentStatus)) {
                request.setStatus("RETURNED");
            } else {
                request.setStatus("LENDER_RETURNED");
            }
        }

        BorrowingRequest saved = borrowingRequestRepository.save(request);
        return mapToDTO(saved);
    }
}
