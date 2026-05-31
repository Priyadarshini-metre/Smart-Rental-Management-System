package com.smartrentalmanagement.repository;

import com.smartrentalmanagement.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Boolean existsByEmail(String email);
    List<Tenant> findByPropertyId(Long propertyId);

    @Query("SELECT t FROM Tenant t WHERE " +
            "(:query IS NULL OR :query = '' OR " +
            "LOWER(t.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Tenant> searchTenants(@Param("query") String query);
}
