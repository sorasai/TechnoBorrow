package com.example.testapi.service;

import com.example.testapi.dto.BorrowingRequestDTO;
import com.example.testapi.dto.CreateBorrowingRequestDTO;
import com.example.testapi.model.BorrowingRequest;
import com.example.testapi.model.User;
import com.example.testapi.repository.BorrowingRequestRepository;
import com.example.testapi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowingRequestService {

    private final BorrowingRequestRepository borrowingRequestRepository;
    private final UserRepository userRepository;

    public BorrowingRequestService(BorrowingRequestRepository borrowingRequestRepository, UserRepository userRepository) {
        this.borrowingRequestRepository = borrowingRequestRepository;
        this.userRepository = userRepository;
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

        BorrowingRequest saved = borrowingRequestRepository.save(request);
        return mapToDTO(saved);
    }

    public List<BorrowingRequestDTO> getAllRequests() {
        return borrowingRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BorrowingRequestDTO mapToDTO(BorrowingRequest request) {
        BorrowingRequestDTO dto = new BorrowingRequestDTO();
        dto.setId(request.getId());
        dto.setItemName(request.getItemName());
        dto.setDescription(request.getDescription());
        dto.setRequesterName(request.getRequester().getFullName());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setStatus(request.getStatus());
        return dto;
    }
}
