package com.smartrentalmanagement.service.impl;

import com.smartrentalmanagement.dto.TenantDTO;
import com.smartrentalmanagement.entity.Property;
import com.smartrentalmanagement.entity.Tenant;
import com.smartrentalmanagement.exception.BadRequestException;
import com.smartrentalmanagement.exception.ResourceNotFoundException;
import com.smartrentalmanagement.repository.PropertyRepository;
import com.smartrentalmanagement.repository.TenantRepository;
import com.smartrentalmanagement.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TenantServiceImpl implements TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TenantDTO> getAllTenants(String query) {
        List<Tenant> tenants = tenantRepository.searchTenants(query);
        return tenants.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TenantDTO getTenantById(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + id));
        return mapToDTO(tenant);
    }

    @Override
    @Transactional
    public TenantDTO createTenant(TenantDTO tenantDTO) {
        if (tenantRepository.existsByEmail(tenantDTO.getEmail())) {
            throw new BadRequestException("Email is already in use by another tenant");
        }
        Tenant tenant = mapToEntity(tenantDTO);
        tenant.setStatus("INACTIVE"); // Default
        
        if (tenantDTO.getPropertyId() != null) {
            Property property = propertyRepository.findById(tenantDTO.getPropertyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + tenantDTO.getPropertyId()));
            tenant.setProperty(property);
            tenant.setStatus("ACTIVE");
            property.setStatus("OCCUPIED");
            propertyRepository.save(property);
        }

        Tenant savedTenant = tenantRepository.save(tenant);
        return mapToDTO(savedTenant);
    }

    @Override
    @Transactional
    public TenantDTO updateTenant(Long id, TenantDTO tenantDTO) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + id));

        // Check email uniqueness if email has changed
        if (!tenant.getEmail().equalsIgnoreCase(tenantDTO.getEmail()) &&
                tenantRepository.existsByEmail(tenantDTO.getEmail())) {
            throw new BadRequestException("Email is already in use by another tenant");
        }

        tenant.setFirstName(tenantDTO.getFirstName());
        tenant.setLastName(tenantDTO.getLastName());
        tenant.setEmail(tenantDTO.getEmail());
        tenant.setPhone(tenantDTO.getPhone());
        tenant.setIdProof(tenantDTO.getIdProof());

        // Manage property assignment update
        if (tenantDTO.getPropertyId() != null) {
            if (tenant.getProperty() == null || !tenant.getProperty().getId().equals(tenantDTO.getPropertyId())) {
                // Free previous property if existed
                if (tenant.getProperty() != null) {
                    Property oldProp = tenant.getProperty();
                    oldProp.setStatus("VACANT");
                    propertyRepository.save(oldProp);
                }
                Property newProp = propertyRepository.findById(tenantDTO.getPropertyId())
                        .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + tenantDTO.getPropertyId()));
                tenant.setProperty(newProp);
                tenant.setStatus("ACTIVE");
                newProp.setStatus("OCCUPIED");
                propertyRepository.save(newProp);
            }
        } else {
            // Unassign property if it was assigned
            if (tenant.getProperty() != null) {
                Property oldProp = tenant.getProperty();
                oldProp.setStatus("VACANT");
                propertyRepository.save(oldProp);
                tenant.setProperty(null);
                tenant.setStatus("INACTIVE");
            }
        }

        Tenant updatedTenant = tenantRepository.save(tenant);
        return mapToDTO(updatedTenant);
    }

    @Override
    @Transactional
    public void deleteTenant(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + id));
        
        // Free property if assigned
        if (tenant.getProperty() != null) {
            Property property = tenant.getProperty();
            property.setStatus("VACANT");
            propertyRepository.save(property);
        }

        tenantRepository.delete(tenant);
    }

    @Override
    @Transactional
    public TenantDTO assignTenantToProperty(Long tenantId, Long propertyId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + tenantId));

        if (propertyId == null) {
            // Unassign
            if (tenant.getProperty() != null) {
                Property property = tenant.getProperty();
                property.setStatus("VACANT");
                propertyRepository.save(property);
                tenant.setProperty(null);
                tenant.setStatus("INACTIVE");
            }
        } else {
            Property property = propertyRepository.findById(propertyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

            if ("OCCUPIED".equalsIgnoreCase(property.getStatus()) && 
                (tenant.getProperty() == null || !tenant.getProperty().getId().equals(propertyId))) {
                throw new BadRequestException("Property is already occupied");
            }

            // Free old property if assigned
            if (tenant.getProperty() != null && !tenant.getProperty().getId().equals(propertyId)) {
                Property oldProp = tenant.getProperty();
                oldProp.setStatus("VACANT");
                propertyRepository.save(oldProp);
            }

            tenant.setProperty(property);
            tenant.setStatus("ACTIVE");
            property.setStatus("OCCUPIED");
            propertyRepository.save(property);
        }

        Tenant updatedTenant = tenantRepository.save(tenant);
        return mapToDTO(updatedTenant);
    }

    private TenantDTO mapToDTO(Tenant tenant) {
        return TenantDTO.builder()
                .id(tenant.getId())
                .firstName(tenant.getFirstName())
                .lastName(tenant.getLastName())
                .email(tenant.getEmail())
                .phone(tenant.getPhone())
                .idProof(tenant.getIdProof())
                .propertyId(tenant.getProperty() != null ? tenant.getProperty().getId() : null)
                .propertyName(tenant.getProperty() != null ? tenant.getProperty().getName() : null)
                .status(tenant.getStatus())
                .build();
    }

    private Tenant mapToEntity(TenantDTO dto) {
        return Tenant.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .idProof(dto.getIdProof())
                .status(dto.getStatus())
                .build();
    }
}
