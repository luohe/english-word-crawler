import { DataService } from '../../src/services/dataService';
import { Database } from 'sqlite3';

describe('DataService', () => {
    let dataService: DataService;
    let db: Database;

    beforeAll(() => {
        db = new Database(':memory:'); // Use in-memory database for testing
        dataService = new DataService(db);
    });

    afterAll((done) => {
        db.close(done);
    });

    test('should initialize the database', async () => {
        await dataService.initializeDatabase();
        // Check if the necessary tables are created
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='your_table_name'", (err, row) => {
            expect(row).toBeTruthy();
        });
    });

    test('should insert data correctly', async () => {
        const sampleData = { key: 'value' };
        await dataService.insertData(sampleData);
        
        // Verify that the data was inserted
        db.get('SELECT * FROM your_table_name WHERE key = ?', ['value'], (err, row) => {
            expect(row).toBeTruthy();
            expect(row.key).toBe('value');
        });
    });

    test('should retrieve data correctly', async () => {
        const sampleData = { key: 'value' };
        await dataService.insertData(sampleData);
        
        const data = await dataService.getData('value');
        expect(data).toEqual(sampleData);
    });
});