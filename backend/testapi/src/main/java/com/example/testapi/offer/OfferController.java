package com.example.testapi.offer;




import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    public ResponseEntity<?> createOffer(@RequestBody CreateOfferDTO createOfferDTO) {
        try {
            OfferDTO createdOffer = offerService.createOffer(createOfferDTO);
            return ResponseEntity.ok(createdOffer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<OfferDTO>> getOffersForRequest(@PathVariable Long requestId) {
        return ResponseEntity.ok(offerService.getOffersForRequest(requestId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OfferDTO>> getOffersForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(offerService.getOffersForUser(userId));
    }

    @PostMapping("/{offerId}/accept")
    public ResponseEntity<?> acceptOffer(@PathVariable Long offerId) {
        try {
            OfferDTO acceptedOffer = offerService.acceptOffer(offerId);
            return ResponseEntity.ok(acceptedOffer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}