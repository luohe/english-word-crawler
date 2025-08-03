import request from 'supertest';
import app from '../../src/app'; // Adjust the path if necessary
import { Database } from 'sqlite3';

describe('Crawler Integration Tests', () => {
    let db: Database;

    beforeAll(async () => {
        // Initialize the database connection
        db = new Database(':memory:'); // Use in-memory database for testing
        // You can add code here to set up your database schema if needed
    });

    afterAll(async () => {
        // Close the database connection
        db.close();
    });

    it('should start a crawl and return results', async () => {
        const response = await request(app)
            .post('/api/crawl') // Adjust the route as per your implementation
            .send({ url: 'https://example.com' }); // Example payload

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data'); // Adjust based on your response structure
    });

    it('should handle errors gracefully', async () => {
        const response = await request(app)
            .post('/api/crawl')
            .send({ url: '' }); // Invalid payload

        expect(response.status).toBe(400); // Adjust based on your error handling
        expect(response.body).toHaveProperty('error'); // Adjust based on your response structure
    });
});