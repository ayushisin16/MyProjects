import { test, expect } from '@playwright/test';

const bookstoreUser = {
    email: `tester${Date.now()}@bookstoreworld.com`,
    password: 'Pass123!word'
};

const invalidUser = {
    email: `wrong${Date.now()}@bookstoreworld.com`,
    password: 'IncorrectPassword!'
};

let authtoken: string;
let userBookId: number;

test.describe('Bookstore API Tests', () => {
    test('API responsive', async ({ request }) => {
        const response = await request.get('/health');
        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({ status: 'up' });
    });

    test('Register New User for first time', async ({ request }) => {
        const response = await request.post('/signup', { data: bookstoreUser });
        expect([200, 201, 409]).toContain(response.status());
    });

    test('Login with invalid Credentials)', async ({ request }) => {
        const response = await request.post('/login', { data: invalidUser });
        expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('Unauthorized Book creation Attempt', async ({ request }) => {
        const response = await request.post('/books/', {
            data: {
                name: 'Unauthorized Entry',
                author: 'Unknown Author',
                published_year: 2020,
                book_summary: 'Not to create entry'
            }
        });
        expect([401, 403]).toContain(response.status());
    });

    test('Create book with invalid feilds', async ({ request }) => {
        const response = await request.post('/books/', {
            data: {
                name: '',
                author: '',
                published_year: '####',
                book_summary: ''
            },
            headers: { Authorization: `Bearer ${authtoken}` }
        });
        expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('Book access without authentication must fail', async ({ request }) => {
        const response = await request.get(`/books/${userBookId}`);
        expect([401, 403]).toContain(response.status());
    });

    test('Get a book that doesnt exists', async ({ request }) => {
        const response = await request.get(`/books/123123`, {
            headers: { Authorization: `Bearer ${authtoken}` }
        });
        expect([404, 403]).toContain(response.status());
    });

    test('Update book fail if not logged in', async ({ request }) => {
        const response = await request.put(`/books/${userBookId}`, {
            data: {
                name: 'Updated Title',
                author: 'Jane Smith',
                published_year: 2026,
                book_summary: 'Updated content.'
            }
        });
        expect([401, 403]).toContain(response.status());
    });

    test('Update non exixting book record', async ({ request }) => {
        const response = await request.put(`/books/222222`, {
            data: {
                name: 'Fake Book',
                author: 'Nobody',
                published_year: 2018,
                book_summary: 'Book doesnt exist.'
            },
            headers: { Authorization: `Bearer ${authtoken}` }
        });
        expect([404, 403]).toContain(response.status());
    });

    test('Delete book without credential', async ({ request }) => {
        const response = await request.delete(`/books/${userBookId}`);
        expect([401, 403]).toContain(response.status());
    });

    test('Delete book thats already deleted', async ({ request }) => {
        const response = await request.delete(`/books/145145`, {
            headers: { Authorization: `Bearer ${authtoken}` }
        });
        expect([404, 403]).toContain(response.status());
    });

    test('Check delete book is already deletednpm', async ({ request }) => {
        const response = await request.get(`/books/${userBookId}`, {
            headers: { Authorization: `Bearer ${authtoken}` }
        });
        expect([404, 403]).toContain(response.status());
    });
});
