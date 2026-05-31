package com.smartrentalmanagement.service;

import com.smartrentalmanagement.dto.TenantDTO;
import java.util.List;

public interface TenantService {
    List<TenantDTO> getAllTenants(String query);
    TenantDTO getTenantById(Long id);
    TenantDTO createTenant(TenantDTO tenantDTO);
    TenantDTO updateTenant(Long id, TenantDTO tenantDTO);
    void deleteTenant(Long id);
    TenantDTO assignTenantToProperty(Long tenantId, Long propertyId);
}
