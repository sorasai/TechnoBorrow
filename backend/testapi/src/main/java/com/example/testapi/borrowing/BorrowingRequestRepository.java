package com.example.testapi.borrowing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowingRequestRepository extends JpaRepository<BorrowingRequest, Long> {
    List<BorrowingRequest> findAllByOrderByCreatedAtDesc();
}
