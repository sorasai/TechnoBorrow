package com.example.testapi.controller;

import com.example.testapi.dto.BorrowingRequestDTO;
import com.example.testapi.dto.CreateBorrowingRequestDTO;
import com.example.testapi.service.BorrowingRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowing-requests")
@CrossOrigin(origins = "*") // Allows all origins, adjust if needed securely
public class BorrowingRequestController {

    private final BorrowingRequestService borrowingRequestService;

    public BorrowingRequestController(BorrowingRequestService borrowingRequestService) {
        this.borrowingRequestService = borrowingRequestService;
    }

    @PostMapping
    public ResponseEntity<BorrowingRequestDTO> createRequest(@RequestBody CreateBorrowingRequestDTO createDTO) {
        BorrowingRequestDTO created = borrowingRequestService.createRequest(createDTO);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<BorrowingRequestDTO>> getAllRequests() {
        List<BorrowingRequestDTO> requests = borrowingRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }
}
