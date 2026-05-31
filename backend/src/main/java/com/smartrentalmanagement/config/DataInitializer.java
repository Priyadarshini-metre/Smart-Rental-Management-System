package com.smartrentalmanagement.config;

import com.smartrentalmanagement.entity.*;
import com.smartrentalmanagement.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if database is empty of users
        if (userRepository.count() == 0) {
            logger.info("Seeding database with default records...");

            // Seed Users
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@smartrental.com")
                    .fullName("System Administrator")
                    .role(Role.ADMIN)
                    .build();

            User user = User.builder()
                    .username("johndoe")
                    .password(passwordEncoder.encode("user123"))
                    .email("john@smartrental.com")
                    .fullName("John Doe")
                    .role(Role.USER)
                    .build();

            userRepository.saveAll(List.of(admin, user));

            // Seed Properties
            Property prop1 = Property.builder()
                    .name("Sunset Luxury Apartment")
                    .address("102 Ocean Drive")
                    .location("Miami")
                    .description("A beautiful 2-bedroom luxury apartment with ocean views and access to private pool.")
                    .type("Apartment")
                    .rentAmount(2500.0)
                    .status("OCCUPIED")
                    .imageUrl("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop")
                    .build();

            Property prop2 = Property.builder()
                    .name("Cozy Suburban House")
                    .address("455 Maple Avenue")
                    .location("Chicago")
                    .description("Charming 3-bedroom, 2-bathroom house with a spacious backyard and garage.")
                    .type("House")
                    .rentAmount(1800.0)
                    .status("OCCUPIED")
                    .imageUrl("https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop")
                    .build();

            Property prop3 = Property.builder()
                    .name("Modern Downtown Studio")
                    .address("88 Broadway Street")
                    .location("New York")
                    .description("Compact studio apartment in the heart of Manhattan. Walkable to major subway lines.")
                    .type("Apartment")
                    .rentAmount(3200.0)
                    .status("VACANT")
                    .imageUrl("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop")
                    .build();

            Property prop4 = Property.builder()
                    .name("Quiet Room Near University")
                    .address("12 University Road")
                    .location("Boston")
                    .description("Single private room in a shared student townhouse. Shared kitchen and bathroom.")
                    .type("Room")
                    .rentAmount(750.0)
                    .status("VACANT")
                    .imageUrl("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop")
                    .build();

            propertyRepository.saveAll(List.of(prop1, prop2, prop3, prop4));

            // Seed Tenants
            Tenant tenant1 = Tenant.builder()
                    .firstName("Emily")
                    .lastName("Smith")
                    .email("emily.smith@example.com")
                    .phone("+1-555-0199")
                    .idProof("DL-99887766")
                    .property(prop1)
                    .status("ACTIVE")
                    .build();

            Tenant tenant2 = Tenant.builder()
                    .firstName("Michael")
                    .lastName("Johnson")
                    .email("michael.j@example.com")
                    .phone("+1-555-0144")
                    .idProof("PASS-11223344")
                    .property(prop2)
                    .status("ACTIVE")
                    .build();

            Tenant tenant3 = Tenant.builder()
                    .firstName("Sarah")
                    .lastName("Williams")
                    .email("sarah.w@example.com")
                    .phone("+1-555-0177")
                    .idProof("DL-44332211")
                    .property(null)
                    .status("INACTIVE")
                    .build();

            tenantRepository.saveAll(List.of(tenant1, tenant2, tenant3));

            // Seed Bookings
            Booking booking1 = Booking.builder()
                    .property(prop1)
                    .tenant(tenant1)
                    .startDate(LocalDate.now().minusMonths(5))
                    .endDate(LocalDate.now().plusMonths(7))
                    .monthlyRent(2500.0)
                    .status("ACTIVE")
                    .build();

            Booking booking2 = Booking.builder()
                    .property(prop2)
                    .tenant(tenant2)
                    .startDate(LocalDate.now().minusMonths(2))
                    .endDate(LocalDate.now().plusYears(1))
                    .monthlyRent(1800.0)
                    .status("ACTIVE")
                    .build();

            bookingRepository.saveAll(List.of(booking1, booking2));

            // Seed Payments
            Payment p1 = Payment.builder().booking(booking1).amount(2500.0).paymentDate(LocalDate.now().minusMonths(4)).paymentMethod("Bank Transfer").status("PAID").build();
            Payment p2 = Payment.builder().booking(booking1).amount(2500.0).paymentDate(LocalDate.now().minusMonths(3)).paymentMethod("Bank Transfer").status("PAID").build();
            Payment p3 = Payment.builder().booking(booking1).amount(2500.0).paymentDate(LocalDate.now().minusMonths(2)).paymentMethod("Bank Transfer").status("PAID").build();
            Payment p4 = Payment.builder().booking(booking1).amount(2500.0).paymentDate(LocalDate.now().minusMonths(1)).paymentMethod("Bank Transfer").status("PAID").build();
            Payment p5 = Payment.builder().booking(booking1).amount(2500.0).paymentDate(LocalDate.now()).paymentMethod("Bank Transfer").status("PAID").build();

            Payment p6 = Payment.builder().booking(booking2).amount(1800.0).paymentDate(LocalDate.now().minusMonths(1)).paymentMethod("Credit Card").status("PAID").build();
            Payment p7 = Payment.builder().booking(booking2).amount(1800.0).paymentDate(LocalDate.now()).paymentMethod("Credit Card").status("PAID").build();

            paymentRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7));

            logger.info("Seeding completed successfully.");
        } else {
            logger.info("Users already present. Skipping database seeding.");
        }
    }
}
