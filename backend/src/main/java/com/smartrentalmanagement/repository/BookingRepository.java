package com.smartrentalmanagement.repository;

import com.smartrentalmanagement.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPropertyId(Long propertyId);
    List<Booking> findByTenantId(Long tenantId);
    List<Booking> findByStatus(String status);
    Optional<Booking> findFirstByPropertyIdAndStatus(Long propertyId, String status);
}
