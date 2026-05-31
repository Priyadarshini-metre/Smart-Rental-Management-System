package com.smartrentalmanagement.controller;

import com.smartrentalmanagement.dto.ApiResponse;
import com.smartrentalmanagement.dto.PropertyDTO;
import com.smartrentalmanagement.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PropertyDTO>>> getAllProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minRent,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Page<PropertyDTO> properties = propertyService.getAllProperties(
                location, minRent, maxRent, status, type, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Properties retrieved successfully", properties));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDTO>> getPropertyById(@PathVariable Long id) {
        PropertyDTO property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(ApiResponse.success("Property retrieved successfully", property));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PropertyDTO>> createProperty(@Valid @RequestBody PropertyDTO propertyDTO) {
        PropertyDTO created = propertyService.createProperty(propertyDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Property created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PropertyDTO>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDTO propertyDTO) {
        PropertyDTO updated = propertyService.updateProperty(id, propertyDTO);
        return ResponseEntity.ok(ApiResponse.success("Property updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Property deleted successfully"));
    }
}
