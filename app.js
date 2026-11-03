/**
 * Shifa Hijama & Wellness Center
 * Interactive Features & Appointment Booking System
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Minimum Date setting for Booking (Today onwards)
    const bookingDateInput = document.getElementById('bookingDate');
    if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.setAttribute('min', today);
        // Default to tomorrow or today
        bookingDateInput.value = today;
    }

    // 2. Mobile Drawer Navigation
    const menuToggle = document.getElementById('menuToggle');
    const drawerClose = document.getElementById('drawerClose');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // 3. Service Card "বুক করুন" Click to Auto-Select in Booking Form
    const serviceSelectButtons = document.querySelectorAll('.select-service-btn');
    const serviceTypeSelect = document.getElementById('serviceType');
    const bookingSection = document.getElementById('booking');

    serviceSelectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedService = btn.getAttribute('data-service');
            if (serviceTypeSelect && selectedService) {
                for (let option of serviceTypeSelect.options) {
                    if (option.value === selectedService || option.text.includes(selectedService.split(' ')[0])) {
                        option.selected = true;
                        break;
                    }
                }
            }
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
                // Subtle highlight
                const formCard = document.querySelector('.form-card');
                if (formCard) {
                    formCard.style.boxShadow = '0 0 0 3px rgba(201, 24, 43, 0.3)';
                    setTimeout(() => {
                        formCard.style.boxShadow = '';
                    }, 1200);
                }
            }
        });
    });

    // 4. FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isActive = currentItem.classList.contains('active');

            // Close all
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    });

    // 5. Booking Form Submission & Validation
    const appointmentForm = document.getElementById('appointmentForm');
    const submitBookingBtn = document.getElementById('submitBookingBtn');
    const confirmationModal = document.getElementById('confirmationModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalDoneBtn = document.getElementById('modalDoneBtn');
    const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

    // Modal elements
    const receiptId = document.getElementById('receiptId');
    const receiptName = document.getElementById('receiptName');
    const receiptPhone = document.getElementById('receiptPhone');
    const receiptService = document.getElementById('receiptService');
    const receiptDateTime = document.getElementById('receiptDateTime');
    const receiptGender = document.getElementById('receiptGender');

    function validateField(input, errorElement, validationFn) {
        const isValid = validationFn(input.value.trim());
        if (!isValid) {
            input.classList.add('invalid');
            if (errorElement) errorElement.classList.add('visible');
        } else {
            input.classList.remove('invalid');
            if (errorElement) errorElement.classList.remove('visible');
        }
        return isValid;
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('patientName');
            const phoneInput = document.getElementById('patientPhone');
            const genderInput = document.getElementById('patientGender');
            const serviceInput = document.getElementById('serviceType');
            const dateInput = document.getElementById('bookingDate');
            const timeInput = document.getElementById('timeSlot');
            const noteInput = document.getElementById('healthNote');

            const nameErr = document.getElementById('nameError');
            const phoneErr = document.getElementById('phoneError');
            const genderErr = document.getElementById('genderError');
            const serviceErr = document.getElementById('serviceError');
            const dateErr = document.getElementById('dateError');
            const timeErr = document.getElementById('timeError');

            // Validation rules
            const isNameValid = validateField(nameInput, nameErr, val => val.length >= 3);
            const isPhoneValid = validateField(phoneInput, phoneErr, val => /^01[3-9]\d{8}$/.test(val.replace(/[\s-]/g, '')) || val.length >= 10);
            const isGenderValid = validateField(genderInput, genderErr, val => val !== '');
            const isServiceValid = validateField(serviceInput, serviceErr, val => val !== '');
            const isDateValid = validateField(dateInput, dateErr, val => val !== '');
            const isTimeValid = validateField(timeInput, timeErr, val => val !== '');

            if (!isNameValid || !isPhoneValid || !isGenderValid || !isServiceValid || !isDateValid || !isTimeValid) {
                return;
            }

            // Button loading state
            const btnText = submitBookingBtn.querySelector('.btn-text');
            const btnLoader = submitBookingBtn.querySelector('.btn-loader');
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';
            submitBookingBtn.disabled = true;

            setTimeout(() => {
                // Generate Booking Reference ID
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                const generatedId = `SH-${randomNum}`;

                // Populate modal
                receiptId.textContent = generatedId;
                receiptName.textContent = nameInput.value.trim();
                receiptPhone.textContent = phoneInput.value.trim();
                receiptService.textContent = serviceInput.value;
                receiptDateTime.textContent = `${dateInput.value} (${timeInput.value})`;
                receiptGender.textContent = genderInput.value;

                // Prepare WhatsApp link
                const waMessage = encodeURIComponent(
                    `*শিফা হিজামা অ্যাপয়েন্টমেন্ট বুকিং*\n` +
                    `বুকিং আইডি: ${generatedId}\n` +
                    `রোগীর নাম: ${nameInput.value.trim()}\n` +
                    `মোবাইল: ${phoneInput.value.trim()}\n` +
                    `সেবা: ${serviceInput.value}\n` +
                    `তারিখ ও সময়: ${dateInput.value} (${timeInput.value})\n` +
                    `থেরাপিস্ট: ${genderInput.value}\n` +
                    (noteInput.value.trim() ? `নোট: ${noteInput.value.trim()}\n` : '') +
                    `\nঅনুগ্রহ করে আমার সিরিয়াল কনফার্ম করবেন।`
                );
                modalWhatsAppBtn.href = `https://wa.me/8801700000000?text=${waMessage}`;

                // Open modal
                confirmationModal.classList.add('active');

                // Reset button
                btnText.style.display = 'inline-flex';
                btnLoader.style.display = 'none';
                submitBookingBtn.disabled = false;

                // Reset Form
                appointmentForm.reset();
                if (bookingDateInput) {
                    bookingDateInput.value = new Date().toISOString().split('T')[0];
                }
            }, 600);
        });
    }

    // Modal Close
    function closeModal() {
        confirmationModal.classList.remove('active');
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
    if (confirmationModal) {
        confirmationModal.addEventListener('click', (e) => {
            if (e.target === confirmationModal) closeModal();
        });
    }

    // 6. Active Navbar Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    });
});
