package com.smartrentalmanagement.controller;

import com.smartrentalmanagement.dto.ApiResponse;
import com.smartrentalmanagement.dto.TenantDTO;
import com.smartrentalmanagement.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TenantDTO>>> getAllTenants(@RequestParam(required = false) String query) {
        List<TenantDTO> tenants = tenantService.getAllTenants(query);
        return ResponseEntity.ok(ApiResponse.success("Tenants retrieved successfully", tenants));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TenantDTO>> getTenantById(@PathVariable Long id) {
        TenantDTO tenant = tenantService.getTenantById(id);
        return ResponseEntity.ok(ApiResponse.success("Tenant retrieved successfully", tenant));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TenantDTO>> createTenant(@Valid @RequestBody TenantDTO tenantDTO) {
        TenantDTO created = tenantService.createTenant(tenantDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tenant created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TenantDTO>> updateTenant(
            @PathVariable Long id,
            @Valid @RequestBody TenantDTO tenantDTO) {
        TenantDTO updated = tenantService.updateTenant(id, tenantDTO);
        return ResponseEntity.ok(ApiResponse.success("Tenant updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTenant(@PathVariable Long id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok(ApiResponse.success("Tenant deleted successfully"));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TenantDTO>> assignTenant(
            @PathVariable Long id,
            @RequestParam(required = false) Long propertyId) {
        TenantDTO updated = tenantService.assignTenantToProperty(id, propertyId);
        return ResponseEntity.ok(ApiResponse.success(
                propertyId == null ? "Tenant unassigned from property successfully" : "Tenant assigned to property successfully", 
                updated));
    }
}
