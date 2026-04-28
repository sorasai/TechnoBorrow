package com.example.testapi.borrowing;

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

    @PostMapping("/{id}/borrow")
    public ResponseEntity<BorrowingRequestDTO> confirmBorrow(@PathVariable Long id) {
        BorrowingRequestDTO updated = borrowingRequestService.confirmBorrow(id);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<BorrowingRequestDTO> confirmReturn(@PathVariable Long id, @RequestParam Long userId) {
        BorrowingRequestDTO updated = borrowingRequestService.confirmReturn(id, userId);
        return ResponseEntity.ok(updated);
    }
}
