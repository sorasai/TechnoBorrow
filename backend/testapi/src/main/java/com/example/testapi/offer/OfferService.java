package com.example.testapi.offer;



import com.example.testapi.borrowing.BorrowingRequest;

import com.example.testapi.auth.User;
import com.example.testapi.borrowing.BorrowingRequestRepository;

import com.example.testapi.auth.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfferService {

    private final OfferRepository offerRepository;
    private final BorrowingRequestRepository borrowingRequestRepository;
    private final UserRepository userRepository;

    public OfferService(OfferRepository offerRepository, BorrowingRequestRepository borrowingRequestRepository, UserRepository userRepository) {
        this.offerRepository = offerRepository;
        this.borrowingRequestRepository = borrowingRequestRepository;
        this.userRepository = userRepository;
    }

    public OfferDTO createOffer(CreateOfferDTO createOfferDTO) {
        BorrowingRequest request = borrowingRequestRepository.findById(createOfferDTO.getRequestId())
                .orElseThrow(() -> new RuntimeException("Borrowing Request not found"));

        if (!"POSTED".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Cannot offer. Request is no longer POSTED.");
        }

        User lender = userRepository.findById(createOfferDTO.getLenderId())
                .orElseThrow(() -> new RuntimeException("Lender not found"));

        if (request.getRequester().getId().equals(lender.getId())) {
            throw new RuntimeException("Cannot offer to your own request.");
        }

        if (offerRepository.existsByBorrowingRequestAndLender(request, lender)) {
            throw new RuntimeException("You have already submitted an offer for this request.");
        }

        if (offerRepository.existsByBorrowingRequestAndStatus(request, "ACCEPTED")) {
            throw new RuntimeException("This request already has an accepted offer.");
        }

        Offer offer = new Offer();
        offer.setBorrowingRequest(request);
        offer.setLender(lender);
        offer.setMessage(createOfferDTO.getMessage());
        offer.setStatus("PENDING");

        Offer savedOffer = offerRepository.save(offer);
        return mapToDTO(savedOffer);
    }

    public List<OfferDTO> getOffersForRequest(Long requestId) {
        return offerRepository.findByBorrowingRequestIdOrderByCreatedAtDesc(requestId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<OfferDTO> getOffersForUser(Long userId) {
        return offerRepository.findByLenderIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public OfferDTO acceptOffer(Long offerId) {
        Offer offerToAccept = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        if (!"PENDING".equalsIgnoreCase(offerToAccept.getStatus())) {
            throw new RuntimeException("Only PENDING offers can be accepted.");
        }

        BorrowingRequest request = offerToAccept.getBorrowingRequest();
        if (!"POSTED".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Cannot accept offer. Request is no longer POSTED.");
        }

        // Accept the selected offer
        offerToAccept.setStatus("ACCEPTED");
        Offer savedOffer = offerRepository.save(offerToAccept);

        // Reject all other offers for this request
        List<Offer> allOffers = offerRepository.findByBorrowingRequest(request);
        for (Offer o : allOffers) {
            if (!o.getId().equals(offerId) && "PENDING".equalsIgnoreCase(o.getStatus())) {
                o.setStatus("REJECTED");
                offerRepository.save(o);
            }
        }

        // Update the BorrowingRequest status
        request.setStatus("MATCHED");
        borrowingRequestRepository.save(request);

        return mapToDTO(savedOffer);
    }

    private OfferDTO mapToDTO(Offer offer) {
        OfferDTO dto = new OfferDTO();
        dto.setId(offer.getId());
        dto.setRequestId(offer.getBorrowingRequest().getId());
        dto.setLenderId(offer.getLender().getId());
        dto.setLenderName(offer.getLender().getFullName());
        dto.setMessage(offer.getMessage());
        dto.setStatus(offer.getStatus());
        dto.setCreatedAt(offer.getCreatedAt());
        return dto;
    }
}
