const fetch = require('node-fetch');

// Configuration
const WORKER_URL = 'http://localhost:8787';

async function runTest(name, payload, expectedStatus = 200) {
    console.log(`\nTesting: ${name}`);
    try {
        const response = await fetch(`${WORKER_URL}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.status === expectedStatus) {
            console.log(`PASSED: ${name}`);
            return true;
        } else {
            console.error(`FAILED: ${name}`);
            console.error(`   Expected Status: ${expectedStatus}`);
            console.error(`   Actual Status: ${response.status}`);
            console.error('   Response:', JSON.stringify(data, null, 2));
            return false;
        }
    } catch (error) {
        console.error(`FAILED: ${name} (Network Error)`);
        console.error('   Error:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('Starting Comprehensive Integration Tests...');
    console.log(`Target: ${WORKER_URL}`);

    let passed = 0;
    let failed = 0;

    // 1. Account Created
    const accountCreated = await runTest('Account Created', {
        to: 'test-account@example.com',
        subject: 'Welcome to Prerna',
        templateName: 'accountCreated',
        templateData: {
            user: { name: 'New User', email: 'test-account@example.com' }
        }
    });
    accountCreated ? passed++ : failed++;

    // 2. Password Reset
    const passwordReset = await runTest('Password Reset', {
        to: 'test-reset@example.com',
        subject: 'Reset Your Password',
        templateName: 'password-reset',
        templateData: {
            user: { name: 'Forgot User' },
            resetLink: 'https://example.com/reset?token=123'
        }
    });
    passwordReset ? passed++ : failed++;

    // 3. Payment Completed (Complex Data)
    const paymentCompleted = await runTest('Payment Completed', {
        to: 'test-payment@example.com',
        subject: 'Payment Receipt',
        templateName: 'paymentCompleted',
        templateData: {
            user: { name: 'Paying User' },
            payment: {
                amount: 1500.50,
                date: new Date().toISOString(),
                method: 'UPI',
                id: 'PAY-98765',
                items: [
                    { description: 'Service A', amount: 1000 },
                    { description: 'Tax', amount: 500.50 }
                ]
            }
        }
    });
    paymentCompleted ? passed++ : failed++;

    // 4. Service Request (Many fields)
    const serviceRequest = await runTest('Service Request', {
        to: 'admin@example.com',
        subject: 'New Service Request',
        templateName: 'serviceRequest',
        templateData: {
            requestId: 'REQ-001',
            submittedAt: new Date().toISOString(),
            customer: {
                name: 'Corporate Client',
                email: 'client@corp.com',
                phone: '555-0123',
                company: 'Corp Inc',
                address: '123 Biz Park'
            },
            service: {
                type: 'Consulting',
                description: 'Need help with architecture',
                preferredDate: '2025-01-01',
                preferredTime: '10:00 AM'
            },
            additionalNotes: 'Urgent',
            dashboardLink: 'https://admin.example.com/requests/REQ-001',
            currentYear: 2025,
            appName: 'Prerna Services'
        }
    });
    serviceRequest ? passed++ : failed++;

    // 5. Missing Fields (Edge Case)
    const missingFields = await runTest('Missing Fields', {
        to: 'test-fail@example.com',
        // Missing subject and templateName
    }, 400); // Expect 400 Bad Request
    missingFields ? passed++ : failed++;

    // 6. Account Created With Password
    const accountCreatedWithPassword = await runTest('Account Created With Password', {
        to: 'test-account-pw@example.com',
        subject: 'Welcome to Prerna',
        templateName: 'accountCreatedWithPassword',
        templateData: {
            user: { name: 'New User', email: 'test-account-pw@example.com' },
            temporaryPassword: 'temp-password-123',
            loginUrl: 'https://example.com/login',
            appName: 'Prerna Services'
        }
    });
    accountCreatedWithPassword ? passed++ : failed++;

    // 7. Event Notification
    const eventNotification = await runTest('Event Notification', {
        to: 'test-event@example.com',
        subject: 'Upcoming Event',
        templateName: 'eventNotification',
        templateData: {
            user: { name: 'Event Attendee' },
            notification: {
                title: 'Annual Conference',
                message: 'Join us for our annual conference.',
                actionUrl: 'https://example.com/event',
                actionText: 'Register Now'
            },
            event: {
                date: new Date().toISOString(),
                time: '10:00 AM',
                location: 'Virtual',
                duration: '2 hours',
                description: 'A deep dive into our services.'
            }
        }
    });
    eventNotification ? passed++ : failed++;

    // 8. Order Completed
    const orderCompleted = await runTest('Order Completed', {
        to: 'test-order-complete@example.com',
        subject: 'Order Complete',
        templateName: 'orderCompleted',
        templateData: {
            user: { name: 'Order Customer' },
            order: {
                id: 'ORD-123',
                date: new Date().toISOString(),
                total: 2500,
                trackingNumber: 'TRACK-999',
                shippingCarrier: 'FedEx',
                trackingUrl: 'https://fedex.com/track/TRACK-999'
            }
        }
    });
    orderCompleted ? passed++ : failed++;

    // 9. Order Received
    const orderReceived = await runTest('Order Received', {
        to: 'test-order-received@example.com',
        subject: 'Order Received',
        templateName: 'orderReceived',
        templateData: {
            user: { name: 'Shopper' },
            order: {
                id: 'ORD-456',
                date: new Date().toISOString(),
                total: 1200,
                items: [
                    { name: 'Product A', quantity: 2, price: 500 },
                    { name: 'Product B', quantity: 1, price: 200 }
                ]
            }
        }
    });
    orderReceived ? passed++ : failed++;

    // 10. Request Accepted
    const requestAccepted = await runTest('Request Accepted', {
        to: 'test-req-accept@example.com',
        subject: 'Request Accepted',
        templateName: 'requestAccepted',
        templateData: {
            user: { name: 'Requester' },
            request: {
                id: 'REQ-789',
                type: 'Consultation',
                status: 'Accepted',
                details: 'We have assigned a consultant to your case.'
            }
        }
    });
    requestAccepted ? passed++ : failed++;

    // 11. Request Recorded
    const requestRecorded = await runTest('Request Recorded', {
        to: 'test-req-record@example.com',
        subject: 'Request Recorded',
        templateName: 'requestRecorded',
        templateData: {
            user: { name: 'Requester' },
            request: {
                id: 'REQ-101',
                type: 'Support',
                date: new Date().toISOString(),
                status: 'Pending',
                details: 'Issue with login.'
            }
        }
    });
    requestRecorded ? passed++ : failed++;

    // 12. Service Completed
    const serviceCompleted = await runTest('Service Completed', {
        to: 'test-svc-complete@example.com',
        subject: 'Service Completed',
        templateName: 'serviceCompleted',
        templateData: {
            user: { name: 'Service User' },
            service: {
                name: 'Home Cleaning',
                startDate: new Date().toISOString(),
                completionDate: new Date().toISOString(),
                provider: 'CleanCo',
                referenceId: 'SVC-202',
                summary: 'All rooms cleaned.',
                feedbackUrl: 'https://example.com/feedback'
            }
        }
    });
    serviceCompleted ? passed++ : failed++;

    // 13. Service Started
    const serviceStarted = await runTest('Service Started', {
        to: 'test-svc-start@example.com',
        subject: 'Service Started',
        templateName: 'serviceStarted',
        templateData: {
            user: { name: 'Service User' },
            service: {
                id: 'SVC-303',
                name: 'Plumbing',
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                provider: 'PlumbFast',
                referenceId: 'REF-404',
                notes: 'Technician will arrive at 9 AM.'
            }
        }
    });
    serviceStarted ? passed++ : failed++;

    // 14. Invalid Template Name (Edge Case)
    // The worker currently queues everything, so this returns 200.
    // If we wanted to validate templates strictly, we'd need to change the worker.
    // For now, we expect 200.
    const invalidTemplate = await runTest('Invalid Template', {
        to: 'test-fail@example.com',
        subject: 'Fail',
        templateName: 'nonExistentTemplate',
        templateData: {}
    });
    invalidTemplate ? passed++ : failed++;

    console.log('\n-------------------');
    console.log(`Tests Completed: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log('-------------------');

    if (failed > 0) process.exit(1);
}

runAllTests();
