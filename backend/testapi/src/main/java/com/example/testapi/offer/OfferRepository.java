package com.example.testapi.offer;


import com.example.testapi.borrowing.BorrowingRequest;
import com.example.testapi.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    boolean existsByBorrowingRequestAndLender(BorrowingRequest borrowingRequest, User lender);

    List<Offer> findByBorrowingRequestIdOrderByCreatedAtDesc(Long borrowingRequestId);

    boolean existsByBorrowingRequestAndStatus(BorrowingRequest borrowingRequest, String status);

    long countByBorrowingRequestId(Long borrowingRequestId);
}
