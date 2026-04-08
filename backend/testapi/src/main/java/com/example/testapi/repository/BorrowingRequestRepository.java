package com.example.testapi.repository;

import com.example.testapi.model.BorrowingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowingRequestRepository extends JpaRepository<BorrowingRequest, Long> {
    List<BorrowingRequest> findAllByOrderByCreatedAtDesc();
}
